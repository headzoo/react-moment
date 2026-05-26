import moment from 'moment';
import { defaultSettings } from '../MomentContext';
import type { ContentContext } from './types';
import { renderToNow } from './renderToNow';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('renderToNow', () => {
  const datetime = moment(DATE_STRING);

  const ctx = (props: ContentContext['props']): ContentContext => ({
    props,
    datetime,
    format:        undefined,
    fromNowPeriod: false,
    settings:      defaultSettings
  });

  it('returns undefined when toNow is omitted', () => {
    expect(renderToNow(ctx({ children: DATE_STRING }))).toBeUndefined();
  });

  it('returns toNow output when toNow is set', () => {
    expect(renderToNow(ctx({ toNow: true, children: DATE_STRING })))
      .toEqual(datetime.toNow());
  });

  it('passes ago to moment.toNow', () => {
    expect(renderToNow(ctx({ toNow: true, ago: true, children: DATE_STRING })))
      .toEqual(datetime.toNow(true));
  });
});
