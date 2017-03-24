'use strict';

import React  from 'react';
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
            as,
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

        this.setState({ content, as })
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
            <this.state.as dateTime={datetime.format()} {...other}>{content}</this.state.as>
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
    as:         React.PropTypes.element,
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
    utc:        React.PropTypes.bool,
    tz:         React.PropTypes.string,
    locale:     React.PropTypes.string
};

Moment.defaultProps = {
    as:         "time",
    fromNow:    false,
    toNow:      false,
    calendar:   false,
    ago:        false,
    unix:       false,
    utc:        false
};
