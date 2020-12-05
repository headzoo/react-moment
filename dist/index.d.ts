import moment from 'moment';
import { Component, ComponentClass, SFC, CSSProperties } from 'react';

type elementTypes = string | SFC<any> | ComponentClass<any>;
type subtractOrAddTypes = {
    years?: number,
    y?: number,
    quarters?: number,
    Q?: number,
    months?: number,
    M?: number,
    weeks?: number,
    w?: number,
    days?: number,
    d?: number,
    hours?: number,
    h?: number,
    minutes?: number,
    m?: number,
    seconds?: number,
    s?: number,
    milliseconds?: number,
    ms?: number
};
type dateTypes = string|number|Array<string|number|object>|object;
type calendarTypes = boolean|object;
type trimTypes = boolean|string;

export interface MomentProps {
    element?: elementTypes,
    date?: dateTypes,
    parse?: string | Array<any>,
    format?: string,
    ago?: boolean,
    fromNow?: boolean,
    fromNowDuring?: number,
    from?: dateTypes,
    toNow?: boolean,
    to?: dateTypes,
    calendar?: calendarTypes,
    diff?: dateTypes,
    duration?: dateTypes,
    durationFromNow?: boolean,
    trim?: trimTypes,
    unit?: string,
    decimal?: boolean,
    unix?: boolean,
    utc?: boolean,
    local?: boolean,
    tz?: string,
    locale?: string,
    interval?: number,
    withTitle?: boolean,
    titleFormat?: string,
    subtract?: subtractOrAddTypes,
    add?: subtractOrAddTypes,
    children?: string | number | Date | moment.Moment,
    style?: CSSProperties,
    className?: string,
    filter?: (date: string) => string,
    onChange?: (content:any) => any
}

declare class Moment extends Component<MomentProps, any> {
    constructor(props:MomentProps);
    public static globalMoment: Function;
    public static globalLocale: string;
    public static globalLocal: boolean;
    public static globalFormat: string;
    public static globalParse: string;
    public static globalTimezone: string;
    public static globalElement: any;
    public static globalFilter: Function;
    public static startPooledTimer(interval?: number): void;
    public static clearPooledTimer(): void;
    public static getDatetime(props: MomentProps): any;
}

export default Moment;
