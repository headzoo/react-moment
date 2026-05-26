/**
 * Known `<Moment>` prop names; used to strip them before forwarding DOM attributes.
 */
declare const momentPropKeyList: readonly ["element", "children", "date", "parse", "format", "add", "subtract", "ago", "fromNow", "fromNowShort", "fromNowDuring", "from", "toNow", "to", "calendar", "unix", "utc", "local", "tz", "withTitle", "titleFormat", "locale", "interval", "diff", "duration", "durationFromNow", "trim", "unit", "decimal", "filters", "renderers", "onChange", "fallback"];
export declare const momentPropKeys: Record<(typeof momentPropKeyList)[number], true>;
export {};
