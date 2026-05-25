import momentLib from 'moment';
import 'moment-duration-format';
import { MomentProps } from './types';
/**
 * Returns the active moment module reference, lazily initializing
 * `Moment.globals.moment` so callers can still reset it to `null` (as the
 * test suite does in `beforeEach`).
 */
export declare function getMomentRef(): typeof momentLib;
/**
 * Returns a moment instance computed from the given props.
 */
export declare function getDatetime(props: MomentProps): momentLib.Moment;
/**
 * Returns a compact relative time string without mutating locale settings.
 */
export declare function getShortRelativeTime(datetime: momentLib.Moment): string;
export { applyContentFilter, applyDateAdjustments, contentRenderers, formatDurationContent, getContent, renderCalendar, renderDefault, renderDiff, renderDuration, renderDurationFromNow, renderFormat, renderFrom, renderFromNow, renderFromNowShort, renderTo, renderToNow } from './renderers';
export type { ContentContext, ContentRenderer } from './renderers';
/**
 * Returns the title to use when `withTitle` is set.
 */
export declare function getTitle(props: MomentProps): string;
