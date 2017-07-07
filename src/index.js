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
    locale: PropTypes.string,
    interval: PropTypes.number,
    onChange: PropTypes.func
  };

  static defaultProps = {
    fromNow: false,
    toNow: false,
    calendar: false,
    ago: false,
    unix: false,
    utc: false,
    interval: 60000,
    onChange: function () {
    }
  };

  /**
   * Constructor
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };
    this.timer = null;
  }

  /**
   * Invoked immediately before mounting occurs
   */
  componentWillMount() {
    this.updateContent(this.props);
  }

  /**
   * Invoked immediately after a component is mounted
   */
  componentDidMount() {
    this.startTimer();
  }

  /**
   * Invoked immediately before a component is unmounted and destroyed
   */
  componentWillUnmount() {
    this.clearTimer();
  }

  /**
   * Invoked before a mounted component receives new props
   *
   * @param {*} nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.updateContent(nextProps);
  }

  /**
   * Invoked immediately after updating occurs
   *
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    if (prevProps.interval !== this.props.interval) {
      this.startTimer();
    }
  }

  /**
   * Starts the interval timer.
   */
  startTimer = () => {
    const interval = this.props.interval;
    this.clearTimer();
    if (interval !== 0) {
      this.timer = setInterval(() => {
        this.updateContent(this.props);
      }, interval);
    }
  };

  /**
   * Clears the interval timer.
   */
  clearTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  };

  /**
   * Returns a Date based on the set props
   *
   * @param {*} props
   * @returns {Date}
   */
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

  /**
   * Updates this.state.content
   *
   * @param {*} props
   */
  updateContent(props) {
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

    this.setState({content}, () => {
      this.props.onChange(content);
    });
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
      interval,
      ...other
      } = this.props;

    return React.createElement(this.props.as || 'time', {
        dateTime: Moment.getDatetime(this.props),
        ...other
      },
      this.state.content
    );
  }
}
