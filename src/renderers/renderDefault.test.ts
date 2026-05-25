import moment from 'moment';
import type { ContentContext } from './types';
import { renderDefault } from './renderDefault';

const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';

describe('renderDefault', () => {
  it('returns datetime.toString()', () => {
    const datetime = moment(DATE_STRING);
    const ctx = { props: {}, datetime, format: undefined, fromNowPeriod: false } as ContentContext;

    expect(renderDefault(ctx)).toEqual(DATE_OUTPUT);
  });
});
