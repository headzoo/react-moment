/**
 * @jest-environment node
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import moment from 'moment';
import Moment, { MomentProvider } from './index';

const DATE_STRING = '1976-04-19T12:59-0500';

describe('react-moment SSR', () => {
  it('renders ISO datetime and respects format with withTitle', () => {
    const markup = renderToString(
      <Moment format="D MMM YYYY" withTitle date={DATE_STRING} />
    );

    expect(markup).toContain('19 Apr 1976');
    expect(markup).toContain(`title="${moment(DATE_STRING).format('D MMM YYYY')}"`);
    expect(markup).toContain(`dateTime="${moment(DATE_STRING).toISOString()}"`);
    expect(markup).not.toMatch(/dateTime="\d{13}"/);
  });

  it('renders adjusted ISO datetime with add and format', () => {
    const adjusted = moment(DATE_STRING).add(1, 'day');
    const markup = renderToString(
      <Moment add={{ days: 1 }} format="YYYY-MM-DD" date={DATE_STRING} />
    );

    expect(markup).toContain('1976-04-20');
    expect(markup).toContain(`dateTime="${adjusted.toISOString()}"`);
  });

  it('falls back to time element when element is null', () => {
    const markup = renderToString(
      <Moment element={null} date={DATE_STRING} />
    );

    expect(markup).toMatch(/^<time dateTime="/);
  });

  it('falls back to time element when provider element is null', () => {
    const markup = renderToString(
      <MomentProvider element={null}>
        <Moment date={DATE_STRING} />
      </MomentProvider>
    );

    expect(markup).toMatch(/^<time dateTime="/);
  });
});
