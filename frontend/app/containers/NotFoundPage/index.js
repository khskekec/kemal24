/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import messages from './messages';

export default function NotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center h-100">
      <div className="text-center">
        <h1 className="p-5 color-danger text-size-7.5 font-weight-bolder">
          404
        </h1>
        <h1>Page does not exist!</h1>
      </div>
    </div>
  );
}
