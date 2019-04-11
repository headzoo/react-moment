import React   from 'react';
import ReactDOM  from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import moment  from 'moment';
import 'moment-timezone';
import Moment  from '../src/index';

const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';
const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_DATE   = new Date(DATE_STRING);
const DATE_UNIX   = DATE_DATE.getTime() / 1000;

describe('react-moment', () => {
  beforeEach(() => {
    Moment.globalMoment   = null;
    Moment.globalLocale   = null;
    Moment.globalLocal    = null;
    Moment.globalFormat   = null;
    Moment.globalParse    = null;
    Moment.globalFilter   = null;
    Moment.globalElement  = 'time';
    Moment.globalTimezone = null;
    Moment.pooledElements = [];
    Moment.pooledTimer    = null;
  });

  it('children', () => {
    let date = TestUtils.renderIntoDocument(
      <Moment />
    );
    const expected = moment().toString();
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);

    date = TestUtils.renderIntoDocument(
      <Moment>{DATE_STRING}</Moment>
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);

    date = TestUtils.renderIntoDocument(
      <Moment>{DATE_DATE}</Moment>
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);

    date = TestUtils.renderIntoDocument(
      <Moment unix>{DATE_UNIX}</Moment>
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);
  });

  it('element', () => {
    const date = TestUtils.renderIntoDocument(
      <Moment element="span" parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(ReactDOM.findDOMNode(date).tagName).toEqual('SPAN');
  });

  it('date', () => {
    let date = TestUtils.renderIntoDocument(
      <Moment />
    );
    const expected = moment().toString();
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);

    date = TestUtils.renderIntoDocument(
      <Moment date={DATE_STRING} />
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);

    date = TestUtils.renderIntoDocument(
      <Moment date={DATE_DATE} />
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);
  });

  it('parse', () => {
    const date = TestUtils.renderIntoDocument(
      <Moment parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);
  });

  it('filter', () => {
    const filter = (d) => { return d.toUpperCase(); };
    const date = TestUtils.renderIntoDocument(
      <Moment parse="YYYY-MM-DD HH:mm" filter={filter}>1976-04-19 12:59</Moment>
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT.toUpperCase());
  });

  it('format', () => {
    const date = TestUtils.renderIntoDocument(
      <Moment format="YYYY-MM-DD">{DATE_STRING}</Moment>
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual('1976-04-19');
  });

  it('add', () => {
    const date = TestUtils.renderIntoDocument(
      <Moment add={{ days: 1 }} fromNow>{new Date()}</Moment>
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual('in a day');
  });

  it('subtract', () => {
    const date = TestUtils.renderIntoDocument(
      <Moment subtract={{ days: 1 }} fromNow>{new Date()}</Moment>
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual('a day ago');
  });

  it('fromNow', () => {
    let date = TestUtils.renderIntoDocument(
      <Moment fromNow>{DATE_STRING}</Moment>
    );
    let expected = moment(DATE_STRING).fromNow();
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);

    date = TestUtils.renderIntoDocument(
      <Moment fromNow ago>{DATE_STRING}</Moment>
    );
    expected = moment(DATE_STRING).fromNow(true);
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
  });

  it('fromNowDuring', () => {
    const twoHoursAgo = moment().add(-2, 'hours');
    const hour = 1e3 * 60 * 60;
    const TWO_HOURS_AGO_ISO = twoHoursAgo.format();

    let date = TestUtils.renderIntoDocument(
      <Moment format="YYYY-MM-DD HH:mm" fromNowDuring={3 * hour}>{TWO_HOURS_AGO_ISO}</Moment>
    );
    let expected = twoHoursAgo.fromNow();
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);

    date = TestUtils.renderIntoDocument(
      <Moment format="YYYY-MM-DD HH:mm" fromNowDuring={1 * hour}>{TWO_HOURS_AGO_ISO}</Moment>
    );
    expected = twoHoursAgo.format('YYYY-MM-DD HH:mm');
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
  });

  it('from', () => {
    let date = TestUtils.renderIntoDocument(
      <Moment from="2016-09-20T12:00">{DATE_STRING}</Moment>
    );
    let expected = moment(DATE_STRING).from('2016-09-20T12:00');
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);

    date = TestUtils.renderIntoDocument(
      <Moment from="2016-09-20T12:00" ago>{DATE_STRING}</Moment>
    );
    expected = moment(DATE_STRING).from('2016-09-20T12:00', true);
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
  });

  it('diff', () => {
    let date = TestUtils.renderIntoDocument(
      <Moment diff="2016-09-20T12:00">{DATE_STRING}</Moment>
    );
    let expected = moment(DATE_STRING).diff('2016-09-20T12:00').toString();
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);

    date = TestUtils.renderIntoDocument(
      <Moment diff="2016-09-20T12:00" unit="days">{DATE_STRING}</Moment>
    );
    expected = moment(DATE_STRING).diff('2016-09-20T12:00', 'days');
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected.toString());

    date = TestUtils.renderIntoDocument(
      <Moment diff="2016-09-20T12:00" unit="years" decimal>
        {DATE_STRING}
      </Moment>
    );
    expected = moment(DATE_STRING).diff('2016-09-20T12:00', 'years', true);
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected.toString());

    date = TestUtils.renderIntoDocument(
      <Moment diff="2016-09-20T12:00" decimal>
        {DATE_STRING}
      </Moment>
    );
    expected = moment(DATE_STRING).diff('2016-09-20T12:00', null, true);
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected.toString());
  });

  it('toNow', () => {
    let date = TestUtils.renderIntoDocument(
      <Moment toNow>{DATE_STRING}</Moment>
    );
    let expected = moment(DATE_STRING).toNow();
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);

    date = TestUtils.renderIntoDocument(
      <Moment toNow ago>{DATE_STRING}</Moment>
    );
    expected = moment(DATE_STRING).toNow(true);
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
  });

  it('to', () => {
    let date = TestUtils.renderIntoDocument(
      <Moment to="2016-09-20T12:00">{DATE_STRING}</Moment>
    );
    let expected = moment(DATE_STRING).to('2016-09-20T12:00');
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);

    date = TestUtils.renderIntoDocument(
      <Moment to="2016-09-20T12:00" ago>{DATE_STRING}</Moment>
    );
    expected = moment(DATE_STRING).to('2016-09-20T12:00', true);
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
  });

  it('calendar', () => {
    let date = TestUtils.renderIntoDocument(
      <Moment calendar>{DATE_STRING}</Moment>
    );
    let expected = moment(DATE_STRING).calendar();
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);

    date = TestUtils.renderIntoDocument(
      <Moment calendar={{ sameElse: 'YYYY-MM-DD HH:mm' }}>{DATE_STRING}</Moment>
    );
    expected = moment(DATE_STRING).calendar(null, { sameElse: 'YYYY-MM-DD HH:mm' });
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
  });

  it('unix', () => {
    const date = TestUtils.renderIntoDocument(
      <Moment unix>{DATE_UNIX}</Moment>
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);
  });

  it('utc', () => {
    const date = TestUtils.renderIntoDocument(
      <Moment utc>1976-04-19T12:59</Moment>
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual('Mon Apr 19 1976 12:59:00 GMT+0000');
  });

  it('local', () => {
    const date = TestUtils.renderIntoDocument(
      <Moment local>{DATE_STRING}</Moment>
    );
    const expected = moment(DATE_STRING).local().toString();
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
  });

  it('utc and local', () => {
    const date = TestUtils.renderIntoDocument(
      <Moment utc local>{DATE_STRING}</Moment>
    );
    const expected = moment.utc(DATE_STRING).local().toString();
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
  });

  it('tz', () => {
    const date = TestUtils.renderIntoDocument(
      <Moment unix tz="America/Los_Angeles">{DATE_UNIX}</Moment>
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual('Mon Apr 19 1976 09:59:00 GMT-0800');
  });

  it('other', () => {
    const date = TestUtils.renderIntoDocument(
      <Moment className="testing" aria-hidden>{DATE_STRING}</Moment>
    );
    expect(ReactDOM.findDOMNode(date).getAttribute('class')).toEqual('testing');
    expect(ReactDOM.findDOMNode(date).getAttribute('aria-hidden')).toEqual('true');
  });

  it('updates content when props are updated', () => {
    const renderInContainer = (component, componentProps = {}) => {
      class PropChangeContainer extends React.Component {
        constructor(props) {
          super(props);
          this.state = props;
        }
        render() {
          return React.createElement(component, this.state);
        }
      }

      const container = TestUtils.renderIntoDocument(<PropChangeContainer {...componentProps} />);
      const instance = TestUtils.findRenderedComponentWithType(container, component);

      return [container, instance];
    };

    const [container, date] = renderInContainer(Moment, { children: DATE_STRING });
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);

    const NEW_DATE_STRING = '1976-04-20T12:59-0500';
    const NEW_DATE_OUTPUT = 'Tue Apr 20 1976 12:59:00 GMT-0500';

    container.setState({
      children: NEW_DATE_STRING
    });
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(NEW_DATE_OUTPUT);
  });

  it('pooled timer', () => {
    Moment.startPooledTimer(1);
    const date = TestUtils.renderIntoDocument(
      <Moment />
    );
    const expected = moment().toString();
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
    date.componentWillUnmount();
  });

  it('globalLocale', () => {
    Moment.globalLocale = 'fr';
    const date = TestUtils.renderIntoDocument(
      <Moment format="D MMM YYYY" date="1976-04-19T12:59-0500" />
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual('19 avr. 1976');
  });

  it('globalTimezone', () => {
    Moment.globalTimezone = 'America/Los_Angeles';
    const date = TestUtils.renderIntoDocument(
      <Moment format="YYYY-MM-DD HH" date="1976-04-19T12:59-0500" />
    );
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual('1976-04-19 09');
  });

  it('globalLocal', () => {
    Moment.globalLocal = true;
    const date = TestUtils.renderIntoDocument(
      <Moment>{DATE_STRING}</Moment>
    );
    const expected = moment(DATE_STRING).local().toString();
    expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
  });

  it('globalElement', () => {
    Moment.globalElement = 'span';
    const date = TestUtils.renderIntoDocument(
      <Moment parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(ReactDOM.findDOMNode(date).tagName).toEqual('SPAN');
  });

  it('globalElement overwrite', () => {
    Moment.globalElement = 'span';
    const date = TestUtils.renderIntoDocument(
      <Moment element="div" parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(ReactDOM.findDOMNode(date).tagName).toEqual('DIV');
  });
});
