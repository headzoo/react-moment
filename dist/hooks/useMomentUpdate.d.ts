import type { MomentProps } from '../types';
/**
 * Drives periodic re-renders for Moment formatting, mirroring the `<Moment>`
 * component's interval and pooled-timer lifecycle.
 */
export declare function useMomentUpdate(props: MomentProps, onTick?: (currentProps: MomentProps) => void): void;
