import { useEffect, useReducer, useRef } from 'react';
import { useMomentContext } from '../MomentContext';
import type { MomentProps, PoolEntry } from '../types';

/**
 * Drives periodic re-renders for Moment formatting, mirroring the `<Moment>`
 * component's interval and pooled-timer lifecycle.
 */
export function useMomentUpdate(
  props: MomentProps,
  onTick?: (currentProps: MomentProps) => void
): void {
  const { pool } = useMomentContext();
  const propsRef = useRef<MomentProps>(props);
  propsRef.current = props;

  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const [, bump] = useReducer((n: number) => n + 1, 0);

  const triggerUpdate = useRef(() => {
    bump();
    onTickRef.current?.(propsRef.current);
  });

  useEffect(() => {
    if (pool) {
      return undefined;
    }
    if (props.interval === 0) {
      return undefined;
    }
    const intervalMs = props.interval ?? 60000;
    const timer = setInterval(() => {
      triggerUpdate.current();
    }, intervalMs);
    return () => {
      clearInterval(timer);
    };
  }, [pool, props.interval]);

  useEffect(() => {
    if (!pool) {
      return undefined;
    }
    const entry: PoolEntry = {
      getProps: () => propsRef.current,
      update: () => triggerUpdate.current()
    };
    pool.add(entry);
    return () => {
      pool.remove(entry);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool]);
}
