import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import moment from 'moment';
import 'moment-timezone';
import Moment, { MomentProvider } from '../src/index';

const DATE_STRING = '1976-04-19T12:59-0500';

const meta = {
  title: 'Moment/Showcase',
  component: Moment,
  decorators: [
    (Story) => (
      <MomentProvider>
        <Story />
      </MomentProvider>
    ),
  ],
} satisfies Meta<typeof Moment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CommentTimestamp: Story = {
  render: () => (
    <div className="moment-showcase moment-showcase-comment">
      <div className="moment-showcase-comment__avatar" aria-hidden />
      <div className="moment-showcase-comment__body">
        <div className="moment-showcase-comment__author">Alex Rivera</div>
        <p className="moment-showcase-comment__text">
          This refactor made relative timestamps much easier to drop into comment rows.
        </p>
        <Moment
          className="moment-showcase-comment__time"
          date={moment().subtract(45, 'minutes').format()}
          fromNow
        />
      </div>
    </div>
  ),
};

export const ArticlePublished: Story = {
  render: () => (
    <article className="moment-showcase">
      <h2 className="moment-showcase-article__title">Shipping a typed Moment provider</h2>
      <p className="moment-showcase-article__meta">
        Published{' '}
        <Moment
          date={DATE_STRING}
          format="MMMM D, YYYY"
          withTitle
          titleFormat="LLLL"
        />
      </p>
    </article>
  ),
};

export const EventCountdown: Story = {
  render: () => (
    <div className="moment-showcase">
      <p className="moment-showcase-event__label">Starts in</p>
      <h3 className="moment-showcase-event__title">Product launch livestream</h3>
      <Moment
        className="moment-showcase-event__countdown"
        date={moment().add(2, 'hours').add(15, 'minutes').format()}
        durationFromNow
        format="hh:mm:ss"
        trim
      />
    </div>
  ),
};
