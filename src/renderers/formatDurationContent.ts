import type momentLib from 'moment';
import type { MomentContent, TrimInput } from '../types';
import { getMomentRef } from '../utils';
import type { ContentContext } from './types';

/**
 * Options accepted by moment-duration-format's `Duration#format`.
 */
export interface DurationFormatOptions {
  trim?: TrimInput;
}

/**
 * Duration instance patched by moment-duration-format.
 */
export type FormattableDuration = momentLib.Duration & {
  format: (template?: string, options?: DurationFormatOptions) => string;
};

/**
 * Ensures the active moment instance has duration formatting from moment-duration-format.
 */
function assertMomentDurationFormatSupported(momentRef: typeof momentLib): void {
  const duration = momentRef.duration(0) as FormattableDuration;
  if (typeof duration.format !== 'function') {
    throw new Error(
      '[react-moment] Duration formatting requires moment-duration-format. '
      + 'Install the `moment-duration-format` package and ensure it is loaded '
      + 'before using the `duration` or `durationFromNow` props.'
    );
  }
}

/**
 * Formats duration output when duration or durationFromNow is set.
 */
export function formatDurationContent(
  ctx: ContentContext,
  content: MomentContent
): MomentContent {
  const { props, format, settings } = ctx;
  if (props.duration || props.durationFromNow) {
    const momentRef = getMomentRef(settings);
    assertMomentDurationFormatSupported(momentRef);
    const d = momentRef.duration(content as momentLib.DurationInputArg1);
    return (d as FormattableDuration).format(format, { trim: props.trim });
  }
  return content;
}
