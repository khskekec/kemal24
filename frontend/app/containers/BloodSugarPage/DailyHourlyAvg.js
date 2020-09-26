import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import axios from "../../utils/axios";
import {bloodSugarAlert, round, bloodSugarRangeConfiguration} from "../../utils/misc";
import AvgTable from "./components/AvgTable";

const DailyHourlyAvg = () => {
  return <AvgTable url='/bloodsugar/daily-hourly-avg' />;
}

export default DailyHourlyAvg;
