import moment from 'moment';
import type { ContentContext } from './types';
import { renderFromNow } from './renderFromNow';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('renderFromNow', () => {
  const datetime = moment(DATE_STRING);

  const ctx = (overrides: Partial<ContentContext> = {}): ContentContext => ({
    props: { children: DATE_STRING },
    datetime,
    format: undefined,
    fromNowPeriod: false,
    ...overrides
  });

  it('returns undefined when fromNow and fromNowPeriod are both false', () => {
    expect(renderFromNow(ctx())).toBeUndefined();
  });

  it('returns fromNow output when fromNow is set', () => {
    expect(renderFromNow(ctx({ props: { fromNow: true, children: DATE_STRING } })))
      .toEqual(datetime.fromNow());
  });

  it('returns fromNow output during fromNowPeriod', () => {
    expect(renderFromNow(ctx({ fromNowPeriod: true })))
      .toEqual(datetime.fromNow());
  });

  it('passes ago to moment.fromNow', () => {
    expect(renderFromNow(ctx({ props: { fromNow: true, ago: true, children: DATE_STRING } })))
      .toEqual(datetime.fromNow(true));
  });
});
