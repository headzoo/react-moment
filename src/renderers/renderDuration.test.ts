import moment from 'moment';
import type { ContentContext } from './types';
import { renderDuration } from './renderDuration';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('renderDuration', () => {
  const datetime = moment(DATE_STRING);
  const durationEnd = moment().add(-2, 'hours');

  const ctx = (props: ContentContext['props']): ContentContext => ({
    props,
    datetime,
    format: undefined,
    fromNowPeriod: false
  });

  it('returns undefined when duration is omitted', () => {
    expect(renderDuration(ctx({ children: DATE_STRING }))).toBeUndefined();
  });

  it('returns raw diff in milliseconds for duration mode', () => {
    const durationEndStr = durationEnd.format();
    expect(renderDuration(ctx({
      duration: durationEndStr,
      date: datetime.format()
    }))).toEqual(datetime.diff(moment(durationEndStr)));
  });
});
