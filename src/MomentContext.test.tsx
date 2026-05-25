import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import moment from 'moment';
import Moment, { MomentProvider } from './index';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('MomentProvider', () => {
  beforeEach(() => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
      .IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderInto = (element: React.ReactElement): HTMLElement => {
    const container = document.createElement('div');
    const root: Root = createRoot(container);
    act(() => {
      root.render(element);
    });
    return container.firstChild as HTMLElement;
  };

  it('applies provider settings to descendant Moment instances', () => {
    const node = renderInto(
      <MomentProvider locale="fr">
        <Moment format="D MMM YYYY" date={DATE_STRING} />
      </MomentProvider>
    );
    expect(node.innerHTML).toEqual('19 avr. 1976');
  });

  it('allows per-instance props to override provider settings', () => {
    const node = renderInto(
      <MomentProvider locale="fr">
        <Moment format="D MMM YYYY" locale="en" date={DATE_STRING} />
      </MomentProvider>
    );
    expect(node.innerHTML).toEqual('19 Apr 1976');
  });

  it('composes nested providers with inner overrides', () => {
    const node = renderInto(
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
    const container = document.createElement('div');
    const root: Root = createRoot(container);

    act(() => {
      root.render(
        <MomentProvider pool interval={1000}>
          <Moment date={date} fromNow />
        </MomentProvider>
      );
    });

    expect((container.firstChild as HTMLElement).innerHTML).toEqual('5 minutes ago');

    act(() => {
      nowMs = fixedNow.clone().add(1, 'minute').valueOf();
      jest.advanceTimersByTime(1000);
    });

    expect((container.firstChild as HTMLElement).innerHTML).toEqual('6 minutes ago');

    moment.now = () => Date.now();
  });

  it('skips pooled updates when interval is 0', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const date = fixedNow.clone().subtract(5, 'minutes');
    const container = document.createElement('div');
    const root: Root = createRoot(container);

    act(() => {
      root.render(
        <MomentProvider pool interval={1000}>
          <Moment date={date} fromNow interval={0} />
        </MomentProvider>
      );
    });

    expect((container.firstChild as HTMLElement).innerHTML).toEqual('5 minutes ago');

    act(() => {
      nowMs = fixedNow.clone().add(1, 'minute').valueOf();
      jest.advanceTimersByTime(1000);
    });

    expect((container.firstChild as HTMLElement).innerHTML).toEqual('5 minutes ago');

    moment.now = () => Date.now();
  });

  it('maintains independent pools for sibling providers', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const dateA = fixedNow.clone().subtract(5, 'minutes');
    const dateB = fixedNow.clone().subtract(10, 'minutes');
    const container = document.createElement('div');
    const root: Root = createRoot(container);

    act(() => {
      root.render(
        <>
          <MomentProvider pool interval={1000}>
            <Moment date={dateA} fromNow />
          </MomentProvider>
          <MomentProvider pool interval={1000}>
            <Moment date={dateB} fromNow />
          </MomentProvider>
        </>
      );
    });

    const nodes = container.querySelectorAll('time');
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
