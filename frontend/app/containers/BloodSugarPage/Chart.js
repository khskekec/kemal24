import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import axios from "../../utils/axios";
import {bloodSugarAlert, round, bloodSugarRangeConfiguration} from "../../utils/misc";
import AvgTable from "./components/AvgTable";
import MainChart from "./components/MainChart";
import {useDispatch} from "react-redux";

const Chart = () => {
  const [bloodSugar, setBloodSugar] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => setBloodSugar((await axios.get('/bloodsugar')).data);

  if (bloodSugar === null) {
    return '';
  }
  return <div>
    <h1>Chart</h1>

    <MainChart events={bloodSugar}/>
  </div>
}

export default Chart;
