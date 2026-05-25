import moment from 'moment';
import 'moment-duration-format';
import type { Filter } from '../types';
import { makeSettings } from '../testHelpers';
import { getContent } from './getContent';

const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';

describe('getContent', () => {
  const settings = makeSettings();

  it('uses the first matching renderer in registry order', () => {
    expect(getContent({
      format: 'YYYY-MM-DD',
      from: '2016-09-20T12:00',
      children: DATE_STRING
    }, settings)).toEqual('1976-04-19');
  });

  it('falls back to renderDefault when no mode matches', () => {
    expect(getContent({ children: DATE_STRING }, settings)).toEqual(DATE_OUTPUT);
  });

  it('applies date adjustments before rendering', () => {
    expect(getContent({ add: { days: 1 }, format: 'YYYY-MM-DD', children: DATE_STRING }, settings))
      .toEqual('1976-04-20');
  });

  it('formats duration output after the duration renderer runs', () => {
    const durationStart = moment();
    const durationEnd = moment().add(-2, 'hours');
    const expected = (moment.duration(durationStart.diff(durationEnd)) as unknown as {
      format: (template?: string) => string;
    }).format('H:mm');

    expect(getContent({
      duration: durationEnd.format(),
      date: durationStart.format(),
      format: 'H:mm'
    }, settings)).toEqual(expected);
  });

  it('applies the content filter after rendering', () => {
    const filter: Filter = (value) => (typeof value === 'string' ? value.toUpperCase() : value);
    expect(getContent({
      format: 'YYYY-MM-DD',
      filter,
      children: DATE_STRING
    }, settings)).toEqual('1976-04-19'.toUpperCase());
  });

  it('uses custom renderers before built-in renderers', () => {
    expect(getContent({
      format: 'YYYY-MM-DD',
      children: DATE_STRING,
      renderers: [() => 'custom output']
    }, settings)).toEqual('custom output');
  });

  it('falls through custom renderers that return undefined', () => {
    expect(getContent({
      format: 'YYYY-MM-DD',
      children: DATE_STRING,
      renderers: [() => undefined]
    }, settings)).toEqual('1976-04-19');
  });

  it('uses settings.renderers when props.renderers is omitted', () => {
    const withRenderers = makeSettings({ renderers: [() => 'global output'] });
    expect(getContent({ children: DATE_STRING }, withRenderers)).toEqual('global output');
  });

  it('prefers props.renderers over settings.renderers', () => {
    const withRenderers = makeSettings({ renderers: [() => 'global output'] });
    expect(getContent({
      children: DATE_STRING,
      renderers: [() => 'prop output']
    }, withRenderers)).toEqual('prop output');
  });

  it('chains filters through getContent', () => {
    const appendSuffix: Filter = (value) => (
      typeof value === 'string' ? `${value}!` : value
    );
    const filter: Filter = (value) => (
      typeof value === 'string' ? value.toUpperCase() : value
    );
    expect(getContent({
      format: 'YYYY-MM-DD',
      filters: [appendSuffix],
      filter,
      children: DATE_STRING
    }, settings)).toEqual('1976-04-19!'.toUpperCase());
  });
});
