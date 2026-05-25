import type momentLib from 'moment';
import type { ContentRenderer } from './types';

/**
 * Renders interval-to output.
 */
export const renderTo: ContentRenderer = ({ props, datetime }) => {
  if (props.to) {
    return datetime.to(props.to as momentLib.MomentInput, props.ago);
  }
  return undefined;
};
