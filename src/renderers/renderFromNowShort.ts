import { getShortRelativeTime } from '../utils';
import type { ContentRenderer } from './types';

/**
 * Renders compact relative-to-now output.
 */
export const renderFromNowShort: ContentRenderer = ({ props, datetime }) => {
  if (props.fromNowShort) {
    return getShortRelativeTime(datetime);
  }
  return undefined;
};
