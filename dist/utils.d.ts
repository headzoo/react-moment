import momentLib from 'moment';
import type { MomentProps, MomentSettings } from './types';
/**
 * Returns the active moment module reference from settings.
 */
export declare function getMomentRef(settings: MomentSettings): typeof momentLib;
/**
 * Returns a moment instance computed from the given props.
 */
export declare function getDatetime(props: MomentProps, settings: MomentSettings): momentLib.Moment;
/**
 * Returns a moment instance with add/subtract adjustments applied.
 */
export declare function getAdjustedDatetime(props: MomentProps, settings: MomentSettings): momentLib.Moment;
/**
 * Returns a compact relative time string without mutating locale settings.
 */
export declare function getShortRelativeTime(datetime: momentLib.Moment, settings: MomentSettings): string;
export { applyContentFilter, applyDateAdjustments, contentRenderers, formatDurationContent, getContent, renderCalendar, renderDefault, renderDiff, renderDuration, renderDurationFromNow, renderFormat, renderFrom, renderFromNow, renderFromNowShort, renderTo, renderToNow } from './renderers';
export type { ContentContext, ContentRenderer } from './renderers';
/**
 * Returns the title to use when `withTitle` is set.
 * Format resolution: `titleFormat` → `format` → provider `format`
 * → moment's default ISO-style output (`datetime.format('')`, e.g. `1976-04-19T12:59:00-05:00`).
 */
export declare function getTitle(props: MomentProps, settings: MomentSettings): string;
