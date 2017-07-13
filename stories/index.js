import React from 'react';
import { setAddon, storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import Moment from '../src/index';

const dateToFormat = '1976-04-19T12:59-0500';

storiesOf('Moment', module)
  .addDecorator(withKnobs)
  .addWithJSX('with default props', () => {
      return (
        <Moment date={text('date', dateToFormat)} />
      )
    }
  )
  .addWithJSX('using the format prop', () => {
    return (
      <Moment format="D MMM YYYY" date={text('date', dateToFormat)} />
    )
  })
  .addWithJSX('using the fromNow prop', () => {
    return (
      <Moment fromNow date={text('date', dateToFormat)} />
    )
  })
  .addWithJSX('using the unix prop', () => {
    return (
      <Moment unix date={number('unix time', 198784740)} />
    )
  })
;
