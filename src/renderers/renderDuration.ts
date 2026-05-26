import type momentLib from 'moment';
import type { ContentRenderer } from './types';

/**
 * Renders raw duration diff output (formatted later by formatDurationContent).
 */
export const renderDuration: ContentRenderer = ({ props, datetime }) => {
  if (props.duration) {
    return datetime.diff(props.duration as momentLib.MomentInput);
  }
  return undefined;
};
