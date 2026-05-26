import React from 'react';

const SKIP_META_KEYS = new Set(['onChange', 'filter', 'filters', 'renderers']);

const NUMERIC_PROPS = new Set(['diff', 'duration', 'durationFromNow', 'decimal', 'unit']);

function formatArgValue(value: unknown): string {
  if (value === true) {
    return 'true';
  }
  if (value === false || value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function buildMetaLine(args?: Record<string, unknown>): string {
  if (!args) {
    return '';
  }

  return Object.entries(args)
    .filter(([key, value]) => {
      if (SKIP_META_KEYS.has(key)) {
        return false;
      }
      if (typeof value === 'function') {
        return false;
      }
      return formatArgValue(value) !== '';
    })
    .map(([key, value]) => `${key}="${formatArgValue(value)}"`)
    .join(' · ');
}

function isNumericOutput(args?: Record<string, unknown>): boolean {
  if (!args) {
    return false;
  }

  return Object.keys(args).some((key) => {
    if (!NUMERIC_PROPS.has(key)) {
      return false;
    }
    const value = args[key];
    return value !== undefined && value !== false && value !== null;
  });
}

export interface StoryFrameProps {
  title: string;
  args?: Record<string, unknown>;
  children: React.ReactNode;
}

export function StoryFrame({ title, args, children }: StoryFrameProps) {
  const meta = buildMetaLine(args);
  const numeric = isNumericOutput(args);

  return (
    <div className="moment-story">
      <span className="moment-story__badge">{title}</span>
      <div className={`moment-story__output${numeric ? ' moment-story__output--numeric' : ''}`}>
        {children}
      </div>
      {meta ? <div className="moment-story__meta">{meta}</div> : null}
    </div>
  );
}
