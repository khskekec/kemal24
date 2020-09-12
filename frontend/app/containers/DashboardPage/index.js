/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const key = 'dashboard';

export function DashboardPage({}) {
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
        <div className="row" />
      </div>
    </div>
  );
}

DashboardPage.propTypes = {};

export default DashboardPage;
