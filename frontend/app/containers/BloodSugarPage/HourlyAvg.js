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

const HourlyAvg = () => {
  const dateRange = useSelector(selectors.dateRange);
  const [data, setData] = useState(null);

  useEffect(() => {
    getData();
  }, [dateRange]);

  const getData = async () => setData((await axios.get('/bloodsugar/hourly-avg', {params: dateRange})).data);
  return <div className='h-100 w-100'>
    <FixedDateRangePicker />
    <div className='p-3 h-100 w-100' style={{fontSize: '0.7rem'}}>
      <MainChart events={data} xValue='point' yValue='avg'/>
    </div>
    <hr />
    <AvgTable data={data} />
  </div>
}

export default HourlyAvg;