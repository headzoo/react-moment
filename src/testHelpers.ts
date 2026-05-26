import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import type { MomentSettings } from './types';
import { defaultSettings } from './MomentContext';

/**
 * Returns a fresh copy of default settings for tests.
 */
export function makeSettings(overrides: Partial<MomentSettings> = {}): MomentSettings {
  return { ...defaultSettings, ...overrides };
}

/**
 * Enables React act() warnings in tests (React 18+).
 */
export function enableReactActEnvironment(): void {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
    .IS_REACT_ACT_ENVIRONMENT = true;
}

/**
 * Renders an element and returns its root DOM node (first child).
 */
export function renderElement(element: React.ReactElement): HTMLElement {
  const container = document.createElement('div');
  const root = createRoot(container);
  act(() => {
    root.render(element);
  });
  return container.firstChild as HTMLElement;
}

/**
 * Returns the innerHTML of a rendered element.
 */
export function elementHtml(node: HTMLElement): string {
  return node.innerHTML ?? '';
}

export interface TestRoot {
  container: HTMLDivElement;
  render: (element: React.ReactElement) => void;
  unmount: () => void;
  firstChild: () => HTMLElement;
  querySelectorAll: <E extends Element = Element>(selector: string) => NodeListOf<E>;
}

/**
 * Creates a persistent React root for tests that re-render, advance timers, or unmount.
 */
export function createTestRoot(): TestRoot {
  const container = document.createElement('div');
  const root = createRoot(container);

  return {
    container,
    render: (element) => {
      act(() => {
        root.render(element);
      });
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
    },
    firstChild:       () => container.firstChild as HTMLElement,
    querySelectorAll: selector => container.querySelectorAll(selector),
  };
}

export interface RenderHookOptions<TProps, TResult> {
  props: TProps;
  useHook: (props: TProps) => TResult;
  onResult: (result: TResult) => void;
  wrapper?: (children: React.ReactElement) => React.ReactElement;
}

/**
 * Renders a hook in a host component and reports results via onResult.
 */
export function renderHookWithResult<TProps, TResult>(
  options: RenderHookOptions<TProps, TResult>
): { unmount: () => void } {
  const { props, useHook, onResult, wrapper } = options;
  const testRoot = createTestRoot();

  function HookHost({ hookProps }: { hookProps: TProps }) {
    const result = useHook(hookProps);
    onResult(result);
    return null;
  }

  const content = React.createElement(HookHost, { hookProps: props });
  const tree = wrapper
    ? wrapper(content as React.ReactElement)
    : (content as React.ReactElement);

  testRoot.render(tree);

  return {
    unmount: () => {
      testRoot.unmount();
    },
  };
}
