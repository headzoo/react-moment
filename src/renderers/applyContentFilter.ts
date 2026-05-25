import Moment from '../index';
import type { MomentProps } from '../types';

/**
 * Applies the global or per-instance content filter.
 */
export function applyContentFilter(
  props: MomentProps,
  content: unknown
): unknown {
  const filter = Moment.globals.filter || props.filter || ((value: unknown) => value);
  return filter(content);
}
