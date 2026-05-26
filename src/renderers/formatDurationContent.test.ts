import moment from 'moment';
import 'moment-duration-format';
import type { ContentContext } from './types';
import { formatDurationContent } from './formatDurationContent';

describe('formatDurationContent', () => {
  const diffMs = 2 * 60 * 60 * 1000 + 5 * 60 * 1000;

  it('returns content unchanged when duration mode is not active', () => {
    const ctx = {
      props: {},
      format: undefined
    } as ContentContext;

    expect(formatDurationContent(ctx, 'plain text')).toEqual('plain text');
  });

  it('formats raw duration diff when duration is set', () => {
    const ctx = {
      props: { duration: true },
      format: 'H:mm'
    } as ContentContext;

    const expected = (moment.duration(diffMs) as unknown as {
      format: (template?: string) => string;
    }).format('H:mm');

    expect(formatDurationContent(ctx, diffMs)).toEqual(expected);
  });

  it('formats raw duration diff when durationFromNow is set', () => {
    const ctx = {
      props: { durationFromNow: true },
      format: 'hh:mm:ss'
    } as ContentContext;

    const expected = (moment.duration(diffMs) as unknown as {
      format: (template?: string) => string;
    }).format('hh:mm:ss');

    expect(formatDurationContent(ctx, diffMs)).toEqual(expected);
  });

  it('passes trim option to duration formatting', () => {
    const ctx = {
      props: { duration: true, trim: 'small' },
      format: 'H:mm'
    } as ContentContext;

    const expected = (moment.duration(diffMs) as unknown as {
      format: (template?: string, options?: { trim?: unknown }) => string;
    }).format('H:mm', { trim: 'small' });

    expect(formatDurationContent(ctx, diffMs)).toEqual(expected);
  });
});
