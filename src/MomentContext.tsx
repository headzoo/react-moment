import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';
import type {
  MomentProviderProps,
  MomentSettings,
  PoolEntry
} from './types';

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
export const defaultSettings: MomentSettings = {
  moment: null,
  locale: null,
  local: null,
  format: null,
  parse: null,
  filter: null,
  filters: null,
  renderers: null,
  element: 'time',
  timezone: null
};

const defaultContextValue: MomentContextValue = {
  settings: defaultSettings,
  pool: null
};

export const MomentContext = createContext<MomentContextValue>(defaultContextValue);

/**
 * Returns the nearest `MomentContext` value.
 */
export function useMomentContext(): MomentContextValue {
  return useContext(MomentContext);
}

const settingKeys: (keyof MomentSettings)[] = [
  'moment',
  'locale',
  'local',
  'format',
  'parse',
  'filter',
  'filters',
  'renderers',
  'element',
  'timezone'
];

type MomentSettingsInput = Partial<Omit<MomentProviderProps, 'children' | 'pool' | 'interval'>>;

/**
 * Shallow-merges provider props onto parent settings.
 */
function mergeSettings(
  parent: MomentSettings,
  props: MomentSettingsInput
): MomentSettings {
  const merged = { ...parent };
  for (const key of settingKeys) {
    if (key in props && props[key] !== undefined) {
      (merged as Record<string, unknown>)[key] = props[key];
    }
  }
  return merged;
}

/**
 * Supplies default settings and optional pooled timing to descendant `<Moment>` instances.
 */
export function MomentProvider({
  children,
  pool: enablePool,
  interval = 60000,
  moment: momentProp,
  locale,
  local,
  format,
  parse,
  filter,
  filters,
  renderers,
  element,
  timezone
}: MomentProviderProps): React.ReactElement {
  const parent = useMomentContext();
  const entriesRef = useRef<Set<PoolEntry>>(new Set());

  const settings = useMemo(
    () => mergeSettings(parent.settings, {
      moment: momentProp,
      locale,
      local,
      format,
      parse,
      filter,
      filters,
      renderers,
      element,
      timezone
    }),
    [
      parent.settings,
      momentProp,
      locale,
      local,
      format,
      parse,
      filter,
      filters,
      renderers,
      element,
      timezone
    ]
  );

  const pool = useMemo<PoolController | null>(() => {
    if (!enablePool) {
      return null;
    }
    return {
      add: (entry: PoolEntry) => {
        entriesRef.current.add(entry);
      },
      remove: (entry: PoolEntry) => {
        entriesRef.current.delete(entry);
      }
    };
  }, [enablePool]);

  useEffect(() => {
    if (!enablePool) {
      return undefined;
    }
    const timer = setInterval(() => {
      entriesRef.current.forEach((entry) => {
        if (entry.getProps().interval !== 0) {
          entry.update();
        }
      });
    }, interval);
    return () => {
      clearInterval(timer);
      entriesRef.current.clear();
    };
  }, [enablePool, interval]);

  const value = useMemo(
    () => ({ settings, pool }),
    [settings, pool]
  );

  return (
    <MomentContext.Provider value={value}>
      {children}
    </MomentContext.Provider>
  );
}
