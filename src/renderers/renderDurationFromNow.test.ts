import moment from 'moment';
import type { ContentContext } from './types';
import { renderDurationFromNow } from './renderDurationFromNow';

describe('renderDurationFromNow', () => {
  const datetime = moment('2020-01-01T12:00:00');

  const ctx = (props: ContentContext['props']): ContentContext => ({
    props,
    datetime,
    format: undefined,
    fromNowPeriod: false
  });

  it('returns undefined when durationFromNow is omitted', () => {
    expect(renderDurationFromNow(ctx({ date: datetime.format() }))).toBeUndefined();
  });

  it('returns raw diff in milliseconds from now', () => {
    expect(renderDurationFromNow(ctx({ durationFromNow: true, date: datetime.format() })))
      .toEqual(moment().diff(datetime));
  });
});
