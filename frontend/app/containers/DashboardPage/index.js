/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import {useAjaxData} from "../../utils/hooks";

const key = 'dashboard';

export function DashboardPage({}) {
  const a = useAjaxData({
    method: 'GET',
    url: '/event',
  });

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <div className="container-fluid pt-3">
        <div className="row">
          <button type="button" onClick={() => a.reload()}> RELOAD</button>

          {a.success && <pre>{JSON.stringify(a.response)}</pre>}
          {a.failure && <span>Error</span>}
        </div>
      </div>
    </div>
  );
}

DashboardPage.propTypes = {};

export default DashboardPage;
