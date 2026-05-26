import type { MomentContent, MomentProps, MomentSettings } from '../types';

/**
 * Applies the global or per-instance content filters.
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
  return result;
}
