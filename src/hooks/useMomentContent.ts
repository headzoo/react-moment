import { useMomentContext } from '../MomentContext';
import type moment from 'moment';
import type { MomentContent, MomentProps } from '../types';
import { getContent, getDatetime, getTitle } from '../utils';
import { useMomentUpdate } from './useMomentUpdate';

/**
 * Props accepted by `useMomentContent` (same as `<Moment>` minus DOM `element`).
 */
export type UseMomentContentProps = Omit<MomentProps, 'element'>;

/**
 * Value returned by `useMomentContent`.
 */
export interface UseMomentContentResult {
  content: MomentContent;
  datetime: moment.Moment;
  title?: string;
}

/**
 * Formats a date using the same pipeline as `<Moment>`, with optional auto-updates.
 */
export function useMomentContent(
  props: UseMomentContentProps
): UseMomentContentResult {
  const { settings } = useMomentContext();

  useMomentUpdate(props, (currentProps) => {
    currentProps.onChange?.(getContent(currentProps, settings));
  });

  const datetime = getDatetime(props, settings);
  const content = getContent(props, settings);
  const result: UseMomentContentResult = { content, datetime };

  if (props.withTitle) {
    result.title = getTitle(props, settings);
  }

  return result;
}
