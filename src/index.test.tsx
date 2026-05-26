import React, { act } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Moment, { MomentProvider } from './index';
import {
  createTestRoot,
  elementHtml,
  enableReactActEnvironment,
  renderElement,
} from './testHelpers';

const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';
const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_DATE = new Date(DATE_STRING);
const DATE_UNIX = DATE_DATE.getTime() / 1000;

describe('react-moment', () => {
  beforeEach(() => {
    enableReactActEnvironment();
  });

  afterEach(() => {
    jest.useRealTimers();
    moment.now = () => Date.now();
  });

  it('children', () => {
    let date = renderElement(<Moment />);
    const expected = moment().toString();
    expect(elementHtml(date)).toEqual(expected);

    date = renderElement(<Moment>{DATE_STRING}</Moment>);
    expect(elementHtml(date)).toEqual(DATE_OUTPUT);

    date = renderElement(<Moment>{DATE_DATE}</Moment>);
    expect(elementHtml(date)).toEqual(DATE_OUTPUT);

    date = renderElement(<Moment unix>{DATE_UNIX}</Moment>);
    expect(elementHtml(date)).toEqual(DATE_OUTPUT);
  });

  it('element', () => {
    const date = renderElement(
      <Moment element="span" parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(date.tagName).toEqual('SPAN');
  });

  it('date', () => {
    let date = renderElement(<Moment />);
    const expected = moment().toString();
    expect(elementHtml(date)).toEqual(expected);

    date = renderElement(<Moment date={DATE_STRING} />);
    expect(elementHtml(date)).toEqual(DATE_OUTPUT);

    date = renderElement(<Moment date={DATE_DATE} />);
    expect(elementHtml(date)).toEqual(DATE_OUTPUT);
  });

  it('renders adjusted ISO datetime attribute', () => {
    const date = renderElement(
      <Moment add={{ days: 1 }} format="YYYY-MM-DD" date={DATE_STRING} />
    );

    expect(elementHtml(date)).toEqual('1976-04-20');
    expect(date.getAttribute('datetime'))
      .toEqual(moment(DATE_STRING).add(1, 'day').toISOString());
  });

  it('renders ISO datetime attribute for formatted output', () => {
    const date = renderElement(
      <Moment format="YYYY-MM-DD" date={DATE_STRING} />
    );

    expect(elementHtml(date)).toEqual('1976-04-19');
    expect(date.getAttribute('datetime'))
      .toEqual(moment(DATE_STRING).toISOString());
  });

  it('falls back to time element when element is null', () => {
    const date = renderElement(<Moment element={null} date={DATE_STRING} />);

    expect(date.tagName).toEqual('TIME');
    expect(elementHtml(date)).toEqual(DATE_OUTPUT);
  });

  it('falls back to time element when provider element is null', () => {
    const date = renderElement(
      <MomentProvider element={null}>
        <Moment date={DATE_STRING} />
      </MomentProvider>
    );

    expect(date.tagName).toEqual('TIME');
    expect(elementHtml(date)).toEqual(DATE_OUTPUT);
  });

  it('parse', () => {
    const date = renderElement(
      <Moment parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(elementHtml(date)).toEqual(DATE_OUTPUT);
  });

  it('unix', () => {
    const date = renderElement(<Moment unix>{DATE_UNIX}</Moment>);
    expect(elementHtml(date)).toEqual(DATE_OUTPUT);
  });

  it('utc', () => {
    const date = renderElement(<Moment utc>1976-04-19T12:59</Moment>);
    expect(elementHtml(date)).toEqual('Mon Apr 19 1976 12:59:00 GMT+0000');
  });

  it('local', () => {
    const date = renderElement(<Moment local>{DATE_STRING}</Moment>);
    const expected = moment(DATE_STRING).local().toString();
    expect(elementHtml(date)).toEqual(expected);
  });

  it('utc and local', () => {
    const date = renderElement(<Moment utc local>{DATE_STRING}</Moment>);
    const expected = moment.utc(DATE_STRING).local().toString();
    expect(elementHtml(date)).toEqual(expected);
  });

  it('tz', () => {
    const date = renderElement(<Moment unix tz="America/Los_Angeles">{DATE_UNIX}</Moment>);
    expect(elementHtml(date)).toEqual('Mon Apr 19 1976 09:59:00 GMT-0800');
  });

  it('other', () => {
    const date = renderElement(<Moment className="testing" aria-hidden>{DATE_STRING}</Moment>);
    expect(date.getAttribute('class')).toEqual('testing');
    expect(date.getAttribute('aria-hidden')).toEqual('true');
  });

  it('renders fallback and omits datetime for invalid input', () => {
    const date = renderElement(<Moment fallback="N/A">not-a-date</Moment>);

    expect(elementHtml(date)).toEqual('N/A');
    expect(date.getAttribute('datetime')).toBeNull();
  });

  it('uses format for title when titleFormat is omitted', () => {
    const date = renderElement(
      <Moment format="D MMM YYYY" withTitle>{DATE_STRING}</Moment>
    );

    expect(date.getAttribute('title')).toEqual('19 Apr 1976');
  });

  it('updates content when props are updated', () => {
    type ContainerState = { children: string };

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    class PropChangeContainer extends React.Component<{}, ContainerState> {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      constructor(props: {}) {
        super(props);
        this.state = { children: DATE_STRING };
      }

      render() {
        return <Moment>{this.state.children}</Moment>;
      }
    }

    const ref = React.createRef<PropChangeContainer>();
    const testRoot = createTestRoot();
    testRoot.render(<PropChangeContainer ref={ref} />);

    expect(testRoot.firstChild().innerHTML).toEqual(DATE_OUTPUT);

    const NEW_DATE_STRING = '1976-04-20T12:59-0500';
    const NEW_DATE_OUTPUT = 'Tue Apr 20 1976 12:59:00 GMT-0500';

    act(() => {
      ref.current!.setState({ children: NEW_DATE_STRING });
    });
    expect(testRoot.firstChild().innerHTML).toEqual(NEW_DATE_OUTPUT);
  });

  it('pooled timer updates content on interval ticks', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const date = fixedNow.clone().subtract(5, 'minutes');
    const testRoot = createTestRoot();

    testRoot.render(
      <MomentProvider pool interval={1000}>
        <Moment date={date} fromNow />
      </MomentProvider>
    );

    expect(testRoot.firstChild().innerHTML).toEqual('5 minutes ago');

    act(() => {
      nowMs = fixedNow.clone().add(1, 'minute').valueOf();
      jest.advanceTimersByTime(1000);
    });

    expect(testRoot.firstChild().innerHTML).toEqual('6 minutes ago');

    testRoot.unmount();

    moment.now = () => Date.now();
    jest.useRealTimers();
  });

  it('provider locale', () => {
    const date = renderElement(
      <MomentProvider locale="fr">
        <Moment format="D MMM YYYY" date="1976-04-19T12:59-0500" />
      </MomentProvider>
    );
    expect(elementHtml(date)).toEqual('19 avr. 1976');
  });

  it('locale prop overrides provider locale', () => {
    const date = renderElement(
      <MomentProvider locale="fr">
        <Moment format="D MMM YYYY" locale="en" date="1976-04-19T12:59-0500" />
      </MomentProvider>
    );

    expect(elementHtml(date)).toEqual('19 Apr 1976');
  });

  it('provider timezone', () => {
    const date = renderElement(
      <MomentProvider timezone="America/Los_Angeles">
        <Moment format="YYYY-MM-DD HH" date="1976-04-19T12:59-0500" />
      </MomentProvider>
    );
    expect(elementHtml(date)).toEqual('1976-04-19 09');
  });

  it('provider local', () => {
    const date = renderElement(
      <MomentProvider local>
        <Moment>{DATE_STRING}</Moment>
      </MomentProvider>
    );
    const expected = moment(DATE_STRING).local().toString();
    expect(elementHtml(date)).toEqual(expected);
  });

  it('provider element', () => {
    const date = renderElement(
      <MomentProvider element="span">
        <Moment parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
      </MomentProvider>
    );
    expect(date.tagName).toEqual('SPAN');
  });

  it('provider element overwrite', () => {
    const date = renderElement(
      <MomentProvider element="span">
        <Moment element="div" parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
      </MomentProvider>
    );
    expect(date.tagName).toEqual('DIV');
  });
});
