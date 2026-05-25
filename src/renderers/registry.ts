import { renderCalendar } from './renderCalendar';
import { renderDefault } from './renderDefault';
import { renderDiff } from './renderDiff';
import { renderDuration } from './renderDuration';
import { renderDurationFromNow } from './renderDurationFromNow';
import { renderFormat } from './renderFormat';
import { renderFrom } from './renderFrom';
import { renderFromNow } from './renderFromNow';
import { renderFromNowShort } from './renderFromNowShort';
import { renderTo } from './renderTo';
import { renderToNow } from './renderToNow';
import type { ContentRenderer } from './types';

/**
 * Ordered content renderers; first non-undefined result wins.
 */
export const contentRenderers: readonly ContentRenderer[] = [
  renderFormat,
  renderFrom,
  renderFromNowShort,
  renderFromNow,
  renderTo,
  renderToNow,
  renderCalendar,
  renderDiff,
  renderDuration,
  renderDurationFromNow,
  renderDefault
];
