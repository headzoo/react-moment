import moment from 'moment';
import { makeSettings } from '../testHelpers';
import type { ContentContext } from './types';
import { renderDurationFromNow } from './renderDurationFromNow';

describe('renderDurationFromNow', () => {
  const datetime = moment('2020-01-01T12:00:00');

  const ctx = (
    props: ContentContext['props'],
    settings = makeSettings()
  ): ContentContext => ({
    props,
    datetime,
    format:        undefined,
    fromNowPeriod: false,
    settings
  });

  it('returns undefined when durationFromNow is omitted', () => {
    expect(renderDurationFromNow(ctx({ date: datetime.format() }))).toBeUndefined();
  });

  it('returns raw diff in milliseconds from now', () => {
    const now = moment();
    moment.now = () => now.valueOf();

    expect(renderDurationFromNow(ctx({ durationFromNow: true, date: datetime.format() })))
      .toEqual(now.diff(datetime));
  });

  it('uses settings.moment now() for durationFromNow diff', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    const customMoment = Object.assign(
      (...args: Parameters<typeof moment>) => (
        args.length === 0 ? moment(fixedNow.valueOf()) : moment(...args)
      ),
      moment,
      { now: () => fixedNow.valueOf() }
    ) as typeof moment;
    const settings = makeSettings({ moment: customMoment });

    expect(renderDurationFromNow(ctx(
      { durationFromNow: true, date: datetime.format() },
      settings
    ))).toEqual(customMoment().diff(datetime));
  });
});
