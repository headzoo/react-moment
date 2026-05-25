import type momentLib from 'moment';
import type { ContentRenderer } from './types';

/**
 * Renders interval-from output.
 */
export const renderFrom: ContentRenderer = ({ props, datetime }) => {
  if (props.from) {
    return datetime.from(props.from as momentLib.MomentInput, props.ago);
  }
  return undefined;
};
