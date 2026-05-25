import momentLib from 'moment';
import 'moment-duration-format';
import Moment from './index';
import { MomentProps } from './types';

// Note on the circular import: this module imports `Moment` from `./index`
// for access to its static settings (`settings.moment`, `settings.parse`, etc.), and
// `./index` in turn imports these helpers. The cycle is safe because every
// helper reads `Moment.*` only from inside its function body, never at module
// initialization, so by the time any helper runs both modules have finished
// loading and `Moment` resolves to the live function.

/**
 * Returns the active moment module reference, lazily initializing
 * `Moment.settings.moment` so callers can still reset it to `null` (as the
 * test suite does in `beforeEach`).
 */
export function getMomentRef(): typeof momentLib {
  if (!Moment.settings.moment) {
    Moment.settings.moment = momentLib;
  }
  return Moment.settings.moment;
}

/**
 * Returns a moment instance computed from the given props.
 */
export function getDatetime(props: MomentProps): momentLib.Moment {
  const { utc, unix } = props;
  const dateInput = (props.date ?? props.children) as momentLib.MomentInput;
  const parse = (props.parse ?? Moment.settings.parse ?? undefined) as
    | momentLib.MomentFormatSpecification
    | undefined;
  const tz = props.tz ?? Moment.settings.timezone ?? undefined;
  const local = props.local ?? Moment.settings.local ?? false;
  const momentRef = getMomentRef();
  const locale = props.locale || Moment.settings.locale || momentRef.locale();

  let datetime: momentLib.Moment;
  if (utc) {
    datetime = momentRef.utc(dateInput, parse, locale);
  } else if (unix) {
    // moment#unix fails because of a deprecation,
    // but since moment#unix(s) is implemented as moment(s * 1000),
    // this works equivalently
    datetime = momentRef((dateInput as number) * 1000, parse, locale);
  } else {
    datetime = momentRef(dateInput, parse, locale);
  }
  if (tz) {
    datetime = (datetime as momentLib.Moment & {
      tz: (zone: string) => momentLib.Moment;
    }).tz(tz);
  } else if (local) {
    datetime = datetime.local();
  }

  return datetime;
}

/**
 * Returns a compact relative time string without mutating locale settings.
 */
export function getShortRelativeTime(datetime: momentLib.Moment): string {
  const momentRef = Moment.settings.moment || momentLib;
  const round = momentRef.relativeTimeRounding();
  const duration = momentRef.duration(momentRef().diff(datetime)).abs();
  const thresholds = {
    ss: momentRef.relativeTimeThreshold('ss') as number,
    s: momentRef.relativeTimeThreshold('s') as number,
    m: momentRef.relativeTimeThreshold('m') as number,
    h: momentRef.relativeTimeThreshold('h') as number,
    d: momentRef.relativeTimeThreshold('d') as number,
    w: momentRef.relativeTimeThreshold('w') as number | null,
    M: momentRef.relativeTimeThreshold('M') as number
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
  if (days < thresholds.d) {
    return `${days}d`;
  }
  if (thresholds.w !== null) {
    if (weeks <= 1) {
      return '1w';
    }
    if (weeks < thresholds.w) {
      return `${weeks}w`;
    }
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
 */
export function getTitle(props: MomentProps): string {
  const datetime = getDatetime(props);
  const format = props.titleFormat || Moment.settings.format || '';
  return datetime.format(format);
}
