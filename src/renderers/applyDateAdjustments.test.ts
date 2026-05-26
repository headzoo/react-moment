import moment from 'moment';
import { applyDateAdjustments } from './applyDateAdjustments';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('applyDateAdjustments', () => {
  it('returns the same instance when add and subtract are omitted', () => {
    const datetime = moment(DATE_STRING);
    const result = applyDateAdjustments({}, datetime);
    expect(result).toBe(datetime);
    expect(result.format('YYYY-MM-DD')).toEqual('1976-04-19');
  });

  it('adds to the datetime without mutating the input', () => {
    const datetime = moment(DATE_STRING);
    const result = applyDateAdjustments({ add: { days: 1 } }, datetime);
    expect(result.format('YYYY-MM-DD')).toEqual('1976-04-20');
    expect(datetime.format('YYYY-MM-DD')).toEqual('1976-04-19');
  });

  it('subtracts from the datetime without mutating the input', () => {
    const datetime = moment(DATE_STRING);
    const result = applyDateAdjustments({ subtract: { days: 1 } }, datetime);
    expect(result.format('YYYY-MM-DD')).toEqual('1976-04-18');
    expect(datetime.format('YYYY-MM-DD')).toEqual('1976-04-19');
  });

  it('applies add before subtract when both are set', () => {
    const datetime = moment(DATE_STRING);
    const result = applyDateAdjustments(
      { add: { days: 2 }, subtract: { days: 1 } },
      datetime
    );
    expect(result.format('YYYY-MM-DD')).toEqual('1976-04-20');
    expect(datetime.format('YYYY-MM-DD')).toEqual('1976-04-19');
  });
});
