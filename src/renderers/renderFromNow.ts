import type { ContentRenderer } from './types';

/**
 * Renders relative-to-now output.
 */
export const renderFromNow: ContentRenderer = ({ props, datetime, fromNowPeriod }) => {
  if (props.fromNow || fromNowPeriod) {
    return datetime.fromNow(props.ago);
  }
  return undefined;
};
