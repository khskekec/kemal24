/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, {
  useState,
  useEffect,
  Fragment
} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import axios from '../../utils/axios';
import {push} from 'connected-react-router';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import {Route} from "react-router-dom";
import Icon from "../../components/NavItem/Icon";
import RoutingNavItem from "../../components/NavItem/RoutingNavItem";
import DailyHourlyAvgHeatmap from "./components/DailyHourlyAvgHeatmap";
import DateRangePicker from "./components/DateRangePicker";
import {actions} from "./redux";
import classnames from 'classnames';

const key = 'bloodsugar';

const BloodSugarPage = () => {
  return <div>
    <div className='container-fluid py-2'>
      <div className='row'>
        <div className='col-6 col-md mt-4'>
          <RoutingNavItem title='Daily AVG' icon={<Icon iconClass='fa-calendar'/>}
                          targetUrl='/blood-sugar/daily-avg'/>
        </div>
        <div className='col-6 col-md mt-4'>
          <RoutingNavItem title='Hourly AVG' icon={<Icon iconClass='fa-clock'/>} targetUrl='/blood-sugar/hourly-avg'/>
        </div>
        <div className='col-6 col-md mt-4'>
          <RoutingNavItem title='Daily-Hourly AVG' icon={<Icon iconClass='fa-history'/>}
                          targetUrl='/blood-sugar/daily-hourly-avg'/>
        </div>
        <div className='col-6 col-md mt-4'>
          <RoutingNavItem title='Over Time' icon={<Icon iconClass='fa-chart-line'/>} targetUrl='/blood-sugar/chart'/>
        </div>
        <div className='col-6 col-md mt-4'>
          <RoutingNavItem title='Time in Range' icon={<Icon iconClass='fa-check'/>} targetUrl='/blood-sugar/time-in-range'/>
        </div>
      </div>
    </div>
  </div>
};

BloodSugarPage.propTypes = {};

export default BloodSugarPage;
