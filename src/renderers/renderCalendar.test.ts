import moment from 'moment';
import { makeSettings } from '../testHelpers';
import type { ContentContext } from './types';
import { renderCalendar } from './renderCalendar';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('renderCalendar', () => {
  const datetime = moment(DATE_STRING);
  const settings = makeSettings();
  const reference = moment();

  const ctx = (
    props: ContentContext['props'],
    ctxSettings = settings
  ): ContentContext => ({
    props,
    datetime,
    format:        undefined,
    fromNowPeriod: false,
    settings:      ctxSettings
  });

  it('returns undefined when calendar is omitted', () => {
    expect(renderCalendar(ctx({ children: DATE_STRING }))).toBeUndefined();
  });

  it('returns calendar output when calendar is true', () => {
    expect(renderCalendar(ctx({ calendar: true, children: DATE_STRING })))
      .toEqual(datetime.calendar(reference));
  });

  it('returns calendar output with a custom calendar spec', () => {
    const spec = { sameElse: 'YYYY-MM-DD HH:mm' };
    expect(renderCalendar(ctx({ calendar: spec, children: DATE_STRING })))
      .toEqual(datetime.calendar(reference, spec));
  });

  it('uses settings.moment for the calendar reference time', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    const customMoment = Object.assign(
      (...args: Parameters<typeof moment>) => (
        args.length === 0 ? moment(fixedNow.valueOf()) : moment(...args)
      ),
      moment,
      { now: () => fixedNow.valueOf() }
    ) as typeof moment;
    const customSettings = makeSettings({ moment: customMoment });

    expect(renderCalendar(ctx({ calendar: true, children: DATE_STRING }, customSettings)))
      .toEqual(datetime.calendar(customMoment()));
  });
});
