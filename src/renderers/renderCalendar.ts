import { getMomentRef } from '../utils';
import type { ContentRenderer } from './types';

/**
 * Renders calendar-style output.
 */
export const renderCalendar: ContentRenderer = ({ props, datetime, settings }) => {
  if (props.calendar) {
    const reference = getMomentRef(settings)();
    return props.calendar === true
      ? datetime.calendar(reference)
      : datetime.calendar(reference, props.calendar);
  }
  return undefined;
};
