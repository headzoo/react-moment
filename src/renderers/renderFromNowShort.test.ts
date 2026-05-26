import moment from 'moment';
import { defaultSettings } from '../MomentContext';
import type { ContentContext } from './types';
import { renderFromNowShort } from './renderFromNowShort';

describe('renderFromNowShort', () => {
  const datetime = moment().add(-1, 'hour');

  const ctx = (props: ContentContext['props']): ContentContext => ({
    props,
    datetime,
    format: undefined,
    fromNowPeriod: false,
    settings: defaultSettings
  });

  it('returns undefined when fromNowShort is omitted', () => {
    expect(renderFromNowShort(ctx({ children: datetime.format() }))).toBeUndefined();
  });

  it('returns compact relative time when fromNowShort is set', () => {
    expect(renderFromNowShort(ctx({ fromNowShort: true, children: datetime.format() })))
      .toEqual('1h');
  });
});
