import PropTypes from 'prop-types';

export const dateTypes = [
  PropTypes.string,
  PropTypes.number,
  PropTypes.array,
  PropTypes.object
];

export const parseTypes = [
  PropTypes.string,
  PropTypes.array
];

export const calendarTypes = [
  PropTypes.object,
  PropTypes.bool
];

export const trimTypes = [
  PropTypes.string,
  PropTypes.bool
];

export const momentPropKeys = {
  element:         true,
  date:            true,
  parse:           true,
  format:          true,
  add:             true,
  subtract:        true,
  ago:             true,
  fromNow:         true,
  fromNowShort:    true,
  fromNowDuring:   true,
  from:            true,
  toNow:           true,
  to:              true,
  calendar:        true,
  unix:            true,
  utc:             true,
  local:           true,
  tz:              true,
  withTitle:       true,
  titleFormat:     true,
  locale:          true,
  interval:        true,
  diff:            true,
  duration:        true,
  durationFromNow: true,
  trim:            true,
  unit:            true,
  decimal:         true,
  filter:          true,
  onChange:        true
};
