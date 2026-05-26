import React, { act } from 'react';
import moment from 'moment';
import { MomentProvider } from '../index';
import {
  enableReactActEnvironment,
  renderHookWithResult,
} from '../testHelpers';
import type { UseMomentContentResult } from './useMomentContent';
import { useMomentContent } from './useMomentContent';

const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';

type HookProps = Parameters<typeof useMomentContent>[0];

const renderHook = (
  props: HookProps,
  onResult: (result: UseMomentContentResult) => void,
  providerProps?: React.ComponentProps<typeof MomentProvider>
): { unmount: () => void } => renderHookWithResult({
  props,
  useHook: useMomentContent,
  onResult,
  wrapper: providerProps
    ? children => <MomentProvider {...providerProps}>{children}</MomentProvider>
    : undefined,
});

describe('useMomentContent', () => {
  const originalMomentNow = moment.now;

  beforeEach(() => {
    moment.now = originalMomentNow;
    enableReactActEnvironment();
  });

  afterEach(() => {
    moment.now = originalMomentNow;
    jest.useRealTimers();
  });

  it('formats a date string', () => {
    let result: UseMomentContentResult | undefined;

    renderHook({ date: DATE_STRING }, (value) => {
      result = value;
    });

    expect(result!.content).toEqual(DATE_OUTPUT);
    expect(result!.datetime.toString()).toEqual(DATE_OUTPUT);
    expect(result!.title).toBeUndefined();
  });

  it('formats with format prop', () => {
    let result: UseMomentContentResult | undefined;

    renderHook(
      { format: 'YYYY-MM-DD', date: DATE_STRING },
      (value) => {
        result = value;
      }
    );

    expect(result!.content).toEqual('1976-04-19');
  });

  it('returns the adjusted datetime used for content when add is set', () => {
    let result: UseMomentContentResult | undefined;

    renderHook(
      { add: { days: 1 }, format: 'YYYY-MM-DD', date: DATE_STRING },
      (value) => {
        result = value;
      }
    );

    expect(result!.content).toEqual('1976-04-20');
    expect(result!.datetime.toISOString()).toEqual(
      moment(DATE_STRING).add(1, 'day').toISOString()
    );
  });

  it('returns the adjusted datetime used for content when subtract is set', () => {
    let result: UseMomentContentResult | undefined;

    renderHook(
      { subtract: { days: 1 }, format: 'YYYY-MM-DD', date: DATE_STRING },
      (value) => {
        result = value;
      }
    );

    expect(result!.content).toEqual('1976-04-18');
    expect(result!.datetime.toISOString()).toEqual(
      moment(DATE_STRING).subtract(1, 'day').toISOString()
    );
  });

  it('includes title when withTitle is set', () => {
    let result: UseMomentContentResult | undefined;

    renderHook(
      {
        withTitle:   true,
        titleFormat: 'YYYY-MM-DD',
        date:        DATE_STRING
      },
      (value) => {
        result = value;
      }
    );

    expect(result!.title).toEqual('1976-04-19');
  });

  it('updates on interval tick', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const date = fixedNow.clone().subtract(5, 'minutes');
    let result: UseMomentContentResult | undefined;

    renderHook(
      { date, fromNow: true, interval: 1000 },
      (value) => {
        result = value;
      }
    );

    expect(result!.content).toEqual('5 minutes ago');

    act(() => {
      nowMs = fixedNow.clone().add(1, 'minute').valueOf();
      jest.advanceTimersByTime(1000);
    });

    expect(result!.content).toEqual('6 minutes ago');
  });

  it('registers with pooled timer', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const date = fixedNow.clone().subtract(5, 'minutes');
    let result: UseMomentContentResult | undefined;

    renderHook(
      { date, fromNow: true },
      (value) => {
        result = value;
      },
      { pool: true, interval: 1 }
    );

    expect(result!.content).toEqual('5 minutes ago');

    act(() => {
      nowMs = fixedNow.clone().add(1, 'minute').valueOf();
      jest.advanceTimersByTime(1);
    });

    expect(result!.content).toEqual('6 minutes ago');
  });

  it('calls onChange on mount and on each interval tick', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const onChange = jest.fn();
    const date = fixedNow.clone().subtract(5, 'minutes');

    renderHook(
      {
        date,
        fromNow:  true,
        interval: 1000,
        onChange
      },
      () => {}
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('5 minutes ago');

    act(() => {
      nowMs = fixedNow.clone().add(1, 'minute').valueOf();
      jest.advanceTimersByTime(1000);
    });

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith('6 minutes ago');
  });

  it('calls onChange on mount when interval is 0', () => {
    const onChange = jest.fn();

    renderHook(
      {
        date:     '2020-01-01T12:00:00',
        format:   'YYYY-MM-DD',
        interval: 0,
        onChange
      },
      () => {}
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('2020-01-01');
  });
});
