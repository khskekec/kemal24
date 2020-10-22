/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import Widget from "./components/Widget";

const key = 'life-monitor';

export function LifeMonitorPage({}) {
  return (
    <div>
      <Helmet>
        <title>LifeMonitor</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <div className="container-fluid pt-3">
        <div className="row">
          <div className='col-4 mb-5'>
            <Widget title='Blood Sugar'
                    value={178}
                    icon={<i className='fa fa-tint'/>}
                    tendency={-23}
                    lastScan='10 minutes ago'
            />
          </div>
          <div className='col-4'>
            <Widget title='Heart Rate'
                    value={80}
                    icon={<i className='fa fa-heartbeat'/>}
                    tendency={4}
                    lastScan='10 minutes ago'
            />
          </div>
          <div className='col-4'>
            <Widget title='Weight'
                    value={80}
                    icon={<i className='fa fa-weight'/>}
                    tendency={0}
                    lastScan='10 minutes ago'
            />
          </div>
          <div className='col-4'>
            <Widget title='Height'
                    value={134}
                    icon={<i className='fa fa-text-height'/>}
                    tendency={0}
                    lastScan={null}
            />
          </div>
          <div className='col-4'>
            <Widget title='BMI'
                    value={16.6}
                    icon={<div style={{
                      transform: 'rotate(90deg)'}}>BMI</div>}
                    tendency={0}
                    lastScan={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

LifeMonitorPage.propTypes = {};

export default LifeMonitorPage;
