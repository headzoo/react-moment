import { getShortRelativeTime } from '../utils';
import type { ContentRenderer } from './types';

/**
 * Renders compact relative-to-now output.
 */
export const renderFromNowShort: ContentRenderer = ({ props, datetime, settings }) => {
  if (props.fromNowShort) {
    return getShortRelativeTime(datetime, settings);
  }
  return undefined;
};
