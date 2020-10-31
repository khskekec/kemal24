/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, {
  Fragment,
  useState
} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import Widget from "./components/Widget";
import {useAjaxData} from "../../utils/hooks";
import MainChart from "../BloodSugarPage/components/MainChart";
import {
  Pie,
  ResponsiveContainer,
  PieChart
} from "recharts";
import moment from 'moment';
import {round} from "../../utils/misc";
const key = 'dashboard';

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

export function DashboardPage({}) {
  const {isLoading, failure, getData, reload} = useAjaxData({method: 'GET', url: '/event/statistic'});

  if (isLoading) return "";

  console.log(getData());
  const summed = Object.values(getData().col).reduce((a,b) => a+b, 0)

  const perc = val => round(100 / summed * val);
  return (
    <Fragment>
      <div className='card m-3 mb-3 h-25'>
        <div className='card-header'>Hourly Average</div>
        <MainChart events={getData().bloodSugar.hourlyAvg} xValue='point' yValue='avg'/>
      </div>
      <div className="container-fluid pt-3">
        <div className="row">
          <div className='col-6 col-md-4 mb-3'>
            <Widget title='Current'
                    value={getData().bloodSugar.newest.value}
                    icon={<i className='fa fa-tint'/>}
                    tendency={-23}
                    lastScan='10 minutes ago'
            />
          </div>
          <div className='col-6 col-md-4 mb-3'>
            <Widget title='Average today'
                    value={getData().bloodSugar.average}
                    icon={<i className='fa fa-tint'/>}
                    tendency={0}
                    lastScan='10 minutes ago'
            />
          </div>
          <div className='col-12 col-md-4 mb-3'>
            <div className='card'>
              <div className='card-body d-flex'>
                <div className='col-4 text-center'>
                  <h3>{msToTime(getData().col.below)}</h3>
                  <h3>{perc(getData().col.below)}%</h3>
                  <hr/>
                  <h5>Below</h5>
                  <h5>x {'<'} 80</h5>
                </div>
                <div className='col-4 text-center'>
                  <h3>{msToTime(getData().col.inRange)}</h3>
                  <h3>{perc(getData().col.inRange)}%</h3>
                  <hr/>
                  <h5>inRange</h5>
                  <h5>80 {'<'} x {'>'} 200</h5>
                </div>
                <div className='col-4 text-center'>
                  <h3>{msToTime(getData().col.above)}</h3>
                  <h3>{perc(getData().col.above)}%</h3>
                  <hr/>
                  <h5>above</h5>
                  <h5>x {'<'} 80</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='card m-3 mb-3 h-25'>
        <div className='card-header'>In Range</div>
        <ResponsiveContainer>
          <PieChart width='100%' height='100%'>
            <Pie label={(entry) => entry.name} data={Object.entries(getData().col).map(e => ({key: e[0], value: e[1]}))}
                 dataKey="value" nameKey="key" cx="50%" cy="50%" outerRadius={50} fill="#8884d8"/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Fragment>
  );
}

DashboardPage.propTypes = {};

export default DashboardPage;
