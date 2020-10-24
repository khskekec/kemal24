import React from 'react';
import GenericItem from "./GenericItem";
import moment from "moment";
import {
  bloodSugarAlert,
  getBloodSugarRange,
  round,
  trendConfiguration
} from "../../../../utils/misc";

const BloodSugarItem = ({data}) => {
  return <GenericItem
    icon={<i className='fa fa-tint color-brand'/>}
    body={<span className='font-weight-bold'>Blood Sugar</span>}
    borderIndicatorColor={getBloodSugarRange(data.value).color}
    value={<div className='d-flex align-items-center'>
      <div className={getBloodSugarRange(data.value).fgClassname}>{data.value}</div>
      <span style={{fontSize: '0.7rem'}}>mg/dL</span>&nbsp;<TrendIndicator constant={data.meta ? data.meta.trend : null} /></div>}
    footer={<div className='row p-0'>
      <div className='col-12 text-right' style={{fontSize: '0.9rem'}}>
        <span className='badge bg-info'><i className='fa fa-calendar'/> {moment(data.start).format('DD.MM.YYYY HH:mm')}</span>&nbsp;
        <span className='badge bg-info'><i
          className='fa fa-clock'/> {round(moment.duration(moment().diff(moment(data.start))).asMinutes())}</span>&nbsp;
        <span className='badge bg-info'><i className='fa fa-file-import'/> {data['origin'] ?? 'Manual'}</span>
      </div>
    </div>}
  />
}

const TrendIndicator = ({constant}) => {
  const config = trendConfiguration[constant] ? trendConfiguration[constant] : trendConfiguration[''];
  return <span className={'font-weight-bolder badge ' + config.classname}>{config.text}</span>
}

export default BloodSugarItem;
