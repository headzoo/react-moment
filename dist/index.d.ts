import React from 'react';
import { MomentProps, MomentStatics } from './types';
import { getDatetime, getShortRelativeTime, getContent } from './utils';
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
declare const Moment: MomentComponent;
export { getDatetime, getShortRelativeTime, getContent };
export default Moment;
