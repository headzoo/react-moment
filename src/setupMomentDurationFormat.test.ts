import moment from 'moment';
import { setupMomentDurationFormat } from './setupMomentDurationFormat';

describe('setupMomentDurationFormat', () => {
  it('throws an Error when moment is missing', () => {
    expect(() => setupMomentDurationFormat(undefined as unknown as typeof moment))
      .toThrow(Error);
    expect(() => setupMomentDurationFormat(undefined as unknown as typeof moment))
      .toThrow('[react-moment] Duration formatting requires moment');
  });

  it('initializes duration formatting on a valid moment instance', () => {
    setupMomentDurationFormat(moment);
    expect(typeof moment.duration(0).format).toBe('function');
  });

  it('no-ops when moment-duration-format is not installed', () => {
    jest.isolateModules(() => {
      jest.doMock('moment-duration-format', () => {
        throw new Error('Cannot find module');
      });
      // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
      const { setupMomentDurationFormat: setup } = require('./setupMomentDurationFormat');
      expect(() => setup(moment)).not.toThrow();
    });
  });
});
