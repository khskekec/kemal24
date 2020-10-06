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
      <InfoBox title='Latest Bolus' value={data.bolus?.latest?.start ? moment.duration(moment().diff(moment(data.bolus.latest.start))).asMinutes() + ' mins' + data.bolus.latest.start : 'N/A'} />
      <InfoBox title='Latest Bolus' value={data.bolus?.latest?.start ? moment(moment.duration(moment().diff(moment(data.bolus.latest.start))).asMinutes()).format("HH:mm") + ' mins' : 'N/A'} />
      <InfoBox title='Latest Blood Sugar' value={data.bloodSugar?.latest?.start ? round(moment.duration(moment().diff(moment(data.bloodSugar.latest.start))).asMinutes()) + ' mins' : 'N/A'} />
      <h1>Blood Sugar</h1>
      <InfoBox title='Latest' value={data.bloodSugar?.latest?.value ?? 'N/A'}/>
      <InfoBox title='Average' value={data.bloodSugar?.average ? round(data.bloodSugar?.average) : 'N/A'}/>
      <InfoBox title='Highest' value={data.bloodSugar?.highest?.value ?? 'N/A'}/>
      <InfoBox title='Lowest' value={data.bloodSugar?.lowest?.value ?? 'N/A'}/>
      <h1>Bolus</h1>
      <InfoBox title='Total Insulin today' value={data.bolus?.totalInsulin ? round(data.bolus?.totalInsulin): 'N/A'}/>
      <InfoBox title='Total Carbs today' value={data.bolus?.totalCarbs ? round(data.bolus?.totalCarbs) : 'N/A'}/>
      <InfoBox title='Lowest' value={data.bolus?.lowest?.value ?? 'N/A'}/>
      <InfoBox title='Highest' value={data.bolus?.highest?.value ?? 'N/A'}/>
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
