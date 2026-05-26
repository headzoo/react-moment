import momentLib from 'moment';
import { setupMomentDurationFormat } from './setupMomentDurationFormat';
import type {} from 'moment-timezone';
import type { MomentProps, MomentSettings } from './types';
import { applyDateAdjustments } from './renderers/applyDateAdjustments';

setupMomentDurationFormat(momentLib);

/**
 * Returns the active moment module reference from settings.
 */
export function getMomentRef(settings: MomentSettings): typeof momentLib {
  return settings.moment ?? momentLib;
}

/**
 * Ensures the active moment instance has timezone support from moment-timezone.
 */
function assertMomentTimezoneSupported(momentRef: typeof momentLib): void {
  if (typeof momentRef().tz !== 'function') {
    throw new Error(
      '[react-moment] The `tz` prop requires moment-timezone. '
      + 'Install the `moment-timezone` package and import "moment-timezone" '
      + 'before using timezone features.'
    );
  }
}

/**
 * Converts unix-seconds input to milliseconds, or null when the value is not numeric.
 */
function toUnixMilliseconds(input: momentLib.MomentInput): number | null {
  if (input === null || input === undefined) {
    return null;
  }

  let seconds: number;
  if (typeof input === 'number') {
    seconds = input;
  } else if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') {
      return null;
    }
    seconds = Number(trimmed);
  } else {
    return null;
  }

  if (!Number.isFinite(seconds)) {
    return null;
  }

  return seconds * 1000;
}

/**
 * Returns a moment instance computed from the given props.
 */
export function getDatetime(
  props: MomentProps,
  settings: MomentSettings
): momentLib.Moment {
  const { utc, unix } = props;
  const dateInput = (props.date ?? props.children) as momentLib.MomentInput;
  const parse = (props.parse ?? settings.parse ?? undefined) as
    | momentLib.MomentFormatSpecification
    | undefined;
  const tz = props.tz ?? settings.timezone ?? undefined;
  const local = props.local ?? settings.local ?? false;
  const momentRef = getMomentRef(settings);
  const locale = props.locale ?? settings.locale ?? momentRef.locale();

  let datetime: momentLib.Moment;
  if (utc) {
    datetime = momentRef.utc(dateInput, parse, locale);
  } else if (unix) {
    // moment#unix fails because of a deprecation,
    // but since moment#unix(s) is implemented as moment(s * 1000),
    // this works equivalently
    const unixMs = toUnixMilliseconds(dateInput);
    datetime = unixMs === null
      ? momentRef.invalid()
      : momentRef(unixMs, parse, locale);
  } else {
    datetime = momentRef(dateInput, parse, locale);
  }
  if (tz) {
    assertMomentTimezoneSupported(momentRef);
    datetime = datetime.tz(tz);
  } else if (local) {
    datetime = datetime.local();
  }

  return datetime;
}

/**
 * Returns a moment instance with add/subtract adjustments applied.
 */
export function getAdjustedDatetime(
  props: MomentProps,
  settings: MomentSettings
): momentLib.Moment {
  return applyDateAdjustments(props, getDatetime(props, settings));
}

/** Default week threshold when moment's `w` threshold is null (weeks disabled). */
const DEFAULT_WEEK_THRESHOLD = 4;

/**
 * Returns a compact relative time string without mutating locale settings.
 */
export function getShortRelativeTime(
  datetime: momentLib.Moment,
  settings: MomentSettings
): string {
  const momentRef = getMomentRef(settings);
  const round = momentRef.relativeTimeRounding();
  const duration = momentRef.duration(momentRef().diff(datetime)).abs();
  const thresholds = {
    ss: momentRef.relativeTimeThreshold('ss') as number,
    s:  momentRef.relativeTimeThreshold('s') as number,
    m:  momentRef.relativeTimeThreshold('m') as number,
    h:  momentRef.relativeTimeThreshold('h') as number,
    d:  momentRef.relativeTimeThreshold('d') as number,
    w:  momentRef.relativeTimeThreshold('w') as number | null,
    M:  momentRef.relativeTimeThreshold('M') as number
  };

  const seconds = round(duration.as('s'));
  const minutes = round(duration.as('m'));
  const hours = round(duration.as('h'));
  const days = round(duration.as('d'));
  const weeks = round(duration.as('w'));
  const months = round(duration.as('M'));
  const years = round(duration.as('y'));

  if (seconds <= thresholds.ss) {
    return '1s';
  }
  if (seconds < thresholds.s) {
    return `${seconds}s`;
  }
  if (minutes <= 1) {
    return '1m';
  }
  if (minutes < thresholds.m) {
    return `${minutes}m`;
  }
  if (hours <= 1) {
    return '1h';
  }
  if (hours < thresholds.h) {
    return `${hours}h`;
  }
  if (days <= 1) {
    return '1d';
  }
  const weekThreshold = thresholds.w ?? DEFAULT_WEEK_THRESHOLD;
  if (days >= 7) {
    if (weeks <= 1) {
      return '1w';
    }
    if (weeks < weekThreshold) {
      return `${weeks}w`;
    }
  }
  if (days < thresholds.d) {
    return `${days}d`;
  }
  if (months <= 1) {
    return '1mo';
  }
  if (months < thresholds.M) {
    return `${months}mo`;
  }
  if (years <= 1) {
    return '1y';
  }
  return `${years}y`;
}

export {
  applyContentFilter,
  applyDateAdjustments,
  contentRenderers,
  formatDurationContent,
  getContent,
  renderCalendar,
  renderDefault,
  renderDiff,
  renderDuration,
  renderDurationFromNow,
  renderFormat,
  renderFrom,
  renderFromNow,
  renderFromNowShort,
  renderTo,
  renderToNow
} from './renderers';
export type { ContentContext, ContentRenderer } from './renderers';

/**
 * Returns the title to use when `withTitle` is set.
 * Format resolution: `titleFormat` → `format` → provider `format`
 * → moment's default ISO-style output (`datetime.format('')`, e.g. `1976-04-19T12:59:00-05:00`).
 */
export function getTitle(
  props: MomentProps,
  settings: MomentSettings
): string {
  const datetime = getAdjustedDatetime(props, settings);
  if (!datetime.isValid()) {
    return '';
  }
  const format = props.titleFormat || props.format || settings.format || '';
  return datetime.format(format);
}
