import Moment from '../index';
import type { Filter, MomentContent } from '../types';
import { applyContentFilter } from './applyContentFilter';

const toUpperCaseFilter: Filter = (value: MomentContent) => (
  typeof value === 'string' ? value.toUpperCase() : value
);

describe('applyContentFilter', () => {
  beforeEach(() => {
    Moment.settings = {
      moment: null,
      locale: null,
      local: null,
      format: null,
      parse: null,
      filter: null,
      filters: null,
      renderers: null,
      element: 'time',
      timezone: null
    };
  });

  it('returns content unchanged when no filter is configured', () => {
    expect(applyContentFilter({}, 'hello')).toEqual('hello');
  });

  it('applies props.filter', () => {
    expect(applyContentFilter({ filter: toUpperCaseFilter }, 'hello')).toEqual('HELLO');
  });

  it('applies settings.filter when props.filter is omitted', () => {
    Moment.settings.filter = toUpperCaseFilter;
    expect(applyContentFilter({}, 'hello')).toEqual('HELLO');
  });

  it('prefers settings.filter over props.filter', () => {
    Moment.settings.filter = toUpperCaseFilter;
    const filter: Filter = (value) => (typeof value === 'string' ? value.toLowerCase() : value);
    expect(applyContentFilter({ filter }, 'Hello')).toEqual('HELLO');
  });

  it('chains filters in order', () => {
    const appendSuffix: Filter = (value) => (
      typeof value === 'string' ? `${value}!` : value
    );
    expect(applyContentFilter({
      filters: [appendSuffix, toUpperCaseFilter]
    }, 'hello')).toEqual('HELLO!');
  });

  it('applies filters before singular filter', () => {
    const appendSuffix: Filter = (value) => (
      typeof value === 'string' ? `${value}!` : value
    );
    expect(applyContentFilter({
      filters: [appendSuffix],
      filter: toUpperCaseFilter
    }, 'hello')).toEqual('HELLO!');
  });

  it('applies filters before settings.filter', () => {
    const appendSuffix: Filter = (value) => (
      typeof value === 'string' ? `${value}!` : value
    );
    Moment.settings.filter = toUpperCaseFilter;
    expect(applyContentFilter({
      filters: [appendSuffix]
    }, 'hello')).toEqual('HELLO!');
  });

  it('uses settings.filters when props.filters is omitted', () => {
    const appendSuffix: Filter = (value) => (
      typeof value === 'string' ? `${value}!` : value
    );
    Moment.settings.filters = [appendSuffix, toUpperCaseFilter];
    expect(applyContentFilter({}, 'hello')).toEqual('HELLO!');
  });

  it('prefers props.filters over settings.filters', () => {
    Moment.settings.filters = [() => 'global'];
    expect(applyContentFilter({
      filters: [() => 'prop']
    }, 'hello')).toEqual('prop');
  });
});
