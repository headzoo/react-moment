import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import Moment from '../src/index';

const dateToFormat = '1976-04-19T12:59-0500';

storiesOf('Moment', module)
  .addDecorator(withKnobs)
  .addWithJSX('standard', () => {
      return (
        <Moment date={text('date', dateToFormat)} />
      )
    }
  )
  .addWithJSX('formatting', () => {
    return (
      <Moment format="YYYY/MM/DD" date={text('date', dateToFormat)} />
    )
  })
  .addWithJSX('fromNow', () => {
    return (
      <Moment fromNow date={text('date', dateToFormat)} />
    )
  })
  .addWithJSX('unix', () => {
    return (
      <Moment unix date={number('unix time', 198784740)} />
    )
  })
;
