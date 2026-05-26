import type momentLib from 'moment';
import type { MomentProps } from '../types';

/**
 * Returns a copy of the datetime with add/subtract adjustments applied.
 * The input moment is not mutated.
 */
export function applyDateAdjustments(
  props: MomentProps,
  datetime: momentLib.Moment
): momentLib.Moment {
  if (!props.add && !props.subtract) {
    return datetime;
  }

  const adjusted = datetime.clone();
  if (props.add) {
    adjusted.add(props.add);
  }
  if (props.subtract) {
    adjusted.subtract(props.subtract);
  }
  return adjusted;
}
