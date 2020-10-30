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

export function LiveMonitorPage({}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [intervalId, setIntervalId] = useState(false);

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

  useEffect(() => {
    if (intervalId) clearInterval(intervalId);
    if (!Array.isArray(data) || !data[0]) return;
    setIntervalId(setInterval(() => setLastUpdate(moment.utc(moment().diff(moment(data[0].start))).format("HH:mm:ss")), 1000));
  }, [data])

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

  if (data.length && !error && !loading) {
    // content = <Fragment>
    //   <div className="grid-container h-100">
    //     <div className={'value shadow-lg text-white font-weight-bold ' + getBloodSugarRange(data[0].value).classname}>{data[0].value}</div>
    //     <div className="tendency shadow-lg css-selector font-weight-bold">{getTrend(data[0].meta?.trend).text}</div>
    //     <div className="difference shadow-lg font-weight-bold">{data[0].value - data[1].value}</div>
    //     <div className={'prev1 font-weight-bold ' + getBloodSugarRange(data[5].value).fgClassname}>{data[5].value} {getTrend(data[5].meta?.trend).text}</div>
    //     <div className={'prev2 font-weight-bold ' + getBloodSugarRange(data[4].value).fgClassname}>{data[4].value} {getTrend(data[4].meta?.trend).text}</div>
    //     <div className={'prev3 font-weight-bold ' + getBloodSugarRange(data[3].value).fgClassname}>{data[3].value} {getTrend(data[3].meta?.trend).text}</div>
    //     <div className={'prev4 font-weight-bold ' + getBloodSugarRange(data[2].value).fgClassname}>{data[2].value} {getTrend(data[2].meta?.trend).text}</div>
    //     <div className={'prev5 font-weight-bold ' + getBloodSugarRange(data[1].value).fgClassname}>{data[1].value} {getTrend(data[1].meta?.trend).text}</div>
    //     <div className="lastUpdate">
    //       <i className='fas fa-clock' />
    //       <span>{lastUpdate}</span>
    //       <span>{connectionStatus}</span>
    //     </div>
    //   </div>
    // </Fragment>;

    const lastDifference = data[0].value - data[1].value;
    content = <div className='container-fluid h-100'>
      <div className={classname( 'pr-3', 'row', 'h-5', 'justify-content-end','align-items-center', getBloodSugarRange(data[0].value).classname)}>
        <div className='badge bg-white text-black-50 col-auto'><i className='fa fa-satellite'></i> {connectionStatus}</div>&nbsp;
        <div className='badge bg-white text-black-50 col-auto'><i className='fas fa-clock'></i> {lastUpdate}</div>
      </div>
      <div className={classname('row', 'h-45', 'justify-content-center','align-items-center',getBloodSugarRange(data[0].value).classname)}>
        <div className='col-3 text-center font-weight-bold text-white text-size-2'>{(lastDifference > 0 ? '+' : null) + lastDifference}</div>
        <div className='col-6 text-center font-weight-bold text-white text-size-5'>{data[0].value}</div>
        <div className='col-3 text-center font-weight-bold text-white text-size-2'>{getTrend(data[0].meta?.trend).text}</div>
      </div>
      <div className='row h-45 bg-warning'>
        <Chart events={data} xValue='start' yValue='value' />
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
