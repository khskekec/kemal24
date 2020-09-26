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

const key = 'bloodsugar';

const BloodSugarPage = () => {
  const [dateRange, setDateRange] = useState(null);

  return <div className='container-fluid py-2'>
    <div className='row'>
      <div className='col-12'>
        <div className='card shadow-lg'>
          <div className='card-header'>Date Range</div>
          <div className='card-body p-0'>
            <DateRangePicker onChange={setDateRange} />
          </div>
        </div>

      </div>
    </div>
    <div className='row'>
      <div className='col mt-4'>
        <RoutingNavItem title='Daily Average' icon={<Icon iconClass='fa-calendar'/>}
                        targetUrl='/blood-sugar/daily-avg'/>
      </div>
      <div className='col  mt-4'>
        <RoutingNavItem title='Hourly Average' icon={<Icon iconClass='fa-clock'/>} targetUrl='/blood-sugar/hourly-avg'/>
      </div>
      <div className='col mt-4'>
        <RoutingNavItem title='Daily-Hourly Average' icon={<Icon iconClass='fa-history'/>} targetUrl='/blood-sugar/daily-hourly-avg'/>
      </div>
      <div className='col mt-4'>
        <RoutingNavItem title='Chart' icon={<Icon iconClass='fa-chart-line'/>} targetUrl='/blood-sugar/chart'/>
      </div>
    </div>
  </div>
};

BloodSugarPage.propTypes = {};

export default BloodSugarPage;
