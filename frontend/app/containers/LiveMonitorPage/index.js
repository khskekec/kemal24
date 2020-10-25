/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, {
  useState,
  useEffect,
  Fragment,
  useRef
} from 'react';
import {useAjaxData} from "../../utils/hooks";
import LoadingIndicator from "../../components/LoadingIndicator";
import {
  getBloodSugarRange,
  getTrend,
  round,
  trendConfiguration
} from "../../utils/misc";
import moment from "moment";
import axiosInstance from "../../utils/axios";

const key = 'live-monitor';

export function LiveMonitorPage({}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [wsStatus, setWsStatus] = useState(false);
  const [intervalId, setIntervalId] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:3010');
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axiosInstance.get('/event?limit=6');
        setData(response.data);
      } catch (e) {
        setError(true);
      }

      setLoading(false);
    })()
  }, [])

  useEffect(() => {
    if (!data.length) return;

    // Show a connected message when the WebSocket is opened.
    socket.current.onopen = function(event) {
      setWsStatus(true);
    };

    socket.current.onerror = function(error) {
      setWsStatus(false);
    };

    socket.current.onmessage = function(event) {
      console.log('MESSAGE RECEIVED:', event);
      const message = JSON.parse(event.data);
      console.log('data', data);
      if (message.type === 'EVENT_CREATED' && message.data[0].typeId === 1) {
        console.log([message.data[0], ...data.slice(0,-1)]);
        setData([message.data[0], ...data.slice(0,-1)])
      }
    };

    //return () => socket.close();
  }, [data]);

  useEffect(() => {
    if (intervalId) clearInterval(intervalId);
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

  if (data.length && !error && !loading) {
    content = <Fragment>
      <div className="grid-container h-100">
        <div className={'value shadow-lg text-white font-weight-bold ' + getBloodSugarRange(data[0].value).classname}>{data[0].value}</div>
        <div className="tendency shadow-lg css-selector font-weight-bold">{getTrend(data[0].meta?.trend).text}</div>
        <div className="difference shadow-lg font-weight-bold">{data[0].value - data[1].value}</div>
        <div className={'prev1 font-weight-bold ' + getBloodSugarRange(data[5].value).fgClassname}>{data[5].value} {getTrend(data[5].meta?.trend).text}</div>
        <div className={'prev2 font-weight-bold ' + getBloodSugarRange(data[5].value).fgClassname}>{data[4].value} {getTrend(data[4].meta?.trend).text}</div>
        <div className={'prev3 font-weight-bold ' + getBloodSugarRange(data[5].value).fgClassname}>{data[3].value} {getTrend(data[3].meta?.trend).text}</div>
        <div className={'prev4 font-weight-bold ' + getBloodSugarRange(data[5].value).fgClassname}>{data[2].value} {getTrend(data[2].meta?.trend).text}</div>
        <div className={'prev5 font-weight-bold ' + getBloodSugarRange(data[5].value).fgClassname}>{data[1].value} {getTrend(data[1].meta?.trend).text}</div>
        <div className="lastUpdate">
          <i className='fas fa-clock' />
          <span>{lastUpdate}</span>
        </div>
      </div>
    </Fragment>
  }

  return (
    <Fragment>
      {content}
    </Fragment>
  );
}

LiveMonitorPage.propTypes = {};

export default LiveMonitorPage;
