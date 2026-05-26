import moment from 'moment';
import { defaultSettings } from '../MomentContext';
import type { ContentContext } from './types';
import { renderDiff } from './renderDiff';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('renderDiff', () => {
  const datetime = moment(DATE_STRING);

  const ctx = (props: ContentContext['props']): ContentContext => ({
    props,
    datetime,
    format:        undefined,
    fromNowPeriod: false,
    settings:      defaultSettings
  });

  it('returns undefined when diff is omitted', () => {
    expect(renderDiff(ctx({ children: DATE_STRING }))).toBeUndefined();
  });

  it('returns numeric diff output', () => {
    expect(renderDiff(ctx({ diff: '2016-09-20T12:00', children: DATE_STRING })))
      .toEqual(datetime.diff('2016-09-20T12:00'));
  });

  it('passes unit to moment.diff', () => {
    expect(renderDiff(ctx({ diff: '2016-09-20T12:00', unit: 'days', children: DATE_STRING })))
      .toEqual(datetime.diff('2016-09-20T12:00', 'days'));
  });

  it('passes decimal to moment.diff', () => {
    expect(renderDiff(ctx({
      diff:     '2016-09-20T12:00',
      unit:     'years',
      decimal:  true,
      children: DATE_STRING
    }))).toEqual(datetime.diff('2016-09-20T12:00', 'years', true));
  });
});
