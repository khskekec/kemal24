/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import {useAjaxData} from "../../utils/hooks";
import LoadingIndicator from "../../components/LoadingIndicator";
import {round} from "../../utils/misc";
import moment from "moment";

const key = 'live-monitor';

export function LiveMonitorPage({}) {
  const {isLoading, success, failure, getData, reload} = useAjaxData({
    method: 'GET',
    url: '/live-monitor',
  });

  let content = null;
  if (isLoading) {
    content = <LoadingIndicator/>
  }

  if (failure) {
    content = <div className='alert alert-danger'>
      <h1>An error occured</h1>
    </div>
  }

  if (success) {
    const data = getData();
    content = <div className="row">
      <h1>Time</h1>
      <InfoBox title='Latest Bolus' value={round(moment.duration(moment().diff(moment(data.bolus.latest))).asMinutes()) + ' mins'} />
      <InfoBox title='Latest Blood Sugar' value={round(moment.duration(moment().diff(moment(data.bloodSugar.latest))).asMinutes()) + ' mins'} />
      <h1>Blood Sugar</h1>
      <InfoBox title='Latest' value={data.bloodSugar.latest.value}/>
      <InfoBox title='Average' value={round(data.bloodSugar.average)}/>
      <InfoBox title='Highest' value={data.bloodSugar.highest.value}/>
      <InfoBox title='Lowest' value={data.bloodSugar.lowest.value}/>
      <h1>Bolus</h1>
      <InfoBox title='Total Insulin today' value={round(data.bolus.totalInsulin)}/>
      <InfoBox title='Total Carbs today' value={round(data.bolus.totalCarbs)}/>
      <InfoBox title='Lowest' value={data.bolus.lowest.value}/>
      <InfoBox title='Highest' value={data.bolus.highest.value}/>
    </div>
  }

  return (
    <div>
      <Helmet>
        <title>Live-Monitor</title>
        <meta
          name="description"
          content="Live data of the current day"
        />
      </Helmet>
      <div className="container-fluid pt-3">
        {content}
      </div>
    </div>
  );
}

LiveMonitorPage.propTypes = {};

export default LiveMonitorPage;

const InfoBox = ({value, title}) => <div className='col-12 col-sm-6 col-md-3'>
  <div className='alert alert-info '>
    <h2>{value}</h2>
    <h5>{title}</h5>
  </div>
</div>
