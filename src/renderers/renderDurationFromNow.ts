import momentLib from 'moment';
import type { ContentRenderer } from './types';

/**
 * Renders raw duration-from-now diff output (formatted later by formatDurationContent).
 */
export const renderDurationFromNow: ContentRenderer = ({ props, datetime }) => {
  if (props.durationFromNow) {
    return momentLib().diff(datetime);
  }
  return undefined;
};
