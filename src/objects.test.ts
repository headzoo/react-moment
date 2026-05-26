import * as objects from './objects';

test('objectKeyFilter', () => {
  const propKeys = {
    className: true
  };
  const props = {
    className: 'dp-item',
    title:     'foo'
  };
  const result = objects.objectKeyFilter(props, propKeys);
  expect(result.className).toBe(undefined);
  expect(result.title).not.toBe(undefined);
});
