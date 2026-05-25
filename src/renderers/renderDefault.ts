import type { ContentRenderer } from './types';

/**
 * Fallback renderer returning datetime.toString().
 */
export const renderDefault: ContentRenderer = ({ datetime }) => {
  return datetime.toString();
};
