import type momentLib from 'moment';
import type { MomentContent, TrimInput } from '../types';
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
 * Formats duration output when duration or durationFromNow is set.
 */
export declare function formatDurationContent(ctx: ContentContext, content: MomentContent): MomentContent;
