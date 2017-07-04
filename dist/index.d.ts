import * as React from 'react';

export interface MomentProps {
    date?: string | number | Array<any> | object;
    parse?: string | Array<any>;
    format?: string;
    ago?: boolean;
    fromNow?: boolean;
    from?: string | number | Array<any> | object;
    toNow?: boolean;
    to?: string | number | Array<any> | object;
    calendar?: boolean;
    unix?: boolean;
    utc?: boolean;
    tz?: string;
    locale?: string;

    children?: string;
}

declare class Moment extends React.Component<MomentProps, any> {

}

export default Moment;