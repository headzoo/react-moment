import React, { act } from 'react';
import moment from 'moment';
import Moment, { MomentProvider } from './index';
import {
  createTestRoot,
  enableReactActEnvironment,
  renderElement,
} from './testHelpers';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('MomentProvider', () => {
  beforeEach(() => {
    enableReactActEnvironment();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('applies provider settings to descendant Moment instances', () => {
    const node = renderElement(
      <MomentProvider locale="fr">
        <Moment format="D MMM YYYY" date={DATE_STRING} />
      </MomentProvider>
    );
    expect(node.innerHTML).toEqual('19 avr. 1976');
  });

  it('allows per-instance props to override provider settings', () => {
    const node = renderElement(
      <MomentProvider locale="fr">
        <Moment format="D MMM YYYY" locale="en" date={DATE_STRING} />
      </MomentProvider>
    );
    expect(node.innerHTML).toEqual('19 Apr 1976');
  });

  it('composes nested providers with inner overrides', () => {
    const node = renderElement(
      <MomentProvider locale="fr" element="span">
        <MomentProvider locale="en">
          <Moment format="D MMM YYYY" date={DATE_STRING} />
        </MomentProvider>
      </MomentProvider>
    );
    expect(node.innerHTML).toEqual('19 Apr 1976');
    expect(node.tagName).toEqual('SPAN');
  });

  it('pooled provider updates descendants on a shared interval', () => {
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

    moment.now = () => Date.now();
  });

  it('skips pooled updates when interval is 0', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const date = fixedNow.clone().subtract(5, 'minutes');
    const testRoot = createTestRoot();

    testRoot.render(
      <MomentProvider pool interval={1000}>
        <Moment date={date} fromNow interval={0} />
      </MomentProvider>
    );

    expect(testRoot.firstChild().innerHTML).toEqual('5 minutes ago');

    act(() => {
      nowMs = fixedNow.clone().add(1, 'minute').valueOf();
      jest.advanceTimersByTime(1000);
    });

    expect(testRoot.firstChild().innerHTML).toEqual('5 minutes ago');

    moment.now = () => Date.now();
  });

  it('honors per-instance interval under pooled timing', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const dateFast = fixedNow.clone().subtract(5, 'minutes');
    const dateSlow = fixedNow.clone().subtract(10, 'minutes');
    const dateFrozen = fixedNow.clone().subtract(15, 'minutes');
    const testRoot = createTestRoot();

    testRoot.render(
      <MomentProvider pool interval={1000}>
        <Moment date={dateFast} fromNow />
        <Moment date={dateSlow} fromNow interval={2000} />
        <Moment date={dateFrozen} fromNow interval={0} />
      </MomentProvider>
    );

    const nodes = testRoot.querySelectorAll('time');
    expect(nodes[0].innerHTML).toEqual('5 minutes ago');
    expect(nodes[1].innerHTML).toEqual('10 minutes ago');
    expect(nodes[2].innerHTML).toEqual('15 minutes ago');

    act(() => {
      nowMs += 60 * 1000;
      jest.advanceTimersByTime(1000);
    });

    expect(nodes[0].innerHTML).toEqual('6 minutes ago');
    expect(nodes[1].innerHTML).toEqual('10 minutes ago');
    expect(nodes[2].innerHTML).toEqual('15 minutes ago');

    act(() => {
      nowMs += 60 * 1000;
      jest.advanceTimersByTime(1000);
    });

    expect(nodes[0].innerHTML).toEqual('7 minutes ago');
    expect(nodes[1].innerHTML).toEqual('12 minutes ago');
    expect(nodes[2].innerHTML).toEqual('15 minutes ago');

    act(() => {
      nowMs += 60 * 1000;
      jest.advanceTimersByTime(1000);
    });

    expect(nodes[0].innerHTML).toEqual('8 minutes ago');
    expect(nodes[1].innerHTML).toEqual('12 minutes ago');
    expect(nodes[2].innerHTML).toEqual('15 minutes ago');

    moment.now = () => Date.now();
  });

  it('honors updated per-instance interval under pooled timing', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const date = fixedNow.clone().subtract(5, 'minutes');
    const testRoot = createTestRoot();

    function App({ interval }: { interval: number }) {
      return (
        <MomentProvider pool interval={500}>
          <Moment date={date} fromNow interval={interval} />
        </MomentProvider>
      );
    }

    testRoot.render(<App interval={2000} />);

    expect(testRoot.firstChild().innerHTML).toEqual('5 minutes ago');

    act(() => {
      nowMs = fixedNow.clone().add(1, 'minute').valueOf();
      jest.advanceTimersByTime(500);
    });

    expect(testRoot.firstChild().innerHTML).toEqual('5 minutes ago');

    testRoot.render(<App interval={500} />);

    act(() => {
      nowMs = fixedNow.clone().add(2, 'minutes').valueOf();
      jest.advanceTimersByTime(500);
    });

    expect(testRoot.firstChild().innerHTML).toEqual('7 minutes ago');

    moment.now = () => Date.now();
  });

  it('keeps pooled updates working when provider interval changes', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const date = fixedNow.clone().subtract(5, 'minutes');
    const testRoot = createTestRoot();

    function App({ poolInterval }: { poolInterval: number }) {
      return (
        <MomentProvider pool interval={poolInterval}>
          <Moment date={date} fromNow />
        </MomentProvider>
      );
    }

    testRoot.render(<App poolInterval={1000} />);

    expect(testRoot.firstChild().innerHTML).toEqual('5 minutes ago');

    act(() => {
      nowMs = fixedNow.clone().add(1, 'minute').valueOf();
      jest.advanceTimersByTime(1000);
    });

    expect(testRoot.firstChild().innerHTML).toEqual('6 minutes ago');

    testRoot.render(<App poolInterval={500} />);

    act(() => {
      nowMs = fixedNow.clone().add(2, 'minutes').valueOf();
      jest.advanceTimersByTime(500);
    });

    expect(testRoot.firstChild().innerHTML).toEqual('7 minutes ago');

    moment.now = () => Date.now();
  });

  it('maintains independent pools for sibling providers', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const dateA = fixedNow.clone().subtract(5, 'minutes');
    const dateB = fixedNow.clone().subtract(10, 'minutes');
    const testRoot = createTestRoot();

    testRoot.render(
      <>
        <MomentProvider pool interval={1000}>
          <Moment date={dateA} fromNow />
        </MomentProvider>
        <MomentProvider pool interval={1000}>
          <Moment date={dateB} fromNow />
        </MomentProvider>
      </>
    );

    const nodes = testRoot.querySelectorAll('time');
    expect(nodes[0].innerHTML).toEqual('5 minutes ago');
    expect(nodes[1].innerHTML).toEqual('10 minutes ago');

    act(() => {
      nowMs = fixedNow.clone().add(1, 'minute').valueOf();
      jest.advanceTimersByTime(1000);
    });

    expect(nodes[0].innerHTML).toEqual('6 minutes ago');
    expect(nodes[1].innerHTML).toEqual('11 minutes ago');

    moment.now = () => Date.now();
  });
});
