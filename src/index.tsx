import React, {
  ElementType,
  ReactNode,
  useEffect,
  useReducer,
  useRef
} from 'react';
import { objectKeyFilter } from './objects';
import {
  MomentProps,
  MomentStatics,
  PoolEntry,
  momentPropKeys
} from './types';
import {
  getDatetime,
  getShortRelativeTime,
  getContent,
  getTitle
} from './utils';

type MomentComponent = React.FC<MomentProps> & MomentStatics;

/**
 * Renders a Moment component.
 * 
 * @param props - The props for the component.
 * @returns The component.
 */
const Moment: MomentComponent = ((props: MomentProps) => {
  const propsRef = useRef<MomentProps>(props);
  propsRef.current = props;

  const [, bump] = useReducer((n: number) => n + 1, 0);

  const triggerUpdate = useRef(() => {
    bump();
    const currentProps = propsRef.current;
    if (currentProps.onChange) {
      const newContent = getContent(currentProps);
      currentProps.onChange(newContent);
    }
  });

  // Per-instance interval timer (skipped when the pooled timer is active or
  // when interval === 0). Mirrors the class component's `setTimer` lifecycle.
  useEffect(() => {
    if (Moment.pooledTimer) {
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
  }, [props.interval]);

  // Pooled-timer registration. Only registers if the pool is active at mount
  // time, matching the class component's `componentDidMount` behavior.
  useEffect(() => {
    if (!Moment.pooledTimer) {
      return undefined;
    }
    const entry: PoolEntry = {
      getProps: () => propsRef.current,
      update: () => triggerUpdate.current()
    };
    Moment.pushPooledElement(entry);
    return () => {
      Moment.removePooledElement(entry);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = getContent(props);

  const { withTitle, element, ...remaining } = props;
  const passProps = objectKeyFilter(
    remaining as Record<string, unknown>,
    momentPropKeys
  ) as Record<string, unknown>;

  if (withTitle) {
    passProps.title = getTitle(props);
  }

  return React.createElement(
    (element || Moment.globalElement) as ElementType,
    {
      dateTime: getDatetime(props) as unknown as string,
      ...passProps
    },
    content as ReactNode
  );
}) as MomentComponent;

Moment.globalMoment = null;
Moment.globalLocale = null;
Moment.globalLocal = null;
Moment.globalFormat = null;
Moment.globalParse = null;
Moment.globalFilter = null;
Moment.globalElement = 'time';
Moment.globalTimezone = null;
Moment.pooledElements = [];
Moment.pooledTimer = null;

/**
 * Starts the pooled timer that drives all mounted Moment instances on a
 * single shared interval.
 */
Moment.startPooledTimer = (interval: number = 60000) => {
  Moment.clearPooledTimer();
  Moment.pooledTimer = setInterval(() => {
    Moment.pooledElements.forEach((entry) => {
      if (entry.getProps().interval !== 0) {
        entry.update();
      }
    });
  }, interval);
};

/**
 * Stops the pooled timer and clears all registered entries.
 */
Moment.clearPooledTimer = () => {
  if (Moment.pooledTimer) {
    clearInterval(Moment.pooledTimer);
    Moment.pooledTimer = null;
    Moment.pooledElements = [];
  }
};

/**
 * Adds a pool entry to the registry. Internal callers pass a record with
 * `getProps`/`update`; external callers must conform to the same shape.
 */
Moment.pushPooledElement = (entry: PoolEntry) => {
  if (!entry || typeof entry.update !== 'function' || typeof entry.getProps !== 'function') {
    console.error('Element not a valid Moment pool entry.');
    return;
  }
  if (Moment.pooledElements.indexOf(entry) === -1) {
    Moment.pooledElements.push(entry);
  }
};

/**
 * Removes a pool entry from the registry.
 */
Moment.removePooledElement = (entry: PoolEntry) => {
  const index = Moment.pooledElements.indexOf(entry);
  if (index !== -1) {
    Moment.pooledElements.splice(index, 1);
  }
};

Moment.getDatetime = getDatetime;
Moment.getShortRelativeTime = getShortRelativeTime;
Moment.getContent = getContent;

export default Moment;
