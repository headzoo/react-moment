import moment from 'moment';
import { applyDateAdjustments } from './applyDateAdjustments';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('applyDateAdjustments', () => {
  it('does nothing when add and subtract are omitted', () => {
    const datetime = moment(DATE_STRING);
    applyDateAdjustments({}, datetime);
    expect(datetime.format('YYYY-MM-DD')).toEqual('1976-04-19');
  });

  it('adds to the datetime', () => {
    const datetime = moment(DATE_STRING);
    applyDateAdjustments({ add: { days: 1 } }, datetime);
    expect(datetime.format('YYYY-MM-DD')).toEqual('1976-04-20');
  });

  it('subtracts from the datetime', () => {
    const datetime = moment(DATE_STRING);
    applyDateAdjustments({ subtract: { days: 1 } }, datetime);
    expect(datetime.format('YYYY-MM-DD')).toEqual('1976-04-18');
  });

  it('applies add before subtract when both are set', () => {
    const datetime = moment(DATE_STRING);
    applyDateAdjustments({ add: { days: 2 }, subtract: { days: 1 } }, datetime);
    expect(datetime.format('YYYY-MM-DD')).toEqual('1976-04-20');
  });
});
