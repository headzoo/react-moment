import type { MomentProps } from './types';

/**
 * Known `<Moment>` prop names; used to strip them before forwarding DOM attributes.
 */
const momentPropKeyList = [
  'element',
  'children',
  'date',
  'parse',
  'format',
  'add',
  'subtract',
  'ago',
  'fromNow',
  'fromNowShort',
  'fromNowDuring',
  'from',
  'toNow',
  'to',
  'calendar',
  'unix',
  'utc',
  'local',
  'tz',
  'withTitle',
  'titleFormat',
  'locale',
  'interval',
  'diff',
  'duration',
  'durationFromNow',
  'trim',
  'unit',
  'decimal',
  'filters',
  'renderers',
  'onChange',
  'fallback'
] as const satisfies readonly (keyof MomentProps)[];

export const momentPropKeys: Record<(typeof momentPropKeyList)[number], true> = momentPropKeyList.reduce(
  (acc, key) => {
    acc[key] = true;
    return acc;
  },
  {} as Record<(typeof momentPropKeyList)[number], true>
);
