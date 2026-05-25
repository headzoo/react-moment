import Moment from '../index';
import { applyContentFilter } from './applyContentFilter';

describe('applyContentFilter', () => {
  beforeEach(() => {
    Moment.globals = {
      moment: null,
      locale: null,
      local: null,
      format: null,
      parse: null,
      filter: null,
      element: 'time',
      timezone: null
    };
  });

  it('returns content unchanged when no filter is configured', () => {
    expect(applyContentFilter({}, 'hello')).toEqual('hello');
  });

  it('applies props.filter', () => {
    const filter = (value: unknown) => (value as string).toUpperCase();
    expect(applyContentFilter({ filter }, 'hello')).toEqual('HELLO');
  });

  it('applies globals.filter when props.filter is omitted', () => {
    const filter = (value: unknown) => (value as string).toUpperCase();
    Moment.globals.filter = filter;
    expect(applyContentFilter({}, 'hello')).toEqual('HELLO');
  });

  it('prefers globals.filter over props.filter', () => {
    Moment.globals.filter = (value: unknown) => (value as string).toUpperCase();
    const filter = (value: unknown) => (value as string).toLowerCase();
    expect(applyContentFilter({ filter }, 'Hello')).toEqual('HELLO');
  });
});
