import type moment from 'moment';
import type { MomentContent, MomentProps } from '../types';
/**
 * Props accepted by `useMomentContent` (same as `<Moment>` minus DOM `element`).
 */
export type UseMomentContentProps = Omit<MomentProps, 'element'>;
/**
 * Value returned by `useMomentContent`.
 */
export interface UseMomentContentResult {
    content: MomentContent;
    /** Same adjusted moment used to produce `content` (includes add/subtract and provider defaults). */
    datetime: moment.Moment;
    title?: string;
}
/**
 * Formats a date using the same pipeline as `<Moment>`, with optional auto-updates.
 */
export declare function useMomentContent(props: UseMomentContentProps): UseMomentContentResult;
