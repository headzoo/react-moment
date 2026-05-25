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
  // `children` doubles as a date input in this component, so it accepts both
  // the standard React children types and any MomentInput value (string,
  // number, Date, moment.Moment, etc.).
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

export const momentPropKeys: Record<string, true> = {
  element:         true,
  date:            true,
  parse:           true,
  format:          true,
  add:             true,
  subtract:        true,
  ago:             true,
  fromNow:         true,
  fromNowShort:    true,
  fromNowDuring:   true,
  from:            true,
  toNow:           true,
  to:              true,
  calendar:        true,
  unix:            true,
  utc:             true,
  local:           true,
  tz:              true,
  withTitle:       true,
  titleFormat:     true,
  locale:          true,
  interval:        true,
  diff:            true,
  duration:        true,
  durationFromNow: true,
  trim:            true,
  unit:            true,
  decimal:         true,
  filter:          true,
  onChange:        true
};
