import {
  getInvalidFallbackContent,
  warnInvalidDatetime
} from '../invalidDatetime';
import type { MomentContent, MomentProps, MomentSettings } from '../types';
import { getAdjustedDatetime, getMomentRef } from '../utils';
import { applyContentFilter } from './applyContentFilter';
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
  const datetime = getAdjustedDatetime(props, settings);

  if (!datetime.isValid()) {
    warnInvalidDatetime(datetime, props);
    return getInvalidFallbackContent(props);
  }

  const format = props.format || settings.format || undefined;
  const momentRef = getMomentRef(settings);
  const fromNowPeriod = Boolean(props.fromNowDuring)
    && -datetime.diff(momentRef()) < (props.fromNowDuring as number);

  const ctx: ContentContext = { props, datetime, format, fromNowPeriod, settings };

  const customRenderers = [
    ...(settings.renderers ?? []),
    ...(props.renderers ?? [])
  ];
  const allRenderers = [...customRenderers, ...contentRenderers];

  let content: MomentContent | undefined;
  for (const render of allRenderers) {
    let result: MomentContent | undefined;
    try {
      result = render(ctx);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[react-moment] Content renderer threw:', error);
      continue;
    }
    if (result !== undefined) {
      content = result;
      break;
    }
  }

  const resolved = content ?? renderDefault(ctx) ?? datetime.toString();
  content = formatDurationContent(ctx, resolved);
  return applyContentFilter(props, content, settings);
}
