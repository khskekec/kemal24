import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import axios from "../../../utils/axios";
import {bloodSugarAlert, round, bloodSugarRangeConfiguration} from "../../../utils/misc";

const AvgTable = ({data}) => {
  if (!data) return null;

  const totalEvents = data.length;
  const distribution = bloodSugarRangeConfiguration.map(e => ({
    ...e,
    count: data.filter(f => (e.upperThreshold ? f.avg <= e.upperThreshold : true) && (e.lowerThreshold ? f.avg > e.lowerThreshold : true)).length
  }));

  return <div className='container-fluid'>
    <div className='row flex-column-reverse flex-md-row'>
      <div className='col-12 col-md-8'>
        <h4>Averages</h4>
        <table className='table table-striped table-responsive'>
          <thead>
          <tr>
            <th>Day</th>
            <th>Value</th>
          </tr>
          </thead>
          <tbody>
          {data.map(e => <tr className={bloodSugarAlert(e.avg)}>
            <td>{e.point}</td>
            <td>{round(e.avg)}</td>
          </tr>)}
          </tbody>
        </table>
      </div>
      <div className='col-12 col-md-4'>
        <h4>Overall range</h4>
        <table className='table'>
          <thead>
          <tr>
            <th>Range</th>
            <th>Percent</th>
          </tr>
          </thead>
          <tbody>
          {distribution.map(e => <tr className={e.classname + ' color-white'}>
            <td>
              {e.lowerThreshold} &lt; x &lt; {e.upperThreshold}
            </td>
            <td>
              {round(100 / totalEvents * e.count)} %
            </td>
          </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </div>
}

export default AvgTable;
