import momentLib from 'moment';
import type { MomentContent, MomentProps, MomentSettings } from '../types';
import { getDatetime } from '../utils';
import { applyContentFilter } from './applyContentFilter';
import { applyDateAdjustments } from './applyDateAdjustments';
import { formatDurationContent } from './formatDurationContent';
import { contentRenderers } from './registry';
import { renderDefault } from './renderDefault';
import type { ContentContext } from './types';

/**
 * Returns the rendered content from the given props.
 */
export function getContent(
  props: MomentProps,
  settings: MomentSettings
): MomentContent {
  const datetime = getDatetime(props, settings);
  applyDateAdjustments(props, datetime);

  const format = props.format || settings.format || undefined;
  const fromNowPeriod = Boolean(props.fromNowDuring)
    && -datetime.diff(momentLib()) < (props.fromNowDuring as number);

  const ctx: ContentContext = { props, datetime, format, fromNowPeriod, settings };

  const customRenderers = props.renderers ?? settings.renderers ?? [];
  const allRenderers = [...customRenderers, ...contentRenderers];

  let content: MomentContent | undefined;
  for (const render of allRenderers) {
    const result = render(ctx);
    if (result !== undefined) {
      content = result;
      break;
    }
  }

  const resolved = content ?? renderDefault(ctx) ?? datetime.toString();
  content = formatDurationContent(ctx, resolved);
  return applyContentFilter(props, content, settings);
}
