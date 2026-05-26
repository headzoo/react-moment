import moment from 'moment';
import { defaultSettings } from '../MomentContext';
import type { ContentContext } from './types';
import { renderFrom } from './renderFrom';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('renderFrom', () => {
  const datetime = moment(DATE_STRING);

  const ctx = (props: ContentContext['props']): ContentContext => ({
    props,
    datetime,
    format: undefined,
    fromNowPeriod: false,
    settings: defaultSettings
  });

  it('returns undefined when from is omitted', () => {
    expect(renderFrom(ctx({ children: DATE_STRING }))).toBeUndefined();
  });

  it('returns interval-from output', () => {
    expect(renderFrom(ctx({ from: '2016-09-20T12:00', children: DATE_STRING })))
      .toEqual(datetime.from('2016-09-20T12:00'));
  });

  it('passes ago to moment.from', () => {
    expect(renderFrom(ctx({ from: '2016-09-20T12:00', ago: true, children: DATE_STRING })))
      .toEqual(datetime.from('2016-09-20T12:00', true));
  });
});
