import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import moment from 'moment';
import 'moment-timezone';
import Moment, { MomentProvider } from '../src/index';
import { StoryFrame } from './StoryFrame';

const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_UNIX = new Date(DATE_STRING).getTime() / 1000;
const RECENT = () => moment().subtract(1, 'hour');

const meta = {
  title: 'Moment',
  component: Moment,
  tags: ['autodocs'],
  decorators: [
    (Story, { name, args }) => (
      <MomentProvider>
        <StoryFrame title={name} args={args}>
          <Story />
        </StoryFrame>
      </MomentProvider>
    ),
  ],
  argTypes: {
    children: { control: 'text' },
    date: { control: 'text' },
    parse: { control: 'text' },
    format: { control: 'text' },
    add: { control: 'object' },
    subtract: { control: 'object' },
    ago: { control: 'boolean' },
    fromNow: { control: 'boolean' },
    fromNowShort: { control: 'boolean' },
    fromNowDuring: { control: 'number' },
    from: { control: 'text' },
    toNow: { control: 'boolean' },
    to: { control: 'text' },
    calendar: { control: 'boolean' },
    unix: { control: 'boolean' },
    utc: { control: 'boolean' },
    local: { control: 'boolean' },
    tz: { control: 'text' },
    locale: { control: 'text' },
    withTitle: { control: 'boolean' },
    titleFormat: { control: 'text' },
    interval: { control: 'number' },
    diff: { control: 'text' },
    duration: { control: 'text' },
    durationFromNow: { control: 'boolean' },
    trim: { control: 'boolean' },
    unit: { control: 'text' },
    decimal: { control: 'boolean' },
    filter: { control: false },
    filters: { control: false },
    renderers: { control: false },
    onChange: { control: false },
    element: { control: 'text' },
  },
} satisfies Meta<typeof Moment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Children: Story = {
  name: 'children',
  args: { children: DATE_STRING },
};

export const DateProp: Story = {
  name: 'date',
  args: { date: DATE_STRING },
};

export const Parse: Story = {
  name: 'parse',
  args: { parse: 'YYYY-MM-DD HH:mm', children: '1976-04-19 12:59' },
};

export const Unix: Story = {
  name: 'unix',
  args: { unix: true, date: DATE_UNIX },
};

export const Utc: Story = {
  name: 'utc',
  args: { utc: true, children: '1976-04-19T12:59' },
};

export const Local: Story = {
  name: 'local',
  args: { local: true, date: DATE_STRING },
};

export const Tz: Story = {
  name: 'tz',
  args: { tz: 'America/Los_Angeles', unix: true, date: DATE_UNIX },
};

export const Locale: Story = {
  name: 'locale',
  args: { locale: 'fr', format: 'D MMM YYYY', date: DATE_STRING },
};

export const Format: Story = {
  name: 'format',
  args: { format: 'D MMM YYYY', date: DATE_STRING },
};

export const Filter: Story = {
  name: 'filter',
  args: {
    filter: (content) => String(content).toUpperCase(),
    date: DATE_STRING,
  },
};

export const Filters: Story = {
  name: 'filters',
  args: {
    filters: [(content) => `[${content}]`],
    date: DATE_STRING,
  },
};

export const Renderers: Story = {
  name: 'renderers',
  args: {
    renderers: [() => 'custom'],
    date: DATE_STRING,
  },
};

export const FromNow: Story = {
  name: 'fromNow',
  args: { fromNow: true, date: RECENT().format() },
};

export const FromNowShort: Story = {
  name: 'fromNowShort',
  args: { fromNowShort: true, date: RECENT().format() },
};

export const FromNowDuring: Story = {
  name: 'fromNowDuring',
  args: {
    fromNow: true,
    fromNowDuring: 3600000,
    format: 'LLL',
    date: RECENT().format(),
  },
};

export const Ago: Story = {
  name: 'ago',
  args: { fromNow: true, ago: true, date: RECENT().format() },
};

export const From: Story = {
  name: 'from',
  args: { from: '2016-09-20T12:00', date: DATE_STRING },
};

export const ToNow: Story = {
  name: 'toNow',
  args: { toNow: true, date: DATE_STRING },
};

export const To: Story = {
  name: 'to',
  args: { to: '2016-09-20T12:00', date: DATE_STRING },
};

export const Calendar: Story = {
  name: 'calendar',
  args: { calendar: true, date: DATE_STRING },
};

export const Add: Story = {
  name: 'add',
  args: { add: { days: 1 }, fromNow: true, date: new Date().toISOString() },
};

export const Subtract: Story = {
  name: 'subtract',
  args: { subtract: { days: 1 }, fromNow: true, date: new Date().toISOString() },
};

export const Diff: Story = {
  name: 'diff',
  args: { diff: '2016-09-20T12:00', date: DATE_STRING },
};

export const Unit: Story = {
  name: 'unit',
  args: { diff: '2016-09-20T12:00', unit: 'days', date: DATE_STRING },
};

export const Decimal: Story = {
  name: 'decimal',
  args: {
    diff: '2016-09-20T12:00',
    unit: 'years',
    decimal: true,
    date: DATE_STRING,
  },
};

export const Duration: Story = {
  name: 'duration',
  args: {
    duration: moment().subtract(2, 'hours').format(),
    date: DATE_STRING,
  },
};

export const DurationFromNow: Story = {
  name: 'durationFromNow',
  args: {
    durationFromNow: true,
    format: 'hh:mm:ss',
    trim: true,
    date: moment().subtract(4, 'minutes').format(),
  },
};

export const Trim: Story = {
  name: 'trim',
  args: {
    durationFromNow: true,
    trim: ' largest ',
    date: moment().subtract(2, 'hours').format(),
  },
};

export const Element: Story = {
  name: 'element',
  args: { element: 'span', date: DATE_STRING },
};

export const WithTitle: Story = {
  name: 'withTitle',
  args: { withTitle: true, date: DATE_STRING },
};

export const TitleFormat: Story = {
  name: 'titleFormat',
  args: { withTitle: true, titleFormat: 'LLLL', date: DATE_STRING },
};

export const Interval: Story = {
  name: 'interval',
  args: { interval: 5000, fromNow: true, date: new Date().toISOString() },
};

export const OnChange: Story = {
  name: 'onChange',
  args: { onChange: fn(), fromNow: true, date: new Date().toISOString() },
};
