import PropTypes from 'prop-types';
import * as objects from '../src/objects';

test('objectKeyFilter', () => {
  const propTypes = {
    className: PropTypes.string
  };
  const props = {
    className: 'dp-item',
    title:     'foo'
  };
  const result = objects.objectKeyFilter(props, propTypes);
  expect(result.className).toBe(undefined);
  expect(result.title).not.toBe(undefined);
});

