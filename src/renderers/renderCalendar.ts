import type momentLib from 'moment';
import type { ContentRenderer } from './types';

/**
 * Renders calendar-style output.
 */
export const renderCalendar: ContentRenderer = ({ props, datetime }) => {
  if (props.calendar) {
    return datetime.calendar(
      null as unknown as momentLib.MomentInput,
      props.calendar as momentLib.CalendarSpec
    );
  }
  return undefined;
};
