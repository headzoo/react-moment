import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment-timezone';
import Moment from '../src/index';

const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';
const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_DATE   = new Date(DATE_STRING);
const DATE_UNIX   = DATE_DATE.getTime() / 1000;

// TestUtils.renderIntoDocument + ReactDOM.findDOMNode no longer return a
// usable handle for function components (they return `null`), so each test
// renders into a controlled container element and the helpers below expose
// the rendered DOM node directly.
const render = (element: React.ReactElement): HTMLElement => {
  const container = document.createElement('div');
  ReactDOM.render(element, container);
  return container.firstChild as HTMLElement;
};

const domOf = (node: HTMLElement): HTMLElement => node;

const html = (node: HTMLElement): string => node.innerHTML ?? '';

describe('react-moment', () => {
  beforeEach(() => {
    Moment.globals = {
      moment: null,
      locale: null,
      local: null,
      format: null,
      parse: null,
      filter: null,
      element: 'time',
      timezone: null
    };
    Moment.pooledElements = [];
    Moment.pooledTimer    = null;
  });

  it('children', () => {
    let date = render(<Moment />);
    const expected = moment().toString();
    expect(html(date)).toEqual(expected);

    date = render(<Moment>{DATE_STRING}</Moment>);
    expect(html(date)).toEqual(DATE_OUTPUT);

    date = render(<Moment>{DATE_DATE}</Moment>);
    expect(html(date)).toEqual(DATE_OUTPUT);

    date = render(<Moment unix>{DATE_UNIX}</Moment>);
    expect(html(date)).toEqual(DATE_OUTPUT);
  });

  it('element', () => {
    const date = render(
      <Moment element="span" parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(domOf(date).tagName).toEqual('SPAN');
  });

  it('date', () => {
    let date = render(<Moment />);
    const expected = moment().toString();
    expect(html(date)).toEqual(expected);

    date = render(<Moment date={DATE_STRING} />);
    expect(html(date)).toEqual(DATE_OUTPUT);

    date = render(<Moment date={DATE_DATE} />);
    expect(html(date)).toEqual(DATE_OUTPUT);
  });

  it('parse', () => {
    const date = render(
      <Moment parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(html(date)).toEqual(DATE_OUTPUT);
  });

  it('filter', () => {
    const filter = (d: unknown) => (d as string).toUpperCase();
    const date = render(
      <Moment parse="YYYY-MM-DD HH:mm" filter={filter}>1976-04-19 12:59</Moment>
    );
    expect(html(date)).toEqual(DATE_OUTPUT.toUpperCase());
  });

  it('format', () => {
    const date = render(<Moment format="YYYY-MM-DD">{DATE_STRING}</Moment>);
    expect(html(date)).toEqual('1976-04-19');
  });

  it('add', () => {
    const date = render(<Moment add={{ days: 1 }} fromNow>{new Date()}</Moment>);
    expect(html(date)).toEqual('in a day');
  });

  it('subtract', () => {
    const date = render(<Moment subtract={{ days: 1 }} fromNow>{new Date()}</Moment>);
    expect(html(date)).toEqual('a day ago');
  });

  it('fromNow', () => {
    let date = render(<Moment fromNow>{DATE_STRING}</Moment>);
    let expected = moment(DATE_STRING).fromNow();
    expect(html(date)).toEqual(expected);

    date = render(<Moment fromNow ago>{DATE_STRING}</Moment>);
    expected = moment(DATE_STRING).fromNow(true);
    expect(html(date)).toEqual(expected);
  });

  it('fromNowShort', () => {
    const oneHourAgo = moment().add(-1, 'hour');
    const oneDayAgo = moment().add(-1, 'day');
    const twoWeeksAgo = moment().add(-2, 'weeks');
    const threeMonthsAgo = moment().add(-3, 'months');
    const twoYearsAgo = moment().add(-2, 'years');

    let date = render(<Moment fromNowShort>{oneHourAgo.format()}</Moment>);
    expect(html(date)).toEqual('1h');

    date = render(<Moment fromNowShort>{oneDayAgo.format()}</Moment>);
    expect(html(date)).toEqual('1d');

    date = render(<Moment fromNowShort>{twoWeeksAgo.format()}</Moment>);
    expect(html(date)).toEqual('14d');

    date = render(<Moment fromNowShort>{threeMonthsAgo.format()}</Moment>);
    expect(html(date)).toEqual('3mo');

    date = render(<Moment fromNowShort>{twoYearsAgo.format()}</Moment>);
    expect(html(date)).toEqual('2y');

    date = render(<Moment fromNowShort ago>{oneHourAgo.format()}</Moment>);
    expect(html(date)).toEqual('1h');

    expect(oneHourAgo.fromNow()).toEqual('an hour ago');
  });

  it('fromNowDuring', () => {
    const twoHoursAgo = moment().add(-2, 'hours');
    const hour = 1e3 * 60 * 60;
    const TWO_HOURS_AGO_ISO = twoHoursAgo.format();

    let date = render(
      <Moment format="YYYY-MM-DD HH:mm" fromNowDuring={3 * hour}>{TWO_HOURS_AGO_ISO}</Moment>
    );
    let expected = twoHoursAgo.fromNow();
    expect(html(date)).toEqual(expected);

    date = render(
      <Moment format="YYYY-MM-DD HH:mm" fromNowDuring={1 * hour}>{TWO_HOURS_AGO_ISO}</Moment>
    );
    expected = twoHoursAgo.format('YYYY-MM-DD HH:mm');
    expect(html(date)).toEqual(expected);
  });

  it('duration', () => {
    const durationStart = moment();
    const durationEnd = moment().add(-2, 'hours');

    const date = render(
      <Moment duration={durationEnd.format()} date={durationStart.format()} />
    );
    const expected = (moment.duration(durationStart.diff(durationEnd)) as unknown as {
      format: (template?: string) => string;
    }).format();
    expect(html(date)).toEqual(expected);
  });

  it('trim', () => {
    const durationStart = moment();
    const durationEnd = moment().add(-2, 'hour').add(-5, 'minute');

    let date = render(
      <Moment duration={durationEnd.format()} date={durationStart.format()} trim="small" />
    );
    let expected = (moment.duration(durationStart.diff(durationEnd)) as unknown as {
      format: (template?: string) => string;
    }).format('H:mm');
    expect(html(date)).toEqual(expected);

    date = render(
      <Moment duration={durationEnd.format()} date={durationStart.format()} trim="large" />
    );
    expected = (moment.duration(durationStart.diff(durationEnd)) as unknown as {
      format: (template?: string) => string;
    }).format('H:mm:ss');
    expect(html(date)).toEqual(expected);

    date = render(
      <Moment duration={durationEnd.format()} date={durationStart.format()} trim />
    );
    expected = (moment.duration(durationStart.diff(durationEnd)) as unknown as {
      format: (template?: string) => string;
    }).format('H:mm:ss');
    expect(html(date)).toEqual(expected);
  });

  it('from', () => {
    let date = render(<Moment from="2016-09-20T12:00">{DATE_STRING}</Moment>);
    let expected = moment(DATE_STRING).from('2016-09-20T12:00');
    expect(html(date)).toEqual(expected);

    date = render(<Moment from="2016-09-20T12:00" ago>{DATE_STRING}</Moment>);
    expected = moment(DATE_STRING).from('2016-09-20T12:00', true);
    expect(html(date)).toEqual(expected);
  });

  it('diff', () => {
    let date = render(<Moment diff="2016-09-20T12:00">{DATE_STRING}</Moment>);
    let expected: number = moment(DATE_STRING).diff('2016-09-20T12:00');
    expect(html(date)).toEqual(expected.toString());

    date = render(<Moment diff="2016-09-20T12:00" unit="days">{DATE_STRING}</Moment>);
    expected = moment(DATE_STRING).diff('2016-09-20T12:00', 'days');
    expect(html(date)).toEqual(expected.toString());

    date = render(
      <Moment diff="2016-09-20T12:00" unit="years" decimal>
        {DATE_STRING}
      </Moment>
    );
    expected = moment(DATE_STRING).diff('2016-09-20T12:00', 'years', true);
    expect(html(date)).toEqual(expected.toString());

    date = render(
      <Moment diff="2016-09-20T12:00" decimal>
        {DATE_STRING}
      </Moment>
    );
    expected = moment(DATE_STRING).diff('2016-09-20T12:00', undefined, true);
    expect(html(date)).toEqual(expected.toString());
  });

  it('toNow', () => {
    let date = render(<Moment toNow>{DATE_STRING}</Moment>);
    let expected = moment(DATE_STRING).toNow();
    expect(html(date)).toEqual(expected);

    date = render(<Moment toNow ago>{DATE_STRING}</Moment>);
    expected = moment(DATE_STRING).toNow(true);
    expect(html(date)).toEqual(expected);
  });

  it('to', () => {
    let date = render(<Moment to="2016-09-20T12:00">{DATE_STRING}</Moment>);
    let expected = moment(DATE_STRING).to('2016-09-20T12:00');
    expect(html(date)).toEqual(expected);

    date = render(<Moment to="2016-09-20T12:00" ago>{DATE_STRING}</Moment>);
    expected = moment(DATE_STRING).to('2016-09-20T12:00', true);
    expect(html(date)).toEqual(expected);
  });

  it('calendar', () => {
    let date = render(<Moment calendar>{DATE_STRING}</Moment>);
    let expected = moment(DATE_STRING).calendar();
    expect(html(date)).toEqual(expected);

    date = render(<Moment calendar={{ sameElse: 'YYYY-MM-DD HH:mm' }}>{DATE_STRING}</Moment>);
    expected = moment(DATE_STRING).calendar(
      null as unknown as moment.MomentInput,
      { sameElse: 'YYYY-MM-DD HH:mm' }
    );
    expect(html(date)).toEqual(expected);
  });

  it('unix', () => {
    const date = render(<Moment unix>{DATE_UNIX}</Moment>);
    expect(html(date)).toEqual(DATE_OUTPUT);
  });

  it('utc', () => {
    const date = render(<Moment utc>1976-04-19T12:59</Moment>);
    expect(html(date)).toEqual('Mon Apr 19 1976 12:59:00 GMT+0000');
  });

  it('local', () => {
    const date = render(<Moment local>{DATE_STRING}</Moment>);
    const expected = moment(DATE_STRING).local().toString();
    expect(html(date)).toEqual(expected);
  });

  it('utc and local', () => {
    const date = render(<Moment utc local>{DATE_STRING}</Moment>);
    const expected = moment.utc(DATE_STRING).local().toString();
    expect(html(date)).toEqual(expected);
  });

  it('tz', () => {
    const date = render(<Moment unix tz="America/Los_Angeles">{DATE_UNIX}</Moment>);
    expect(html(date)).toEqual('Mon Apr 19 1976 09:59:00 GMT-0800');
  });

  it('other', () => {
    const date = render(<Moment className="testing" aria-hidden>{DATE_STRING}</Moment>);
    expect(domOf(date).getAttribute('class')).toEqual('testing');
    expect(domOf(date).getAttribute('aria-hidden')).toEqual('true');
  });

  it('updates content when props are updated', () => {
    type ContainerState = { children: string };

    // eslint-disable-next-line @typescript-eslint/ban-types
    class PropChangeContainer extends React.Component<{}, ContainerState> {
      // eslint-disable-next-line @typescript-eslint/ban-types
      constructor(props: {}) {
        super(props);
        this.state = { children: DATE_STRING };
      }

      render() {
        return <Moment>{this.state.children}</Moment>;
      }
    }

    const ref = React.createRef<PropChangeContainer>();
    const container = document.createElement('div');
    ReactDOM.render(<PropChangeContainer ref={ref} />, container);

    expect((container.firstChild as HTMLElement).innerHTML).toEqual(DATE_OUTPUT);

    const NEW_DATE_STRING = '1976-04-20T12:59-0500';
    const NEW_DATE_OUTPUT = 'Tue Apr 20 1976 12:59:00 GMT-0500';

    ref.current!.setState({ children: NEW_DATE_STRING });
    expect((container.firstChild as HTMLElement).innerHTML).toEqual(NEW_DATE_OUTPUT);
  });

  it('pooled timer', () => {
    Moment.startPooledTimer(1);
    const container = document.createElement('div');
    ReactDOM.render(<Moment />, container);
    const expected = moment().toString();
    expect((container.firstChild as HTMLElement).innerHTML).toEqual(expected);
    ReactDOM.unmountComponentAtNode(container);
  });

  it('globals.locale', () => {
    Moment.globals.locale = 'fr';
    const date = render(
      <Moment format="D MMM YYYY" date="1976-04-19T12:59-0500" />
    );
    expect(html(date)).toEqual('19 avr. 1976');
  });

  it('locale prop overrides globals.locale', () => {
    Moment.globals.locale = 'fr';

    const date = render(
      <Moment format="D MMM YYYY" locale="en" date="1976-04-19T12:59-0500" />
    );

    expect(html(date)).toEqual('19 Apr 1976');

    Moment.globals.locale = null;
  });

  it('globals.timezone', () => {
    Moment.globals.timezone = 'America/Los_Angeles';
    const date = render(
      <Moment format="YYYY-MM-DD HH" date="1976-04-19T12:59-0500" />
    );
    expect(html(date)).toEqual('1976-04-19 09');
  });

  it('globals.local', () => {
    Moment.globals.local = true;
    const date = render(<Moment>{DATE_STRING}</Moment>);
    const expected = moment(DATE_STRING).local().toString();
    expect(html(date)).toEqual(expected);
  });

  it('globals.element', () => {
    Moment.globals.element = 'span';
    const date = render(
      <Moment parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(domOf(date).tagName).toEqual('SPAN');
  });

  it('globals.element overwrite', () => {
    Moment.globals.element = 'span';
    const date = render(
      <Moment element="div" parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(domOf(date).tagName).toEqual('DIV');
  });
});
