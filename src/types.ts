import type { ElementType, ReactNode } from 'react';
import type moment from 'moment';

/**
 * Any value moment.js accepts as a date (string, number, Date, moment instance, etc.).
 */
export type DateInput = moment.MomentInput;

/**
 * Format string or array of formats used when parsing non-standard date strings.
 */
export type ParseInput = moment.MomentFormatSpecification;

/**
 * When true, uses moment's default calendar formatting; otherwise a custom calendar spec.
 */
export type CalendarInput = boolean | moment.CalendarSpec;

/**
 * When formatting durations, trims empty largest-magnitude tokens (boolean or trim template).
 */
export type TrimInput = boolean | string;

/**
 * Transforms the rendered date content before it is displayed.
 */
export type FilterFn = (content: unknown) => unknown;

/**
 * Called whenever the displayed content changes (including on interval updates).
 */
export type OnChangeFn = (content: unknown) => void;

/**
 * Props accepted by the `<Moment>` component.
 */
export interface MomentProps {
  /**
   * HTML element type to render (defaults to the global element, usually `'time'`).
   */
  element?: ElementType | null;

  /**
   * Date to display; falls back to `children` when omitted.
   */
  date?: DateInput;

  /**
   * How to parse the date input when it is not in a standard format.
   */
  parse?: ParseInput;

  /**
   * moment.js format string for the displayed output.
   */
  format?: string;

  /**
   * Duration to add to the date before formatting (e.g. `{ hours: 12 }`).
   */
  add?: moment.DurationInputObject;

  /**
   * Duration to subtract from the date before formatting.
   */
  subtract?: moment.DurationInputObject;

  /**
   * With relative-time props, omits the "ago" / "in" suffix from the output.
   */
  ago?: boolean;

  /**
   * Displays the date relative to now (e.g. "5 minutes ago").
   */
  fromNow?: boolean;

  /**
   * Like `fromNow`, but uses compact units (e.g. "1h", "2d").
   */
  fromNowShort?: boolean;

  /**
   * Shows relative time only while within this many milliseconds; then uses `format`.
   */
  fromNowDuring?: number;

  /**
   * Displays the interval from this date to the component's date.
   */
  from?: DateInput;

  /**
   * Displays the interval from the component's date to now.
   */
  toNow?: boolean;

  /**
   * Displays the interval from the component's date to this date.
   */
  to?: DateInput;

  /**
   * Renders a calendar-style string (e.g. "Yesterday at 3:00 PM").
   */
  calendar?: CalendarInput;

  /**
   * Treats the date input as a Unix timestamp in seconds.
   */
  unix?: boolean;

  /**
   * Parses and displays the date in UTC.
   */
  utc?: boolean;

  /**
   * Converts the parsed date to the local timezone.
   */
  local?: boolean;

  /**
   * IANA timezone name; requires `moment-timezone`.
   */
  tz?: string;

  /**
   * Adds a `title` attribute with a formatted version of the date.
   */
  withTitle?: boolean;

  /**
   * moment.js format string used for the `title` attribute when `withTitle` is set.
   */
  titleFormat?: string;

  /**
   * BCP 47 locale string for formatting and parsing.
   */
  locale?: string;

  /**
   * Milliseconds between automatic re-renders; `0` disables updates (default 60000).
   */
  interval?: number;

  /**
   * Renders the numeric difference between this date and the component's date.
   */
  diff?: DateInput;

  /**
   * Renders the duration between this date and the component's date.
   */
  duration?: DateInput;

  /**
   * Renders the duration between now and the component's date.
   */
  durationFromNow?: boolean;

  /**
   * Passed to moment-duration-format when formatting duration output.
   */
  trim?: TrimInput;

  /**
   * Unit of time for `diff` output (e.g. `'days'`, `'years'`).
   */
  unit?: moment.unitOfTime.Diff;

  /**
   * When true, `diff` returns a floating-point value instead of truncating.
   */
  decimal?: boolean;

  /**
   * Per-instance filter applied to content after formatting (overridden by global filter).
   */
  filter?: FilterFn;

  /**
   * Callback invoked when displayed content changes.
   */
  onChange?: OnChangeFn;

  /**
   * Date input when no `date` prop is given; otherwise standard React children.
   * Accepts strings, numbers, `Date`, moment instances, etc.
   */
  children?: ReactNode | DateInput;

  /**
   * Additional props forwarded to the rendered DOM element.
   */
  [key: string]: unknown;
}

/**
 * A mounted `<Moment>` instance registered with the shared pooled timer.
 */
export interface PoolEntry {
  /**
   * Returns the instance's current props (read on each pooled tick).
   */
  getProps: () => MomentProps;

  /**
   * Triggers a re-render and optional `onChange` for this instance.
   */
  update: () => void;
}

/**
 * Global defaults shared by all `<Moment>` instances unless a prop overrides them.
 */
export interface MomentGlobals {
  /**
   * Custom moment module instance; lazily defaults to the bundled `moment`.
   */
  moment: typeof moment | null;

  /**
   * Default locale applied when a component omits the `locale` prop.
   */
  locale: string | null;

  /**
   * Default `local` flag applied when a component omits the `local` prop.
   */
  local: boolean | null;

  /**
   * Default format string applied when a component omits the `format` prop.
   */
  format: string | null;

  /**
   * Default parse spec applied when a component omits the `parse` prop.
   */
  parse: ParseInput | null;

  /**
   * Default filter applied to all instances unless overridden per component.
   */
  filter: FilterFn | null;

  /**
   * Default element type rendered when a component omits the `element` prop.
   */
  element: ElementType;

  /**
   * Default timezone applied when a component omits the `tz` prop.
   */
  timezone: string | null;
}

/**
 * Static properties and methods on the `Moment` component function.
 */
export interface MomentStatics {
  /**
   * Global defaults shared by all `<Moment>` instances.
   */
  globals: MomentGlobals;

  /**
   * Mounted instances driven by `startPooledTimer`.
   */
  pooledElements: PoolEntry[];

  /**
   * Shared interval handle when the pooled timer is active, otherwise `null`.
   */
  pooledTimer: ReturnType<typeof setInterval> | null;

  /**
   * Starts one timer that updates every registered pooled instance.
   */
  startPooledTimer: (interval?: number) => void;

  /**
   * Stops the pooled timer and clears all registered instances.
   */
  clearPooledTimer: () => void;

  /**
   * Registers an instance with the pooled timer.
   */
  pushPooledElement: (entry: PoolEntry) => void;

  /**
   * Unregisters an instance from the pooled timer.
   */
  removePooledElement: (entry: PoolEntry) => void;
}

/**
 * Known `<Moment>` prop names; used to strip them before forwarding DOM attributes.
 */
export const momentPropKeys: Record<string, true> = {
  element: true,
  date: true,
  parse: true,
  format: true,
  add: true,
  subtract: true,
  ago: true,
  fromNow: true,
  fromNowShort: true,
  fromNowDuring: true,
  from: true,
  toNow: true,
  to: true,
  calendar: true,
  unix: true,
  utc: true,
  local: true,
  tz: true,
  withTitle: true,
  titleFormat: true,
  locale: true,
  interval: true,
  diff: true,
  duration: true,
  durationFromNow: true,
  trim: true,
  unit: true,
  decimal: true,
  filter: true,
  onChange: true
};
