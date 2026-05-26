import moment from 'moment';
import 'moment-timezone';
import type { Filter } from './types';
import { makeSettings } from './testHelpers';
import {
  getMomentRef,
  getDatetime,
  getShortRelativeTime,
  getContent,
  getTitle
} from './utils';

const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';
const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_DATE = new Date(DATE_STRING);
const DATE_UNIX = DATE_DATE.getTime() / 1000;

describe('utils', () => {
  const settings = makeSettings();

  describe('getMomentRef', () => {
    it('returns bundled moment when settings.moment is null', () => {
      expect(getMomentRef(makeSettings({ moment: null }))).toBe(moment);
    });

    it('returns a custom settings.moment when set', () => {
      const customMoment = moment;
      expect(getMomentRef(makeSettings({ moment: customMoment }))).toBe(customMoment);
    });
  });

  describe('getDatetime', () => {
    it('parses date from children', () => {
      const datetime = getDatetime({ children: DATE_STRING }, settings);
      expect(datetime.toString()).toEqual(DATE_OUTPUT);
    });

    it('prefers date prop over children', () => {
      const datetime = getDatetime({
        date: DATE_STRING,
        children: '2000-01-01'
      }, settings);
      expect(datetime.toString()).toEqual(DATE_OUTPUT);
    });

    it('defaults to now when no input is given', () => {
      const datetime = getDatetime({}, settings);
      expect(datetime.toString()).toEqual(moment().toString());
    });

    it('parses with parse format', () => {
      const datetime = getDatetime({
        children: '1976-04-19 12:59',
        parse: 'YYYY-MM-DD HH:mm'
      }, settings);
      expect(datetime.toString()).toEqual(DATE_OUTPUT);
    });

    it('parses unix timestamps', () => {
      const datetime = getDatetime({ unix: true, children: DATE_UNIX }, settings);
      expect(datetime.toString()).toEqual(DATE_OUTPUT);
    });

    it('parses utc input', () => {
      const datetime = getDatetime({ utc: true, children: '1976-04-19T12:59' }, settings);
      expect(datetime.toString()).toEqual('Mon Apr 19 1976 12:59:00 GMT+0000');
    });

    it('applies timezone', () => {
      const datetime = getDatetime({
        unix: true,
        tz: 'America/Los_Angeles',
        children: DATE_UNIX
      }, settings);
      expect(datetime.toString()).toEqual('Mon Apr 19 1976 09:59:00 GMT-0800');
    });

    it('applies local conversion', () => {
      const datetime = getDatetime({ local: true, children: DATE_STRING }, settings);
      expect(datetime.toString()).toEqual(moment(DATE_STRING).local().toString());
    });

    it('respects settings.parse', () => {
      const withParse = makeSettings({ parse: 'YYYY-MM-DD HH:mm' });
      const datetime = getDatetime({ children: '1976-04-19 12:59' }, withParse);
      expect(datetime.toString()).toEqual(DATE_OUTPUT);
    });

    it('respects settings.timezone', () => {
      const withTimezone = makeSettings({ timezone: 'America/Los_Angeles' });
      const datetime = getDatetime({ children: DATE_STRING }, withTimezone);
      expect(datetime.format('YYYY-MM-DD HH')).toEqual('1976-04-19 09');
    });

    it('respects settings.local', () => {
      const withLocal = makeSettings({ local: true });
      const datetime = getDatetime({ children: DATE_STRING }, withLocal);
      expect(datetime.toString()).toEqual(moment(DATE_STRING).local().toString());
    });

    it('respects settings.locale', () => {
      const withLocale = makeSettings({ locale: 'fr' });
      const datetime = getDatetime({ children: '1976-04-19T12:59-0500' }, withLocale);
      expect(datetime.format('D MMM YYYY')).toEqual('19 avr. 1976');
    });

    it('locale prop overrides settings.locale', () => {
      const withLocale = makeSettings({ locale: 'fr' });
      const datetime = getDatetime({
        locale: 'en',
        children: '1976-04-19T12:59-0500'
      }, withLocale);
      expect(datetime.format('D MMM YYYY')).toEqual('19 Apr 1976');
    });
  });

  describe('getShortRelativeTime', () => {
    it('returns compact units for common spans', () => {
      expect(getShortRelativeTime(moment().add(-1, 'hour'), settings)).toEqual('1h');
      expect(getShortRelativeTime(moment().add(-1, 'day'), settings)).toEqual('1d');
      expect(getShortRelativeTime(moment().add(-2, 'weeks'), settings)).toEqual('14d');
      expect(getShortRelativeTime(moment().add(-3, 'months'), settings)).toEqual('3mo');
      expect(getShortRelativeTime(moment().add(-2, 'years'), settings)).toEqual('2y');
    });

    it('returns 1s for times within the ss threshold', () => {
      expect(getShortRelativeTime(moment().subtract(30, 'seconds'), settings)).toEqual('1s');
      expect(getShortRelativeTime(moment().subtract(5, 'seconds'), settings)).toEqual('1s');
    });

    it('does not mutate locale settings', () => {
      const localeBefore = moment.locale();
      getShortRelativeTime(moment().add(-1, 'hour'), settings);
      expect(moment.locale()).toEqual(localeBefore);
    });
  });

  describe('getContent', () => {
    it('formats with format prop', () => {
      expect(getContent({ format: 'YYYY-MM-DD', children: DATE_STRING }, settings))
        .toEqual('1976-04-19');
    });

    it('uses settings.format when format is omitted', () => {
      const withFormat = makeSettings({ format: 'YYYY-MM-DD' });
      expect(getContent({ children: DATE_STRING }, withFormat)).toEqual('1976-04-19');
    });

    it('returns default toString when no output mode is set', () => {
      expect(getContent({ children: DATE_STRING }, settings)).toEqual(DATE_OUTPUT);
    });

    it('applies add and subtract before formatting', () => {
      expect(getContent({ add: { days: 1 }, fromNow: true, children: new Date() }, settings))
        .toEqual('in a day');
      expect(getContent({ subtract: { days: 1 }, fromNow: true, children: new Date() }, settings))
        .toEqual('a day ago');
    });

    it('returns fromNow output', () => {
      expect(getContent({ fromNow: true, children: DATE_STRING }, settings))
        .toEqual(moment(DATE_STRING).fromNow());
      expect(getContent({ fromNow: true, ago: true, children: DATE_STRING }, settings))
        .toEqual(moment(DATE_STRING).fromNow(true));
    });

    it('returns fromNowShort output', () => {
      const oneHourAgo = moment().add(-1, 'hour');
      expect(getContent({ fromNowShort: true, children: oneHourAgo.format() }, settings))
        .toEqual('1h');
    });

    it('switches between fromNow and format during fromNowDuring', () => {
      const twoHoursAgo = moment().add(-2, 'hours');
      const hour = 1e3 * 60 * 60;
      const iso = twoHoursAgo.format();

      expect(getContent({
        format: 'YYYY-MM-DD HH:mm',
        fromNowDuring: 3 * hour,
        children: iso
      }, settings)).toEqual(twoHoursAgo.fromNow());

      expect(getContent({
        format: 'YYYY-MM-DD HH:mm',
        fromNowDuring: 1 * hour,
        children: iso
      }, settings)).toEqual(twoHoursAgo.format('YYYY-MM-DD HH:mm'));
    });

    it('returns from output', () => {
      expect(getContent({ from: '2016-09-20T12:00', children: DATE_STRING }, settings))
        .toEqual(moment(DATE_STRING).from('2016-09-20T12:00'));
      expect(getContent({ from: '2016-09-20T12:00', ago: true, children: DATE_STRING }, settings))
        .toEqual(moment(DATE_STRING).from('2016-09-20T12:00', true));
    });

    it('returns diff output', () => {
      expect(getContent({ diff: '2016-09-20T12:00', children: DATE_STRING }, settings))
        .toEqual(moment(DATE_STRING).diff('2016-09-20T12:00'));
      expect(getContent({
        diff: '2016-09-20T12:00',
        unit: 'days',
        children: DATE_STRING
      }, settings)).toEqual(moment(DATE_STRING).diff('2016-09-20T12:00', 'days'));
      expect(getContent({
        diff: '2016-09-20T12:00',
        unit: 'years',
        decimal: true,
        children: DATE_STRING
      }, settings)).toEqual(moment(DATE_STRING).diff('2016-09-20T12:00', 'years', true));
    });

    it('returns toNow and to output', () => {
      expect(getContent({ toNow: true, children: DATE_STRING }, settings))
        .toEqual(moment(DATE_STRING).toNow());
      expect(getContent({ to: '2016-09-20T12:00', children: DATE_STRING }, settings))
        .toEqual(moment(DATE_STRING).to('2016-09-20T12:00'));
    });

    it('returns calendar output', () => {
      expect(getContent({ calendar: true, children: DATE_STRING }, settings))
        .toEqual(moment(DATE_STRING).calendar());
      expect(getContent({
        calendar: { sameElse: 'YYYY-MM-DD HH:mm' },
        children: DATE_STRING
      }, settings)).toEqual(moment(DATE_STRING).calendar(
        null as unknown as moment.MomentInput,
        { sameElse: 'YYYY-MM-DD HH:mm' }
      ));
    });

    it('returns formatted duration output', () => {
      const durationStart = moment();
      const durationEnd = moment().add(-2, 'hours');

      const expected = (moment.duration(durationStart.diff(durationEnd)) as unknown as {
        format: (template?: string) => string;
      }).format();

      expect(getContent({
        duration: durationEnd.format(),
        date: durationStart.format()
      }, settings)).toEqual(expected);
    });

    it('returns formatted durationFromNow output', () => {
      const start = moment('2020-01-01T12:00:00');
      const props = {
        date: start.format(),
        format: 'hh:mm:ss',
        durationFromNow: true
      };
      const expected = (moment.duration(moment().diff(getDatetime(props, settings))) as unknown as {
        format: (template?: string) => string;
      }).format('hh:mm:ss');

      expect(getContent(props, settings)).toEqual(expected);
    });

    it('applies trim when formatting durations', () => {
      const durationStart = moment();
      const durationEnd = moment().add(-2, 'hour').add(-5, 'minute');
      const diffMs = durationStart.diff(durationEnd);

      const expected = (moment.duration(diffMs) as unknown as {
        format: (template?: string, options?: { trim?: unknown }) => string;
      }).format('H:mm', { trim: 'small' });

      expect(getContent({
        duration: durationEnd.format(),
        date: durationStart.format(),
        format: 'H:mm',
        trim: 'small'
      }, settings)).toEqual(expected);
    });

    it('applies prop and settings filters', () => {
      const filter: Filter = (value) => (typeof value === 'string' ? value.toUpperCase() : value);
      expect(getContent({
        parse: 'YYYY-MM-DD HH:mm',
        filters: [filter],
        children: '1976-04-19 12:59'
      }, settings)).toEqual(DATE_OUTPUT.toUpperCase());

      const withFilter = makeSettings({ filters: [filter] });
      expect(getContent({
        parse: 'YYYY-MM-DD HH:mm',
        children: '1976-04-19 12:59'
      }, withFilter)).toEqual(DATE_OUTPUT.toUpperCase());
    });
  });

  describe('getTitle', () => {
    it('formats with titleFormat', () => {
      expect(getTitle({
        titleFormat: 'YYYY-MM-DD',
        children: DATE_STRING
      }, settings)).toEqual('1976-04-19');
    });

    it('falls back to settings.format', () => {
      const withFormat = makeSettings({ format: 'YYYY-MM-DD' });
      expect(getTitle({ children: DATE_STRING }, withFormat)).toEqual('1976-04-19');
    });

    it('uses moment default formatting when no title format is configured', () => {
      expect(getTitle({ children: DATE_STRING }, settings))
        .toEqual(getDatetime({ children: DATE_STRING }, settings).format(''));
    });
  });
});
