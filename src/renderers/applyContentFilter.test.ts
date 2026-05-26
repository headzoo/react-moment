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
    const appendSuffix: Filter = (value) => (
      typeof value === 'string' ? `${value}!` : value
    );
    expect(applyContentFilter({
      filters: [appendSuffix, toUpperCaseFilter]
    }, 'hello', settings)).toEqual('HELLO!');
  });

  it('uses settings.filters when props.filters is omitted', () => {
    const appendSuffix: Filter = (value) => (
      typeof value === 'string' ? `${value}!` : value
    );
    const withFilters = makeSettings({ filters: [appendSuffix, toUpperCaseFilter] });
    expect(applyContentFilter({}, 'hello', withFilters)).toEqual('HELLO!');
  });

  it('prefers props.filters over settings.filters', () => {
    const withFilters = makeSettings({ filters: [() => 'global'] });
    expect(applyContentFilter({
      filters: [() => 'prop']
    }, 'hello', withFilters)).toEqual('prop');
  });
});
