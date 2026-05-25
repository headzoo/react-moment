import momentLib from 'moment';
import 'moment-duration-format';
import Moment from './index';
import { MomentProps } from './types';

// Note on the circular import: this module imports `Moment` from `./index`
// for access to its static globals (`globalMoment`, `globalParse`, etc.), and
// `./index` in turn imports these helpers. The cycle is safe because every
// helper reads `Moment.*` only from inside its function body, never at module
// initialization, so by the time any helper runs both modules have finished
// loading and `Moment` resolves to the live function.

/**
 * Returns the active moment module reference, lazily initializing
 * `Moment.globalMoment` so callers can still reset it to `null` (as the
 * test suite does in `beforeEach`).
 */
export function getMomentRef(): typeof momentLib {
  if (!Moment.globalMoment) {
    Moment.globalMoment = momentLib;
  }
  return Moment.globalMoment;
}

/**
 * Returns a moment instance computed from the given props.
 */
export function getDatetime(props: MomentProps): momentLib.Moment {
  const { utc, unix } = props;
  const dateInput = (props.date ?? props.children) as momentLib.MomentInput;
  const parse = (props.parse ?? Moment.globalParse ?? undefined) as
    | momentLib.MomentFormatSpecification
    | undefined;
  const tz = props.tz ?? Moment.globalTimezone ?? undefined;
  const local = props.local ?? Moment.globalLocal ?? false;
  const momentRef = getMomentRef();
  const locale = props.locale || Moment.globalLocale || momentRef.locale();

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
  const momentRef = Moment.globalMoment || momentLib;
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

/**
 * Returns the rendered content from the given props.
 */
export function getContent(props: MomentProps): unknown {
  const {
    fromNow, fromNowShort, fromNowDuring, from, add, subtract, toNow, to, ago,
    calendar, diff, duration, durationFromNow, unit, decimal, trim
  } = props;

  const format = props.format || Moment.globalFormat || undefined;
  const datetime = getDatetime(props);
  if (add) {
    datetime.add(add);
  }
  if (subtract) {
    datetime.subtract(subtract);
  }

  const fromNowPeriod = Boolean(fromNowDuring)
    && -datetime.diff(momentLib()) < (fromNowDuring as number);
  let content: unknown = '';
  if (format && !fromNowPeriod && !(durationFromNow || duration)) {
    content = datetime.format(format);
  } else if (from) {
    content = datetime.from(from as momentLib.MomentInput, ago);
  } else if (fromNowShort) {
    content = getShortRelativeTime(datetime);
  } else if (fromNow || fromNowPeriod) {
    content = datetime.fromNow(ago);
  } else if (to) {
    content = datetime.to(to as momentLib.MomentInput, ago);
  } else if (toNow) {
    content = datetime.toNow(ago);
  } else if (calendar) {
    content = datetime.calendar(
      null as unknown as momentLib.MomentInput,
      calendar as momentLib.CalendarSpec
    );
  } else if (diff) {
    content = datetime.diff(diff as momentLib.MomentInput, unit, decimal);
  } else if (duration) {
    content = datetime.diff(duration as momentLib.MomentInput);
  } else if (durationFromNow) {
    content = momentLib().diff(datetime);
  } else {
    content = datetime.toString();
  }

  if (duration || durationFromNow) {
    const d = momentLib.duration(content as momentLib.DurationInputArg1);
    content = (d as unknown as {
      format: (template?: string, options?: { trim?: unknown }) => string;
    }).format(format, { trim });
  }

  const filter = Moment.globalFilter || props.filter || ((value: unknown) => value);
  content = filter(content);

  return content;
}

/**
 * Returns the title to use when `withTitle` is set.
 */
export function getTitle(props: MomentProps): string {
  const datetime = getDatetime(props);
  const format = props.titleFormat || Moment.globalFormat || '';
  return datetime.format(format);
}
