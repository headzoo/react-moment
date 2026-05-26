import React from 'react';
import type { MomentProviderProps, MomentSettings, PoolEntry } from './types';
/**
 * Controls registration of mounted `<Moment>` instances with a pooled timer.
 */
export interface PoolController {
    add: (entry: PoolEntry) => void;
    remove: (entry: PoolEntry) => void;
}
/**
 * Value exposed by `MomentContext`.
 */
export interface MomentContextValue {
    settings: MomentSettings;
    pool: PoolController | null;
}
/**
 * Built-in defaults used when no `<MomentProvider>` is mounted.
 */
export declare const defaultSettings: MomentSettings;
export declare const MomentContext: React.Context<MomentContextValue>;
/**
 * Returns the nearest `MomentContext` value.
 */
export declare function useMomentContext(): MomentContextValue;
/**
 * Supplies default settings and optional pooled timing to descendant `<Moment>` instances.
 */
export declare function MomentProvider({ children, pool: enablePool, interval, moment: momentProp, locale, local, format, parse, filters, renderers, element, timezone }: MomentProviderProps): React.ReactElement;
