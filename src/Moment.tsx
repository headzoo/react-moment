import React, {
  ElementType,
  ReactNode
} from 'react';
import { useMomentUpdate } from './hooks/useMomentUpdate';
import { useMomentContext } from './MomentContext';
import { objectKeyFilter } from './objects';
import { momentPropKeys } from './momentPropKeys';
import { MomentProps } from './types';
import {
  getAdjustedDatetime,
  getContent,
  getTitle
} from './utils';

/**
 * Renders a Moment component.
 *
 * @param props - The props for the component.
 * @returns The component.
 */
const Moment: React.FC<MomentProps> = (props: MomentProps) => {
  const { settings } = useMomentContext();

  useMomentUpdate(props, (currentProps) => {
    if (currentProps.onChange) {
      currentProps.onChange(getContent(currentProps, settings));
    }
  });

  const content = getContent(props, settings);
  const datetime = getAdjustedDatetime(props, settings);

  const { withTitle, element, ...remaining } = props;
  const passProps = objectKeyFilter(
    remaining as Record<string, unknown>,
    momentPropKeys
  ) as Record<string, unknown>;

  if (withTitle) {
    passProps.title = getTitle(props, settings);
  }

  const domProps: Record<string, unknown> = { ...passProps };
  if (datetime.isValid()) {
    domProps.dateTime = datetime.toISOString();
  }

  const tag = (element ?? settings.element ?? 'time') as ElementType;

  return React.createElement(
    tag,
    domProps,
    content as ReactNode
  );
};

export default Moment;
