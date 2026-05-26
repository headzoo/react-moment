import type momentLib from 'moment';
import type { MomentProps } from '../types';
/**
 * Returns a copy of the datetime with add/subtract adjustments applied.
 * The input moment is not mutated.
 */
export declare function applyDateAdjustments(props: MomentProps, datetime: momentLib.Moment): momentLib.Moment;
