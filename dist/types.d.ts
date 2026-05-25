import type { ElementType, ReactNode } from 'react';
import type moment from 'moment';
export type DateInput = moment.MomentInput;
export type ParseInput = moment.MomentFormatSpecification;
export type CalendarInput = boolean | moment.CalendarSpec;
export type TrimInput = boolean | string;
export type FilterFn = (content: unknown) => unknown;
export type OnChangeFn = (content: unknown) => void;
export interface MomentProps {
    element?: ElementType | null;
    date?: DateInput;
    parse?: ParseInput;
    format?: string;
    add?: moment.DurationInputObject;
    subtract?: moment.DurationInputObject;
    ago?: boolean;
    fromNow?: boolean;
    fromNowShort?: boolean;
    fromNowDuring?: number;
    from?: DateInput;
    toNow?: boolean;
    to?: DateInput;
    calendar?: CalendarInput;
    unix?: boolean;
    utc?: boolean;
    local?: boolean;
    tz?: string;
    withTitle?: boolean;
    titleFormat?: string;
    locale?: string;
    interval?: number;
    diff?: DateInput;
    duration?: DateInput;
    durationFromNow?: boolean;
    trim?: TrimInput;
    unit?: moment.unitOfTime.Diff;
    decimal?: boolean;
    filter?: FilterFn;
    onChange?: OnChangeFn;
    children?: ReactNode | DateInput;
    [key: string]: unknown;
}
export interface PoolEntry {
    getProps: () => MomentProps;
    update: () => void;
}
export interface MomentStatics {
    globalMoment: typeof moment | null;
    globalLocale: string | null;
    globalLocal: boolean | null;
    globalFormat: string | null;
    globalParse: ParseInput | null;
    globalFilter: FilterFn | null;
    globalElement: ElementType;
    globalTimezone: string | null;
    pooledElements: PoolEntry[];
    pooledTimer: ReturnType<typeof setInterval> | null;
    startPooledTimer: (interval?: number) => void;
    clearPooledTimer: () => void;
    pushPooledElement: (entry: PoolEntry) => void;
    removePooledElement: (entry: PoolEntry) => void;
    getDatetime: (props: MomentProps) => moment.Moment;
    getShortRelativeTime: (datetime: moment.Moment) => string;
    getContent: (props: MomentProps) => unknown;
}
export declare const momentPropKeys: Record<string, true>;
