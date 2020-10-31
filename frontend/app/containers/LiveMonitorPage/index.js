/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, {
  useState,
  useEffect,
  Fragment,
} from 'react';
import LoadingIndicator from "../../components/LoadingIndicator";
import {
  getBloodSugarRange,
  getTrend,
} from "../../utils/misc";
import moment from "moment";
import axiosInstance from "../../utils/axios";
import useWebSocket, {ReadyState} from 'react-use-websocket';
import classname from 'classnames';
import config from '../../config';
import MainChart from "../BloodSugarPage/components/MainChart";
import Chart from "./Chart";
const key = 'live-monitor';

const LastChanges = ({data}) => {
  const [intervalId, setIntervalId] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(false);
  useEffect(() => {
    if (intervalId) clearInterval(intervalId);
    if (!Array.isArray(data) || !data[0]) return;
    setIntervalId(setInterval(() => setLastUpdate(moment.utc(moment().diff(moment(data[0].start))).format("HH:mm:ss")), 1000));
  }, [data])

  return lastUpdate;
}

export function LiveMonitorPage({}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const {
    readyState,
  } = useWebSocket(config.webSocket, {
    shouldReconnect: e => true,
    reconnectAttempts: Number.MAX_VALUE,
    reconnectInterval: 3000,
    onMessage: e => {
      const message = JSON.parse(e.data);

      if (message.type === 'EVENT_CREATED' && message.data[0].typeId === 1) {
        setData([message.data[0], ...data.slice(0,-1)])
      }
    }
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axiosInstance.get('/event?liveMonitor=1');
        setData(response.data);
      } catch (e) {
        setError(true);
      }

      setLoading(false);
    })()
  }, [])

  let content = null;
  if (loading) {
    content = <LoadingIndicator/>
  }

  if (error) {
    content = <div className='alert alert-danger'>
      <h1>An error occured</h1>
    </div>
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  if (readyState !== ReadyState.OPEN) {
    return <Fragment>
      <div>{connectionStatus}</div>
    </Fragment>
  }

  if (Array.isArray(data) && !error && !loading) {
    const bloodSugarEvents = data.filter(e => e.typeId === 1);
    const lastDifference = bloodSugarEvents.length ? bloodSugarEvents[0].value - bloodSugarEvents[1].value : 'n/a';

    const getLatestBloodSugarValue = () => bloodSugarEvents.length ? bloodSugarEvents[0].value : 'n/a'
    content = <div className='container-fluid h-100'>
      <div className={classname( 'pr-3', 'row', 'h-5', 'justify-content-end','align-items-center', 'bg-danger', bloodSugarEvents[0] ? getBloodSugarRange(getLatestBloodSugarValue()).classname : null)}>
        <div className='badge bg-white text-black-50 col-auto'><i className='fa fa-satellite'></i> {connectionStatus}</div>&nbsp;
        <div className='badge bg-white text-black-50 col-auto'><i className='fas fa-clock'></i> {<LastChanges data={data} />}</div>
      </div>
      <div className={classname('row', 'h-45', 'justify-content-center','align-items-center', 'bg-danger',bloodSugarEvents[0] ? getBloodSugarRange(getLatestBloodSugarValue()).classname : null)}>
        <div className='col-3 text-center font-weight-bold text-white text-size-2'>{(lastDifference > 0 ? '+' : null) + lastDifference}</div>
        <div className='col-6 text-center font-weight-bold text-white text-size-5'>{getLatestBloodSugarValue()}</div>
        <div className='col-3 text-center font-weight-bold text-white text-size-2'>{bloodSugarEvents[0] ? getTrend(bloodSugarEvents[0].meta?.trend).text : 'n/a'}</div>
      </div>
      <div className='row h-45' style={{backgroundColor: '#f0f0f0'}}>
        <Chart events={bloodSugarEvents} xValue='start' yValue='value' />
      </div>
      <div className='row h-5 bg-info'>c</div>
    </div>
  }

  return (
    <Fragment>
      {content}
    </Fragment>
  );
}

LiveMonitorPage.propTypes = {};

export default LiveMonitorPage;
