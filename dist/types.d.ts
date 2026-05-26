import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type moment from 'moment';
import type { ContentRenderer } from './renderers/types';
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
 * Values produced by built-in/custom renderers and accepted by filters.
 */
export type MomentContent = string | number;
/**
 * Transforms rendered content before it is displayed.
 * If a filter throws, the error is logged with `console.error` and that
 * filter is skipped; remaining filters still run on the last successful result.
 */
export type Filter = (content: MomentContent) => MomentContent;
/**
 * Called whenever the displayed content changes (including on interval updates).
 */
export type OnChangeFn = (content: MomentContent) => void;
/**
 * Shared content-formatting props used across multiple output modes.
 */
export interface ContentBaseProps {
    /**
     * moment.js format string for the displayed output.
     */
    format?: string;
    /**
     * With `fromNow`, `from`, `toNow`, and `to`, omits the "ago" / "in" suffix from the output.
     */
    ago?: boolean;
}
/**
 * Props for custom content renderers.
 */
export interface CustomRenderersProps {
    /**
     * Array of custom ContentRenderer functions invoked before the built-in
     * renderers. The first renderer (custom or built-in) to return a
     * non-undefined value wins. Composes with the nearest provider's renderers
     * (provider entries run first).
     */
    renderers?: ContentRenderer[];
}
/**
 * Props for custom content filters.
 */
export interface CustomFiltersProps {
    /**
     * Custom filters applied in order after formatting.
     * Composes with the nearest provider's filters (provider entries run first).
     */
    filters?: Filter[];
}
/**
 * Props that adjust the parsed date before content rendering.
 */
export interface DateAdjustmentProps {
    /**
     * Duration to add to the date before formatting (e.g. `{ hours: 12 }`).
     */
    add?: moment.DurationInputObject;
    /**
     * Duration to subtract from the date before formatting.
     */
    subtract?: moment.DurationInputObject;
}
/**
 * Props for relative-to-now content output.
 */
export interface FromNowContentProps {
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
}
/**
 * Props for interval-from content output.
 */
export interface FromContentProps {
    /**
     * Displays the interval from this date to the component's date.
     */
    from?: DateInput;
}
/**
 * Props for interval-to content output.
 */
export interface ToContentProps {
    /**
     * Displays the interval from the component's date to now.
     */
    toNow?: boolean;
    /**
     * Displays the interval from the component's date to this date.
     */
    to?: DateInput;
}
/**
 * Props for calendar-style content output.
 */
export interface CalendarContentProps {
    /**
     * Renders a calendar-style string (e.g. "Yesterday at 3:00 PM").
     */
    calendar?: CalendarInput;
}
/**
 * Props for numeric diff content output.
 */
export interface DiffContentProps {
    /**
     * Renders the numeric difference between this date and the component's date.
     */
    diff?: DateInput;
    /**
     * Unit of time for `diff` output (e.g. `'days'`, `'years'`).
     */
    unit?: moment.unitOfTime.Diff;
    /**
     * When true, `diff` returns a floating-point value instead of truncating.
     */
    decimal?: boolean;
}
/**
 * Props for duration content output.
 */
export interface DurationContentProps {
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
}
/**
 * Props for parsing and interpreting the date input.
 */
export interface DateInputProps {
    /**
     * Date to display; falls back to `children` when omitted.
     */
    date?: DateInput;
    /**
     * How to parse the date input when it is not in a standard format.
     */
    parse?: ParseInput;
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
     * BCP 47 locale string for formatting and parsing.
     */
    locale?: string;
    /**
     * Date input when no `date` prop is given; otherwise standard React children.
     * Accepts strings, numbers, `Date`, moment instances, etc.
     */
    children?: ReactNode | DateInput;
}
/**
 * Props for component rendering, lifecycle, and DOM forwarding.
 * Extends default `<time>` element props so passthrough DOM attributes are typed.
 */
export interface RenderProps extends Omit<ComponentPropsWithoutRef<'time'>, 'children' | 'onChange'> {
    /**
     * HTML element type to render (defaults to the settings element, usually `'time'`).
     * `null` inherits the provider default, then falls back to `'time'`.
     */
    element?: ElementType | null;
    /**
     * Adds a `title` attribute. Format resolution: `titleFormat` → `format` → provider `format`
     * → moment's default ISO-style output (`datetime.format('')`, e.g. `1976-04-19T12:59:00-05:00`).
     */
    withTitle?: boolean;
    /**
     * moment.js format string for the `title` attribute when `withTitle` is set.
     * When omitted, the title uses the same format resolution as the visible text.
     */
    titleFormat?: string;
    /**
     * Milliseconds between automatic re-renders; `0` disables updates (default 60000).
     */
    interval?: number;
    /**
     * Callback invoked with the displayed content on mount and after each interval tick.
     */
    onChange?: OnChangeFn;
    /**
     * Shown when the date input is invalid instead of moment's "Invalid date" string.
     */
    fallback?: MomentContent;
}
/**
 * Props accepted by the `<Moment>` component.
 */
export interface MomentProps extends ContentBaseProps, DateAdjustmentProps, FromNowContentProps, FromContentProps, ToContentProps, CalendarContentProps, DiffContentProps, DurationContentProps, CustomRenderersProps, CustomFiltersProps, DateInputProps, RenderProps {
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
    /**
     * Milliseconds since epoch when this instance was last updated by the pool.
     */
    getLastUpdatedAt: () => number;
    /**
     * Records when this instance was last updated by the pool.
     */
    setLastUpdatedAt: (time: number) => void;
}
/**
 * Default settings shared by all `<Moment>` instances unless a prop overrides them.
 */
export interface MomentSettings {
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
     * Default custom filters applied when a component omits the `filters` prop.
     */
    filters: Filter[] | null;
    /**
     * Default custom renderers applied when a component omits the `renderers` prop.
     */
    renderers: ContentRenderer[] | null;
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
 * Props accepted by `<MomentProvider>`.
 */
export interface MomentProviderProps {
    /**
     * Child components that receive these defaults.
     */
    children: ReactNode;
    /**
     * When true, one shared timer updates all descendant `<Moment>` instances.
     */
    pool?: boolean;
    /**
     * Milliseconds between pooled timer ticks (default 60000).
     */
    interval?: number;
    /**
     * Custom moment module instance.
     */
    moment?: typeof moment | null;
    /**
     * Default locale applied when a component omits the `locale` prop.
     */
    locale?: string | null;
    /**
     * Default `local` flag applied when a component omits the `local` prop.
     */
    local?: boolean | null;
    /**
     * Default format string applied when a component omits the `format` prop.
     */
    format?: string | null;
    /**
     * Default parse spec applied when a component omits the `parse` prop.
     */
    parse?: ParseInput | null;
    /**
     * Default custom filters applied when a component omits the `filters` prop.
     */
    filters?: Filter[] | null;
    /**
     * Default custom renderers applied when a component omits the `renderers` prop.
     */
    renderers?: ContentRenderer[] | null;
    /**
     * Default element type rendered when a component omits the `element` prop.
     * `null` falls back to `'time'`.
     */
    element?: ElementType | null;
    /**
     * Default timezone applied when a component omits the `tz` prop.
     */
    timezone?: string | null;
}
