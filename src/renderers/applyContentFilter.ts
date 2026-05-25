import Moment from '../index';
import type { MomentContent, MomentProps } from '../types';

/**
 * Applies the global or per-instance content filter.
 */
export function applyContentFilter(
  props: MomentProps,
  content: MomentContent
): MomentContent {
  const customFilters = props.filters ?? Moment.settings.filters ?? [];
  let result = content;
  for (const customFilter of customFilters) {
    result = customFilter(result);
  }

  const filter = Moment.settings.filter || props.filter || ((value: MomentContent) => value);
  return filter(result);
}
