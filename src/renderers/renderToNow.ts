import type { ContentRenderer } from './types';

/**
 * Renders interval-to-now output.
 */
export const renderToNow: ContentRenderer = ({ props, datetime }) => {
  if (props.toNow) {
    return datetime.toNow(props.ago);
  }
  return undefined;
};
