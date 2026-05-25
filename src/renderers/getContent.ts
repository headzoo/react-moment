import momentLib from 'moment';
import Moment from '../index';
import type { MomentProps } from '../types';
import { getDatetime } from '../utils';
import { applyContentFilter } from './applyContentFilter';
import { applyDateAdjustments } from './applyDateAdjustments';
import { formatDurationContent } from './formatDurationContent';
import { contentRenderers } from './registry';
import type { ContentContext } from './types';

/**
 * Returns the rendered content from the given props.
 */
export function getContent(props: MomentProps): unknown {
  const datetime = getDatetime(props);
  applyDateAdjustments(props, datetime);

  const format = props.format || Moment.globals.format || undefined;
  const fromNowPeriod = Boolean(props.fromNowDuring)
    && -datetime.diff(momentLib()) < (props.fromNowDuring as number);

  const ctx: ContentContext = { props, datetime, format, fromNowPeriod };

  let content: unknown;
  for (const render of contentRenderers) {
    const result = render(ctx);
    if (result !== undefined) {
      content = result;
      break;
    }
  }

  content = formatDurationContent(ctx, content);
  return applyContentFilter(props, content);
}
