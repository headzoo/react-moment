import type { Filter, MomentContent } from '../types';
import { makeSettings } from '../testHelpers';
import { applyContentFilter } from './applyContentFilter';

const toUpperCaseFilter: Filter = (value: MomentContent) => (
  typeof value === 'string' ? value.toUpperCase() : value
);

describe('applyContentFilter', () => {
  const settings = makeSettings();

  it('returns content unchanged when no filter is configured', () => {
    expect(applyContentFilter({}, 'hello', settings)).toEqual('hello');
  });

  it('chains filters in order', () => {
    const appendSuffix: Filter = value => (
      typeof value === 'string' ? `${value}!` : value
    );
    expect(applyContentFilter({
      filters: [appendSuffix, toUpperCaseFilter]
    }, 'hello', settings)).toEqual('HELLO!');
  });

  it('uses settings.filters when props.filters is omitted', () => {
    const appendSuffix: Filter = value => (
      typeof value === 'string' ? `${value}!` : value
    );
    const withFilters = makeSettings({ filters: [appendSuffix, toUpperCaseFilter] });
    expect(applyContentFilter({}, 'hello', withFilters)).toEqual('HELLO!');
  });

  it('skips a throwing filter and continues the chain', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const appendSuffix: Filter = value => (
      typeof value === 'string' ? `${value}!` : value
    );
    const throwingFilter: Filter = () => { throw new Error('bad'); };

    expect(applyContentFilter({
      filters: [appendSuffix, throwingFilter, toUpperCaseFilter]
    }, 'hello', settings)).toEqual('HELLO!');

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('merges provider and instance filters with provider first', () => {
    const appendSuffix: Filter = value => (
      typeof value === 'string' ? `${value}!` : value
    );
    const withFilters = makeSettings({ filters: [appendSuffix] });
    expect(applyContentFilter({
      filters: [toUpperCaseFilter]
    }, 'hello', withFilters)).toEqual('HELLO!');
  });
});
