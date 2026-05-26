import type { ContentRenderer } from './types';

/**
 * Renders formatted output when format applies and no higher-priority mode wins.
 */
export const renderFormat: ContentRenderer = ({
  props,
  datetime,
  format,
  fromNowPeriod
}) => {
  if (format && !fromNowPeriod && !(props.durationFromNow || props.duration)) {
    return datetime.format(format);
  }
  return undefined;
};
