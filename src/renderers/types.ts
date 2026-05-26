import type momentLib from 'moment';
import type { MomentContent, MomentProps, MomentSettings } from '../types';

/**
 * Context passed to each content renderer during getContent.
 */
export interface ContentContext {
  props: MomentProps;
  datetime: momentLib.Moment;
  format: string | undefined;
  fromNowPeriod: boolean;
  settings: MomentSettings;
}

/**
 * A content renderer returns undefined when its mode does not apply.
 */
export type ContentRenderer = (ctx: ContentContext) => MomentContent | undefined;
