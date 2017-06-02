'use strict';

import React  from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';

export default class Moment extends React.Component {
    constructor(props) {
      super(props);

      this.state = { content: '' };
    }

    componentWillMount() {
        this.generateContent(this.props);
    }

    componentDidMount() {
        this.interval = global.setInterval(() => {
            this.generateContent(this.props);
        }, 60000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentWillReceiveProps(nextProps) {
        this.generateContent(nextProps);
    }

    static getDatetime(props) {
        let {
            date,
            locale,
            parse,
            utc,
            unix,
            tz
        } = props;
        date = date || props.children;

        let datetime = null;
        locale = locale ? locale : moment.locale();

        if (utc) {
            datetime = moment.utc(date, parse, locale);
        } else if (unix) {
            // moment#unix fails because of a deprecation,
            // but since moment#unix(s) is implemented as moment(s * 1000),
            // this works equivalently
            datetime = moment(date * 1000, parse, locale);
        } else {
            datetime = moment(date, parse, locale);
        }
        if (tz) {
            datetime = datetime.tz(tz);
        }

        return datetime
    }

    generateContent(props) {
        let {
            format,
            fromNow,
            from,
            toNow,
            to,
            calendar,
            ago
        } = props;

        let datetime = Moment.getDatetime(props);

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

        this.setState({ content })
    }

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
            tz,
            locale,
            ...other
        } = this.props;
        let datetime = Moment.getDatetime(this.props);
        let {
          content,
        } = this.state;

        return (
            <time dateTime={datetime.format()} {...other}>{content}</time>
        )
    }
}

const dateTypes = [
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
    PropTypes.object
];

const parseTypes = [
    PropTypes.string,
    PropTypes.array
];

Moment.propTypes = {
    date:       PropTypes.oneOfType(dateTypes),
    parse:      PropTypes.oneOfType(parseTypes),
    format:     PropTypes.string,
    ago:        PropTypes.bool,
    fromNow:    PropTypes.bool,
    from:       PropTypes.oneOfType(dateTypes),
    toNow:      PropTypes.bool,
    to:         PropTypes.oneOfType(dateTypes),
    calendar:   PropTypes.bool,
    unix:       PropTypes.bool,
    utc:        PropTypes.bool,
    tz:         PropTypes.string,
    locale:     PropTypes.string
};

Moment.defaultProps = {
    fromNow:    false,
    toNow:      false,
    calendar:   false,
    ago:        false,
    unix:       false,
    utc:        false
};
