import type momentLib from 'moment';
import type { MomentProps } from '../types';

/**
 * Applies add/subtract adjustments to the parsed datetime.
 */
export function applyDateAdjustments(
  props: MomentProps,
  datetime: momentLib.Moment
): void {
  if (props.add) {
    datetime.add(props.add);
  }
  if (props.subtract) {
    datetime.subtract(props.subtract);
  }
}
