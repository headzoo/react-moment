import moment from 'moment';
import '../setupMomentDurationFormat';
import type { Filter } from '../types';
import { makeSettings } from '../testHelpers';
import { type FormattableDuration } from './formatDurationContent';
import { getContent } from './getContent';

const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';

describe('getContent', () => {
  const settings = makeSettings();

  it('uses the first matching renderer in registry order', () => {
    expect(getContent({
      format:   'YYYY-MM-DD',
      from:     '2016-09-20T12:00',
      children: DATE_STRING
    }, settings)).toEqual('1976-04-19');
  });

  it('falls back to renderDefault when no mode matches', () => {
    expect(getContent({ children: DATE_STRING }, settings)).toEqual(DATE_OUTPUT);
  });

  it('returns empty content for invalid date input', () => {
    expect(getContent({ children: 'not-a-date' }, settings)).toEqual('');
  });

  it('returns fallback content for invalid date input when fallback is set', () => {
    expect(getContent({ children: 'not-a-date', fallback: 'N/A' }, settings)).toEqual('N/A');
  });

  it('warns in development when date input is invalid', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    getContent({ children: 'not-a-date' }, settings);

    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });

  it('applies date adjustments before rendering', () => {
    expect(getContent({ add: { days: 1 }, format: 'YYYY-MM-DD', children: DATE_STRING }, settings))
      .toEqual('1976-04-20');
  });

  it('formats duration output after the duration renderer runs', () => {
    const durationStart = moment();
    const durationEnd = moment().add(-2, 'hours');
    const expected = (moment.duration(durationStart.diff(durationEnd)) as FormattableDuration)
      .format('H:mm');

    expect(getContent({
      duration: durationEnd.format(),
      date:     durationStart.format(),
      format:   'H:mm'
    }, settings)).toEqual(expected);
  });

  it('applies the content filter after rendering', () => {
    const filter: Filter = value => (typeof value === 'string' ? value.toUpperCase() : value);
    expect(getContent({
      format:   'YYYY-MM-DD',
      filters:  [filter],
      children: DATE_STRING
    }, settings)).toEqual('1976-04-19'.toUpperCase());
  });

  it('uses custom renderers before built-in renderers', () => {
    expect(getContent({
      format:    'YYYY-MM-DD',
      children:  DATE_STRING,
      renderers: [() => 'custom output']
    }, settings)).toEqual('custom output');
  });

  it('falls through custom renderers that return undefined', () => {
    expect(getContent({
      format:    'YYYY-MM-DD',
      children:  DATE_STRING,
      renderers: [() => undefined]
    }, settings)).toEqual('1976-04-19');
  });

  it('uses settings.renderers when props.renderers is omitted', () => {
    const withRenderers = makeSettings({ renderers: [() => 'global output'] });
    expect(getContent({ children: DATE_STRING }, withRenderers)).toEqual('global output');
  });

  it('merges provider and instance renderers with provider first', () => {
    const withRenderers = makeSettings({ renderers: [() => 'provider output'] });
    expect(getContent({
      children:  DATE_STRING,
      renderers: [() => 'instance output']
    }, withRenderers)).toEqual('provider output');
  });

  it('falls through merged provider renderers to instance renderers', () => {
    const withRenderers = makeSettings({ renderers: [() => undefined] });
    expect(getContent({
      children:  DATE_STRING,
      renderers: [() => 'instance output']
    }, withRenderers)).toEqual('instance output');
  });

  it('chains filters through getContent', () => {
    const appendSuffix: Filter = value => (
      typeof value === 'string' ? `${value}!` : value
    );
    const filter: Filter = value => (
      typeof value === 'string' ? value.toUpperCase() : value
    );
    expect(getContent({
      format:   'YYYY-MM-DD',
      filters:  [appendSuffix, filter],
      children: DATE_STRING
    }, settings)).toEqual('1976-04-19!'.toUpperCase());
  });

  it('falls through to the next renderer when a custom renderer throws', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(getContent({
      children:  DATE_STRING,
      renderers: [
        () => { throw new Error('bad'); },
        () => 'ok'
      ]
    }, settings)).toEqual('ok');

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('falls through to built-in renderers when a custom renderer throws', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(getContent({
      format:    'YYYY-MM-DD',
      children:  DATE_STRING,
      renderers: [() => { throw new Error('bad'); }]
    }, settings)).toEqual('1976-04-19');

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('skips a throwing filter and continues the chain through getContent', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const appendSuffix: Filter = value => (
      typeof value === 'string' ? `${value}!` : value
    );
    const throwingFilter: Filter = () => { throw new Error('bad'); };

    expect(getContent({
      format:  'YYYY-MM-DD',
      filters: [appendSuffix, throwingFilter, value => (
        typeof value === 'string' ? value.toUpperCase() : value
      )],
      children: DATE_STRING
    }, settings)).toEqual('1976-04-19!'.toUpperCase());

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('uses settings.moment now() for fromNowDuring threshold', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    const customMoment = Object.assign(
      (...args: Parameters<typeof moment>) => (
        args.length === 0 ? moment(fixedNow.valueOf()) : moment(...args)
      ),
      moment,
      { now: () => fixedNow.valueOf() }
    ) as typeof moment;
    const customSettings = makeSettings({ moment: customMoment });
    const oneHourAgo = customMoment(fixedNow).subtract(1, 'hour');
    const hour = 1e3 * 60 * 60;
    const iso = oneHourAgo.format();
    const formatted = oneHourAgo.format('YYYY-MM-DD HH:mm');

    expect(getContent({
      format:        'YYYY-MM-DD HH:mm',
      fromNowDuring: 3 * hour,
      children:      iso
    }, customSettings)).not.toEqual(formatted);

    expect(getContent({
      format:        'YYYY-MM-DD HH:mm',
      fromNowDuring: 1 * hour,
      children:      iso
    }, customSettings)).toEqual(formatted);
  });
});
