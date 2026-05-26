import moment from 'moment';
import {
  getInvalidFallbackContent,
  warnInvalidDatetime
} from './invalidDatetime';
import type { MomentProps } from './types';

describe('invalidDatetime', () => {
  const invalid = moment('not-a-date');

  it('warnInvalidDatetime logs in non-production when datetime is invalid', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    warnInvalidDatetime(invalid, { children: 'not-a-date' });

    expect(warn).toHaveBeenCalledWith(
      '[react-moment] Invalid date input:',
      'not-a-date',
      'Provide a valid date or use the `fallback` prop.'
    );

    warn.mockRestore();
  });

  it('warnInvalidDatetime does not log for valid datetimes', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    warnInvalidDatetime(moment(), { children: '2020-01-01' });

    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });

  it('getInvalidFallbackContent returns fallback when provided', () => {
    const props: MomentProps = { fallback: 'N/A' };
    expect(getInvalidFallbackContent(props)).toEqual('N/A');
  });

  it('getInvalidFallbackContent returns empty string when fallback is omitted', () => {
    expect(getInvalidFallbackContent({})).toEqual('');
  });
});
