import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import axios from "../../utils/axios";
import {bloodSugarAlert, round, bloodSugarRangeConfiguration} from "../../utils/misc";
import AvgTable from "./components/AvgTable";
import DateRangePicker from "./components/DateRangePicker";

const DailyAvg = () => {
  const [dateRange, setDateRange] = useState(null);

  return <div>
    <h1>Daily Average</h1>
    <div className='col-12'>
      <DateRangePicker onChange={setDateRange}/>
    </div>
    <AvgTable url='/bloodsugar/daily-avg' dateRange={dateRange}/>
  </div>;
}

export default DailyAvg;
