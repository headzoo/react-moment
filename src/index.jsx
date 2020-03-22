import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
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

const calendarTypes = [
  PropTypes.object,
  PropTypes.bool
];

export default class Moment extends React.Component {
  static propTypes = {
    element:         PropTypes.any,
    date:            PropTypes.oneOfType(dateTypes),
    parse:           PropTypes.oneOfType(parseTypes),
    format:          PropTypes.string,
    add:             PropTypes.object,
    subtract:        PropTypes.object,
    ago:             PropTypes.bool,
    fromNow:         PropTypes.bool,
    fromNowDuring:   PropTypes.number,
    from:            PropTypes.oneOfType(dateTypes),
    toNow:           PropTypes.bool,
    to:              PropTypes.oneOfType(dateTypes),
    calendar:        PropTypes.oneOfType(calendarTypes),
    unix:            PropTypes.bool,
    utc:             PropTypes.bool,
    local:           PropTypes.bool,
    tz:              PropTypes.string,
    withTitle:       PropTypes.bool,
    titleFormat:     PropTypes.string,
    locale:          PropTypes.string,
    interval:        PropTypes.number,
    diff:            PropTypes.oneOfType(dateTypes),
    duration:        PropTypes.oneOfType(dateTypes),
    durationFromNow: PropTypes.bool,
    unit:            PropTypes.string,
    decimal:         PropTypes.bool,
    filter:          PropTypes.func,
    onChange:        PropTypes.func
  };

  static defaultProps = {
    element:     null,
    fromNow:     false,
    toNow:       false,
    calendar:    false,
    ago:         false,
    unix:        false,
    utc:         false,
    local:       false,
    unit:        null,
    withTitle:   false,
    decimal:     false,
    titleFormat: '',
    interval:    60000,
    filter:      (d) => { return d; },
    onChange:    () => {}
  };

  static globalMoment   = null;

  static globalLocale   = null;

  static globalLocal    = null;

  static globalFormat   = null;

  static globalParse    = null;

  static globalFilter   = null;

  static globalElement  = 'time';

  static globalTimezone = null;

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
    const { utc, unix } = props;
    let { date, locale, parse, tz, local } = props;

    date = date || props.children;
    parse = parse || Moment.globalParse;
    local = local || Moment.globalLocal;
    tz = tz || Moment.globalTimezone;
    if (Moment.globalLocale) {
      locale = Moment.globalLocale;
    } else {
      locale = locale || Moment.globalMoment.locale();
    }

    let datetime = null;
    if (utc) {
      datetime = Moment.globalMoment.utc(date, parse, locale);
    } else if (unix) {
      // moment#unix fails because of a deprecation,
      // but since moment#unix(s) is implemented as moment(s * 1000),
      // this works equivalently
      datetime = Moment.globalMoment(date * 1000, parse, locale);
    } else {
      datetime = Moment.globalMoment(date, parse, locale);
    }
    if (tz) {
      datetime = datetime.tz(tz);
    } else if (local) {
      datetime = datetime.local();
    }

    return datetime;
  }

  /**
   * Returns computed content from sent props
   * @param {*} props
   * @returns {*}
   *
  */
  static getContent(props) {
    const {
      fromNow, fromNowDuring, from, add, subtract, toNow, to, ago,
      calendar, diff, duration, durationFromNow, unit, decimal, trim
    } = props;

    let { format } = props;

    format = format || Moment.globalFormat;
    const datetime = Moment.getDatetime(props);
    if (add) {
      datetime.add(add);
    }
    if (subtract) {
      datetime.subtract(subtract);
    }

    const fromNowPeriod = Boolean(fromNowDuring) && -datetime.diff(moment()) < fromNowDuring;
    let content  = '';
    if (format && !fromNowPeriod && !(durationFromNow || duration)) {
      content = datetime.format(format);
    } else if (from) {
      content = datetime.from(from, ago);
    } else if (fromNow || fromNowPeriod) {
      content = datetime.fromNow(ago);
    } else if (to) {
      content = datetime.to(to, ago);
    } else if (toNow) {
      content = datetime.toNow(ago);
    } else if (calendar) {
      content = datetime.calendar(null, calendar);
    } else if (diff) {
      content = datetime.diff(diff, unit, decimal);
    } else if (duration) {
      content = datetime.diff(duration);
    } else if (durationFromNow) {
      content = moment().diff(datetime);
    } else {
      content = datetime.toString();
    }

    if (duration || durationFromNow) {
      content = moment.duration(content);
      content = content.format(format, { trim });
    }

    const filter = Moment.globalFilter || props.filter;
    content = filter(content);

    return content;
  }

  /**
   * Constructor
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);

    if (!Moment.globalMoment) {
      Moment.globalMoment = moment;
    }
    this.state = {
      content: ''
    };
    this.timer = null;
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
   * Invoked immediately after updating occurs
   *
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { interval } = this.props;

    if (prevProps.interval !== interval) {
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
   * Invoked as a mounted component receives new props
   * What it returns will become state.
   *
   * @param {*} nextProps
   * @returns {*} (new state)
   */
  static getDerivedStateFromProps(nextProps) {
    const content = Moment.getContent(nextProps);
    return { content };
  }

  /**
   * Starts the interval timer.
   */
  setTimer = () => {
    const { interval } = this.props;

    this.clearTimer();
    if (!Moment.pooledTimer && interval !== 0) {
      this.timer = setInterval(() => {
        this.update(this.props);
      }, interval);
    }
  };

  /**
   * Returns the element title to use on hover
   */
  getTitle = () => {
    const { titleFormat } = this.props;

    const datetime = Moment.getDatetime(this.props);
    const format = titleFormat || Moment.globalFormat;

    return datetime.format(format);
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
   * @param {*} props
   */
  update(props) {
    const elementProps = (props || this.props);
    const { onChange } = elementProps;

    const content = Moment.getContent(elementProps);
    this.setState({ content }, () => {
      onChange(content);
    });
  }

  /**
   * @returns {*}
   */
  render() {
    const { withTitle, element, ...remaining } = this.props;
    const { content } = this.state;

    const props = objectKeyFilter(remaining, Moment.propTypes);
    if (withTitle) {
      props.title = this.getTitle();
    }

    return React.createElement(
      element || Moment.globalElement,
      {
        dateTime: Moment.getDatetime(this.props),
        ...props
      },
      content
    );
  }
}
