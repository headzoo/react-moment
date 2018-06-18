import * as React from 'react';

export interface MomentProps {
    element?: string | React.SFC<any> | React.ComponentClass<any>;
    date?: string | number | Array<any> | object;
    parse?: string | Array<any>;
    format?: string;
    ago?: boolean;
    fromNow?: boolean;
    fromNowDuring?: number;
    from?: string | number | Array<any> | object;
    toNow?: boolean;
    to?: string | number | Array<any> | object;
    filter?: (d: string) => string,
    calendar?: boolean | object;
    diff?: string | number | Array<any> | object;
    unit?: string;
    decimal?: boolean;
    unix?: boolean;
    utc?: boolean;
    tz?: string;
    locale?: string;
    interval?: number;
    subtract?: {
        years?: number
        quarters?: number
        months?: number
        weeks?: number
        days?: number
        hours?: number
        minutes?: number
        seconds?: number
        milliseconds?: number
    }
    add?: {
        years?: number
        quarters?: number
        months?: number
        weeks?: number
        days?: number
        hours?: number
        minutes?: number
        seconds?: number
        milliseconds?: number
    }
    children?: string | number;
}

declare class Moment extends React.Component<MomentProps, any> {

}

export default Moment;
