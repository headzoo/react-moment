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

  it('applies props.filter', () => {
    expect(applyContentFilter({ filter: toUpperCaseFilter }, 'hello', settings)).toEqual('HELLO');
  });

  it('applies settings.filter when props.filter is omitted', () => {
    const withFilter = makeSettings({ filter: toUpperCaseFilter });
    expect(applyContentFilter({}, 'hello', withFilter)).toEqual('HELLO');
  });

  it('prefers settings.filter over props.filter', () => {
    const withFilter = makeSettings({ filter: toUpperCaseFilter });
    const filter: Filter = (value) => (typeof value === 'string' ? value.toLowerCase() : value);
    expect(applyContentFilter({ filter }, 'Hello', withFilter)).toEqual('HELLO');
  });

  it('chains filters in order', () => {
    const appendSuffix: Filter = (value) => (
      typeof value === 'string' ? `${value}!` : value
    );
    expect(applyContentFilter({
      filters: [appendSuffix, toUpperCaseFilter]
    }, 'hello', settings)).toEqual('HELLO!');
  });

  it('applies filters before singular filter', () => {
    const appendSuffix: Filter = (value) => (
      typeof value === 'string' ? `${value}!` : value
    );
    expect(applyContentFilter({
      filters: [appendSuffix],
      filter: toUpperCaseFilter
    }, 'hello', settings)).toEqual('HELLO!');
  });

  it('applies filters before settings.filter', () => {
    const appendSuffix: Filter = (value) => (
      typeof value === 'string' ? `${value}!` : value
    );
    const withFilter = makeSettings({ filter: toUpperCaseFilter });
    expect(applyContentFilter({
      filters: [appendSuffix]
    }, 'hello', withFilter)).toEqual('HELLO!');
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
