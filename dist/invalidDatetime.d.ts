import type momentLib from 'moment';
import type { MomentContent, MomentProps } from './types';
/**
 * Logs a development warning for invalid date input (no-op in production).
 */
export declare function warnInvalidDatetime(datetime: momentLib.Moment, props: MomentProps): void;
/**
 * Content shown when the parsed datetime is invalid.
 */
export declare function getInvalidFallbackContent(props: MomentProps): MomentContent;
