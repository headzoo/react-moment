import moment from 'moment';
import { defaultSettings } from '../MomentContext';
import type { ContentContext } from './types';
import { renderTo } from './renderTo';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('renderTo', () => {
  const datetime = moment(DATE_STRING);

  const ctx = (props: ContentContext['props']): ContentContext => ({
    props,
    datetime,
    format: undefined,
    fromNowPeriod: false,
    settings: defaultSettings
  });

  it('returns undefined when to is omitted', () => {
    expect(renderTo(ctx({ children: DATE_STRING }))).toBeUndefined();
  });

  it('returns interval-to output', () => {
    expect(renderTo(ctx({ to: '2016-09-20T12:00', children: DATE_STRING })))
      .toEqual(datetime.to('2016-09-20T12:00'));
  });

  it('passes ago to moment.to', () => {
    expect(renderTo(ctx({ to: '2016-09-20T12:00', ago: true, children: DATE_STRING })))
      .toEqual(datetime.to('2016-09-20T12:00', true));
  });
});
