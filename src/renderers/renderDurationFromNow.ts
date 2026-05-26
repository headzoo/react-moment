import { getMomentRef } from '../utils';
import type { ContentRenderer } from './types';

/**
 * Renders raw duration-from-now diff output (formatted later by formatDurationContent).
 */
export const renderDurationFromNow: ContentRenderer = ({ props, datetime, settings }) => {
  if (props.durationFromNow) {
    return getMomentRef(settings)().diff(datetime);
  }
  return undefined;
};
