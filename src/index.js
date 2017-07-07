import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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

export default class Moment extends React.Component {
    static propTypes = {
      as: PropTypes.any,
      date: PropTypes.oneOfType(dateTypes),
      parse: PropTypes.oneOfType(parseTypes),
      format: PropTypes.string,
      ago: PropTypes.bool,
      fromNow: PropTypes.bool,
      from: PropTypes.oneOfType(dateTypes),
      toNow: PropTypes.bool,
      to: PropTypes.oneOfType(dateTypes),
      calendar: PropTypes.bool,
      unix: PropTypes.bool,
      utc: PropTypes.bool,
      tz: PropTypes.string,
      locale: PropTypes.string
    };
    
    static defaultProps = {
      fromNow: false,
      toNow: false,
      calendar: false,
      ago: false,
      unix: false,
      utc: false
    };
    
    constructor(props) {
        super(props);
        this.state = {
            content: ''
        };
    }
    
    componentWillMount() {
        this.generateContent(this.props);
    }
    
    componentDidMount() {
        this.interval = setInterval(() => {
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
        locale       = locale ? locale : moment.locale();
        
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
        let content = '';
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
        
        this.setState({content})
    }
    
    render() {
        const {
            as,
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
        const {
            content
        } = this.state;
        
        return React.createElement(
          this.props.as || "time",
          {
              dateTime: Moment.getDatetime(this.props),
              ...other
          },
          content
        );
    }
}
