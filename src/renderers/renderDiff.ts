import type momentLib from 'moment';
import type { ContentRenderer } from './types';

/**
 * Renders numeric diff output.
 */
export const renderDiff: ContentRenderer = ({ props, datetime }) => {
  if (props.diff) {
    return datetime.diff(
      props.diff as momentLib.MomentInput,
      props.unit,
      props.decimal
    );
  }
  return undefined;
};
