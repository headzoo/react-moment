import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { objectKeyFilter } from './objects';

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
    element:  PropTypes.any,
    date:     PropTypes.oneOfType(dateTypes),
    parse:    PropTypes.oneOfType(parseTypes),
    format:   PropTypes.string,
    add:      PropTypes.object,
    subtract: PropTypes.object,
    ago:      PropTypes.bool,
    fromNow:  PropTypes.bool,
    from:     PropTypes.oneOfType(dateTypes),
    toNow:    PropTypes.bool,
    to:       PropTypes.oneOfType(dateTypes),
    calendar: PropTypes.bool,
    unix:     PropTypes.bool,
    utc:      PropTypes.bool,
    tz:       PropTypes.string,
    locale:   PropTypes.string,
    interval: PropTypes.number,
    onChange: PropTypes.func
  };

  static defaultProps = {
    element:  'time',
    fromNow:  false,
    toNow:    false,
    calendar: false,
    ago:      false,
    unix:     false,
    utc:      false,
    interval: 60000,
    onChange: () => {}
  };

  static globalLocale   = null;
  static globalFormat   = null;
  static globalParse    = null;
  static globalElement  = null;
  static pooledElements = [];
  static pooledTimer    = null;

  /**
   * Starts the pooled timer
   *
   * @param {number} interval
   */
  static startPooledTimer(interval = 60000) {
    Moment.clearPooledTimer();
    Moment.pooledTimer = setInterval(() => {
      Moment.pooledElements.forEach((element) => {
        if (element.props.interval !== 0) {
          element.update();
        }
      });
    }, interval);
  }

  /**
   * Stops the pooled timer
   */
  static clearPooledTimer() {
    if (Moment.pooledTimer) {
      clearInterval(Moment.pooledTimer);
      Moment.pooledTimer    = null;
      Moment.pooledElements = [];
    }
  }

  /**
   * Adds a Moment instance to the pooled elements list
   *
   * @param {Moment|React.Component} element
   */
  static pushPooledElement(element) {
    if (!(element instanceof Moment)) {
      console.error('Element not an instance of Moment.');
      return;
    }
    if (Moment.pooledElements.indexOf(element) === -1) {
      Moment.pooledElements.push(element);
    }
  }

  /**
   * Removes a Moment instance from the pooled elements list
   *
   * @param {Moment|React.Component} element
   */
  static removePooledElement(element) {
    const index = Moment.pooledElements.indexOf(element);
    if (index !== -1) {
      Moment.pooledElements.splice(index, 1);
    }
  }

  /**
   * Returns a Date based on the set props
   *
   * @param {*} props
   * @returns {*}
   */
  static getDatetime(props) {
    const { utc, unix, tz } = props;
    let { date, locale, parse } = props;

    date = date || props.children;
    parse = parse || Moment.globalParse;
    if (Moment.globalLocale) {
      locale = Moment.globalLocale;
    } else {
      locale = locale || moment.locale();
    }

    let datetime = null;
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

    return datetime;
  }

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
    this.update(this.props);
  }

  /**
   * Invoked immediately after a component is mounted
   */
  componentDidMount() {
    this.setTimer();
    if (Moment.pooledTimer) {
      Moment.pushPooledElement(this);
    }
  }

  /**
   * Invoked before a mounted component receives new props
   *
   * @param {*} nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.update(nextProps);
  }

  /**
   * Invoked immediately after updating occurs
   *
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    if (prevProps.interval !== this.props.interval) {
      this.setTimer();
    }
  }

  /**
   * Invoked immediately before a component is unmounted and destroyed
   */
  componentWillUnmount() {
    this.clearTimer();
  }

  /**
   * Starts the interval timer.
   */
  setTimer = () => {
    this.clearTimer();
    const interval = this.props.interval;
    if (!Moment.pooledTimer && interval !== 0) {
      this.timer = setInterval(() => {
        this.update(this.props);
      }, interval);
    }
  };

  /**
   * Clears the interval timer.
   */
  clearTimer = () => {
    if (!Moment.pooledTimer && this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (Moment.pooledTimer && !this.timer) {
      Moment.removePooledElement(this);
    }
  };

  /**
   * Updates this.state.content
   */
  update(props) {
    props = props || this.props;
    const { fromNow, from, add, subtract, toNow, to, ago, calendar } = props;
    let { format } = props;

    format = format || Moment.globalFormat;
    const datetime = Moment.getDatetime(props);
    if (add) {
      datetime.add(add);
    }
    if (subtract) {
      datetime.subtract(subtract);
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
    this.setState({ content }, () => {
      this.props.onChange(content);
    });
  }

  render() {
    const props = objectKeyFilter(this.props, Moment.propTypes);
    return React.createElement(Moment.globalElement || this.props.element, {
      dateTime: Moment.getDatetime(this.props),
      ...props
    },
      this.state.content
    );
  }
}
