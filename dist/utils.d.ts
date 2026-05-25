import momentLib from 'moment';
import 'moment-duration-format';
import { MomentProps } from './types';
/**
 * Returns the active moment module reference, lazily initializing
 * `Moment.globalMoment` so callers can still reset it to `null` (as the
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
/**
 * Returns the rendered content from the given props.
 */
export declare function getContent(props: MomentProps): unknown;
/**
 * Returns the title to use when `withTitle` is set.
 */
export declare function getTitle(props: MomentProps): string;
