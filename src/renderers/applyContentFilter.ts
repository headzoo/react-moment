import type { MomentContent, MomentProps, MomentSettings } from '../types';

/**
 * Applies provider and per-instance content filters in order.
 */
export function applyContentFilter(
  props: MomentProps,
  content: MomentContent,
  settings: MomentSettings
): MomentContent {
  const customFilters = [
    ...(settings.filters ?? []),
    ...(props.filters ?? [])
  ];
  let result = content;
  for (const customFilter of customFilters) {
    try {
      result = customFilter(result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[react-moment] Content filter threw:', error);
    }
  }
  return result;
}
