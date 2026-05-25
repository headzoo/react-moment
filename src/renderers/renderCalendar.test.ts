import moment from 'moment';
import type { ContentContext } from './types';
import { renderCalendar } from './renderCalendar';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('renderCalendar', () => {
  const datetime = moment(DATE_STRING);

  const ctx = (props: ContentContext['props']): ContentContext => ({
    props,
    datetime,
    format: undefined,
    fromNowPeriod: false
  });

  it('returns undefined when calendar is omitted', () => {
    expect(renderCalendar(ctx({ children: DATE_STRING }))).toBeUndefined();
  });

  it('returns calendar output when calendar is true', () => {
    expect(renderCalendar(ctx({ calendar: true, children: DATE_STRING })))
      .toEqual(datetime.calendar());
  });

  it('returns calendar output with a custom calendar spec', () => {
    const spec = { sameElse: 'YYYY-MM-DD HH:mm' };
    expect(renderCalendar(ctx({ calendar: spec, children: DATE_STRING })))
      .toEqual(datetime.calendar(null as unknown as moment.MomentInput, spec));
  });
});
