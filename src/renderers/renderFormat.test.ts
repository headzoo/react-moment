import moment from 'moment';
import type { ContentContext } from './types';
import { renderFormat } from './renderFormat';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('renderFormat', () => {
  const datetime = moment(DATE_STRING);

  const ctx = (overrides: Partial<ContentContext> = {}): ContentContext => ({
    props: { children: DATE_STRING },
    datetime,
    format: 'YYYY-MM-DD',
    fromNowPeriod: false,
    ...overrides
  });

  it('returns formatted output when format is set', () => {
    expect(renderFormat(ctx())).toEqual('1976-04-19');
  });

  it('returns undefined when format is omitted', () => {
    expect(renderFormat(ctx({ format: undefined }))).toBeUndefined();
  });

  it('returns undefined during fromNowPeriod', () => {
    expect(renderFormat(ctx({ fromNowPeriod: true }))).toBeUndefined();
  });

  it('returns undefined when duration is set', () => {
    expect(renderFormat(ctx({ props: { children: DATE_STRING, duration: true } }))).toBeUndefined();
  });

  it('returns undefined when durationFromNow is set', () => {
    expect(renderFormat(ctx({ props: { children: DATE_STRING, durationFromNow: true } }))).toBeUndefined();
  });
});
