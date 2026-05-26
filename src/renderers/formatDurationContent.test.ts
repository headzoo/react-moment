import moment from 'moment';
import { makeSettings } from '../testHelpers';
import type { ContentContext } from './types';
import { formatDurationContent, type FormattableDuration } from './formatDurationContent';

describe('formatDurationContent', () => {
  const diffMs = 2 * 60 * 60 * 1000 + 5 * 60 * 1000;
  const settings = makeSettings();

  it('returns content unchanged when duration mode is not active', () => {
    const ctx = {
      props:  {},
      format: undefined,
      settings
    } as ContentContext;

    expect(formatDurationContent(ctx, 'plain text')).toEqual('plain text');
  });

  it('formats raw duration diff when duration is set', () => {
    const ctx = {
      props:  { duration: true },
      format: 'H:mm',
      settings
    } as ContentContext;

    const expected = (moment.duration(diffMs) as FormattableDuration).format('H:mm');

    expect(formatDurationContent(ctx, diffMs)).toEqual(expected);
  });

  it('formats raw duration diff when durationFromNow is set', () => {
    const ctx = {
      props:  { durationFromNow: true },
      format: 'hh:mm:ss',
      settings
    } as ContentContext;

    const expected = (moment.duration(diffMs) as FormattableDuration).format('hh:mm:ss');

    expect(formatDurationContent(ctx, diffMs)).toEqual(expected);
  });

  it('passes trim option to duration formatting', () => {
    const ctx = {
      props:  { duration: true, trim: 'small' },
      format: 'H:mm',
      settings
    } as ContentContext;

    const expected = (moment.duration(diffMs) as FormattableDuration)
      .format('H:mm', { trim: 'small' });

    expect(formatDurationContent(ctx, diffMs)).toEqual(expected);
  });

  it('throws a clear error when duration formatting is unavailable', () => {
    const momentWithoutDurationFormat = {
      duration: () => ({})
    } as unknown as typeof moment;
    const ctx = {
      props:    { duration: true },
      format:   'H:mm',
      settings: makeSettings({ moment: momentWithoutDurationFormat })
    } as ContentContext;

    expect(() => formatDurationContent(ctx, diffMs)).toThrow(
      '[react-moment] Duration formatting requires moment-duration-format. '
      + 'Install the `moment-duration-format` package and ensure it is loaded '
      + 'before using the `duration` or `durationFromNow` props.'
    );
  });
});
