import type { MomentSettings } from './types';
import { defaultSettings } from './MomentContext';

/**
 * Returns a fresh copy of default settings for tests.
 */
export function makeSettings(overrides: Partial<MomentSettings> = {}): MomentSettings {
  return { ...defaultSettings, ...overrides };
}
