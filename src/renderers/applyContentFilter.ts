import type { MomentContent, MomentProps, MomentSettings } from '../types';

/**
 * Applies the global or per-instance content filter.
 */
export function applyContentFilter(
  props: MomentProps,
  content: MomentContent,
  settings: MomentSettings
): MomentContent {
  const customFilters = props.filters ?? settings.filters ?? [];
  let result = content;
  for (const customFilter of customFilters) {
    result = customFilter(result);
  }

  const filter = settings.filter || props.filter || ((value: MomentContent) => value);
  return filter(result);
}
