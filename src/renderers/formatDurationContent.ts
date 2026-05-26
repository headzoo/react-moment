import momentLib from 'moment';
import type { MomentContent, TrimInput } from '../types';
import type { ContentContext } from './types';

/**
 * Formats duration output when duration or durationFromNow is set.
 */
export function formatDurationContent(
  ctx: ContentContext,
  content: MomentContent
): MomentContent {
  const { props, format } = ctx;
  if (props.duration || props.durationFromNow) {
    const d = momentLib.duration(content as momentLib.DurationInputArg1);
    return (d as unknown as {
      format: (template?: string, options?: { trim?: TrimInput }) => string;
    }).format(format, { trim: props.trim });
  }
  return content;
}
