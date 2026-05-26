import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import moment from 'moment';
import { MomentProvider } from '../index';
import type { UseMomentContentResult } from './useMomentContent';
import { useMomentContent } from './useMomentContent';

const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';

type HookProps = Parameters<typeof useMomentContent>[0];

const renderHook = (
  props: HookProps,
  onResult: (result: UseMomentContentResult) => void,
  providerProps?: React.ComponentProps<typeof MomentProvider>
): { unmount: () => void } => {
  const container = document.createElement('div');
  const root: Root = createRoot(container);

  const HookHost = ({ hookProps }: { hookProps: HookProps }) => {
    const result = useMomentContent(hookProps);
    onResult(result);
    return null;
  };

  const content = <HookHost hookProps={props} />;
  const tree = providerProps
    ? <MomentProvider {...providerProps}>{content}</MomentProvider>
    : content;

  act(() => {
    root.render(tree);
  });

  return {
    unmount: () => {
      act(() => {
        root.unmount();
      });
    }
  };
};

describe('useMomentContent', () => {
  const originalMomentNow = moment.now;

  beforeEach(() => {
    moment.now = originalMomentNow;
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
      .IS_REACT_ACT_ENVIRONMENT = true;
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

  it('includes title when withTitle is set', () => {
    let result: UseMomentContentResult | undefined;

    renderHook(
      {
        withTitle: true,
        titleFormat: 'YYYY-MM-DD',
        date: DATE_STRING
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

  it('calls onChange on interval tick but not on first render', () => {
    const fixedNow = moment('2020-01-01T12:00:00');
    let nowMs = fixedNow.valueOf();
    moment.now = () => nowMs;
    jest.useFakeTimers();

    const onChange = jest.fn();
    const date = fixedNow.clone().subtract(5, 'minutes');

    renderHook(
      {
        date,
        fromNow: true,
        interval: 1000,
        onChange
      },
      () => {}
    );

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      nowMs = fixedNow.clone().add(1, 'minute').valueOf();
      jest.advanceTimersByTime(1000);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('6 minutes ago');
  });
});
