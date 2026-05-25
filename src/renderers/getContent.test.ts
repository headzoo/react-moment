import moment from 'moment';
import 'moment-duration-format';
import Moment from '../index';
import type { Filter } from '../types';
import { getContent } from './getContent';

const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';

describe('getContent', () => {
  beforeEach(() => {
    Moment.settings = {
      moment: null,
      locale: null,
      local: null,
      format: null,
      parse: null,
      filter: null,
      filters: null,
      renderers: null,
      element: 'time',
      timezone: null
    };
  });

  it('uses the first matching renderer in registry order', () => {
    expect(getContent({
      format: 'YYYY-MM-DD',
      from: '2016-09-20T12:00',
      children: DATE_STRING
    })).toEqual('1976-04-19');
  });

  it('falls back to renderDefault when no mode matches', () => {
    expect(getContent({ children: DATE_STRING })).toEqual(DATE_OUTPUT);
  });

  it('applies date adjustments before rendering', () => {
    expect(getContent({ add: { days: 1 }, format: 'YYYY-MM-DD', children: DATE_STRING }))
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
    })).toEqual(expected);
  });

  it('applies the content filter after rendering', () => {
    const filter: Filter = (value) => (typeof value === 'string' ? value.toUpperCase() : value);
    expect(getContent({
      format: 'YYYY-MM-DD',
      filter,
      children: DATE_STRING
    })).toEqual('1976-04-19'.toUpperCase());
  });

  it('uses custom renderers before built-in renderers', () => {
    expect(getContent({
      format: 'YYYY-MM-DD',
      children: DATE_STRING,
      renderers: [() => 'custom output']
    })).toEqual('custom output');
  });

  it('falls through custom renderers that return undefined', () => {
    expect(getContent({
      format: 'YYYY-MM-DD',
      children: DATE_STRING,
      renderers: [() => undefined]
    })).toEqual('1976-04-19');
  });

  it('uses settings.renderers when props.renderers is omitted', () => {
    Moment.settings.renderers = [() => 'global output'];
    expect(getContent({ children: DATE_STRING })).toEqual('global output');
  });

  it('prefers props.renderers over settings.renderers', () => {
    Moment.settings.renderers = [() => 'global output'];
    expect(getContent({
      children: DATE_STRING,
      renderers: [() => 'prop output']
    })).toEqual('prop output');
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
    })).toEqual('1976-04-19!'.toUpperCase());
  });
});
