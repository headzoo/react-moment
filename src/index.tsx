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

/**
 * React function component merged with static globals and pooled-timer API.
 */
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
    (element || Moment.globals.element) as ElementType,
    {
      dateTime: getDatetime(props) as unknown as string,
      ...passProps
    },
    content as ReactNode
  );
}) as MomentComponent;

Moment.globals = {
  // Optional replacement for the imported moment module, useful for custom moment instances.
  moment: null,
  // Default locale applied when a component does not receive a locale prop.
  locale: null,
  // Forces dates into local time unless a component provides a local prop.
  local: null,
  // Default display format used when a component does not receive a format prop.
  format: null,
  // Default parse format used when a component does not receive a parse prop.
  parse: null,
  // Default content transformer used when a component does not receive a filter prop.
  filter: null,
  // Default custom filters used when a component does not receive a filters prop.
  filters: null,
  // Default custom renderers used when a component does not receive a renderers prop.
  renderers: null,
  // Default HTML element used when a component does not receive an element prop.
  element: 'time',
  // Default timezone applied when a component does not receive a tz prop.
  timezone: null
};

// Registry of mounted component entries updated by the shared pooled timer.
Moment.pooledElements = [];

// Shared interval handle used to update all pooled component entries.
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

export { getDatetime, getShortRelativeTime, getContent };
export default Moment;
