import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import axios from "../../utils/axios";
import {bloodSugarAlert, round, bloodSugarRangeConfiguration} from "../../utils/misc";
import AvgTable from "./components/AvgTable";
import {useSelector} from "react-redux";
import {selectors} from "./redux";
import MainChart from "./components/MainChart";
import DailyHourlyAvgHeatmap from "./components/DailyHourlyAvgHeatmap";
import FixedDateRangePicker from "./components/FixedDateRangePicker";
import DayReport from "./DayReport";
import moment from 'moment';

const Diary = () => {
  const dateRange = useSelector(selectors.dateRange);
  const [data, setData] = useState(null);

  useEffect(() => {
    getData();
  }, [dateRange]);

  const getData = async () => setData((await axios.get('/bloodsugar/hourly-avg', {params: dateRange})).data);
  const daysBack = Array.from(Array(30).keys());

  return <div className='h-100 w-100'>
    {
      daysBack.map(i => <DayReport end={moment().subtract(i, 'day').local().format('YYYY-MM-DD 23:59:59')} start={moment().subtract(i, 'day').local().format('YYYY-MM-DD')}/>)
    }
  </div>
}

export default Diary;
