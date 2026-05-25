import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment-timezone';
import Moment from './index';

const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';
const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_DATE = new Date(DATE_STRING);
const DATE_UNIX = DATE_DATE.getTime() / 1000;

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
    Moment.settings = {
      moment: null,
      locale: null,
      local: null,
      format: null,
      parse: null,
      filter: null,
      filters: null,
      renderers: null,
      element: 'time',
      timezone: null
    };
    Moment.pooledElements = [];
    Moment.pooledTimer = null;
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

  it('settings.locale', () => {
    Moment.settings.locale = 'fr';
    const date = render(
      <Moment format="D MMM YYYY" date="1976-04-19T12:59-0500" />
    );
    expect(html(date)).toEqual('19 avr. 1976');
  });

  it('locale prop overrides settings.locale', () => {
    Moment.settings.locale = 'fr';

    const date = render(
      <Moment format="D MMM YYYY" locale="en" date="1976-04-19T12:59-0500" />
    );

    expect(html(date)).toEqual('19 Apr 1976');

    Moment.settings.locale = null;
  });

  it('settings.timezone', () => {
    Moment.settings.timezone = 'America/Los_Angeles';
    const date = render(
      <Moment format="YYYY-MM-DD HH" date="1976-04-19T12:59-0500" />
    );
    expect(html(date)).toEqual('1976-04-19 09');
  });

  it('settings.local', () => {
    Moment.settings.local = true;
    const date = render(<Moment>{DATE_STRING}</Moment>);
    const expected = moment(DATE_STRING).local().toString();
    expect(html(date)).toEqual(expected);
  });

  it('settings.element', () => {
    Moment.settings.element = 'span';
    const date = render(
      <Moment parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(domOf(date).tagName).toEqual('SPAN');
  });

  it('settings.element overwrite', () => {
    Moment.settings.element = 'span';
    const date = render(
      <Moment element="div" parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    );
    expect(domOf(date).tagName).toEqual('DIV');
  });
});
