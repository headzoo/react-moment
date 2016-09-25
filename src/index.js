'use strict';

import React  from 'react';
import moment from 'moment';

export default class Moment extends React.Component {
    
    render() {
        let {
            date,
            parse,
            format,
            fromNow,
            from,
            toNow,
            to,
            calendar,
            ago,
            utc,
            unix,
            ...other,
            } = this.props;
        date = date || this.props.children;
        
        let datetime = null;
        if (utc) {
            datetime = moment.utc(date, parse);
        } else if (unix) {
            datetime = moment.unix(date);
        } else {
            datetime = moment(date, parse);
        }
        
        let content  = '';
        if (format) {
            content = datetime.format(format);
        } else if (from) {
            content = datetime.from(from, ago);
        } else if (fromNow) {
            content = datetime.fromNow(ago);
        } else if (to) {
            content = datetime.to(to, ago);
        } else if (toNow) {
            content = datetime.toNow(ago);
        } else if (calendar) {
            content = datetime.calendar();
        } else {
            content = datetime.toString();
        }
        
        return (
            <time dateTime={datetime.format()} {...other}>{content}</time>
        )
    }
}

const dateTypes = [
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.array,
    React.PropTypes.object
];

const parseTypes = [
    React.PropTypes.string,
    React.PropTypes.array
];

Moment.propTypes = {
    date:       React.PropTypes.oneOfType(dateTypes),
    parse:      React.PropTypes.oneOfType(parseTypes),
    format:     React.PropTypes.string,
    ago:        React.PropTypes.bool,
    fromNow:    React.PropTypes.bool,
    from:       React.PropTypes.oneOfType(dateTypes),
    toNow:      React.PropTypes.bool,
    to:         React.PropTypes.oneOfType(dateTypes),
    calendar:   React.PropTypes.bool,
    unix:       React.PropTypes.bool,
    utc:        React.PropTypes.bool
};

Moment.defaultProps = {
    fromNow:    false,
    toNow:      false,
    calendar:   false,
    ago:        false,
    unix:       false,
    utc:        false
};
