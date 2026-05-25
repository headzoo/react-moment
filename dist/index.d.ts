import React from 'react';
import { MomentProps, MomentStatics } from './types';
type MomentComponent = React.FC<MomentProps> & MomentStatics;
declare const Moment: MomentComponent;
export default Moment;
