import type momentLib from 'moment';
import type { MomentContent, MomentProps } from './types';

/**
 * Logs a development warning for invalid date input (no-op in production).
 */
export function warnInvalidDatetime(
  datetime: momentLib.Moment,
  props: MomentProps
): void {
  if (process.env.NODE_ENV === 'production' || datetime.isValid()) {
    return;
  }

  const input = props.date ?? props.children;
  // eslint-disable-next-line no-console
  console.warn(
    '[react-moment] Invalid date input:',
    input,
    'Provide a valid date or use the `fallback` prop.'
  );
}

/**
 * Content shown when the parsed datetime is invalid.
 */
export function getInvalidFallbackContent(props: MomentProps): MomentContent {
  if (props.fallback !== undefined) {
    return props.fallback;
  }
  return '';
}
