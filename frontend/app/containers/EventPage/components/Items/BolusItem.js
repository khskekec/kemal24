import React from 'react';
import GenericItem from "./GenericItem";
import moment from "moment";
import {bloodSugarAlert, getBloodSugarRange, round} from "../../../../utils/misc";

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

const BolusItem = ({data}) => {
  return <GenericItem
    icon={<i className='fa fa-bug'/>}
    body={<span className='font-weight-bold'>Bolus</span>}
    value={<div className='d-flex align-items-center'>
      <div>{data.value}</div>
      <span style={{fontSize: '0.7rem'}}>UNITS</span></div>}
    footer={<div className='row p-0' style={{fontSize: '0.9rem'}}>
      <div className='col-auto ml-auto text-right'>
        <span className='badge bg-info'><i className='fa fa-calendar'/> {moment(data.start).format('DD.MM.YYYY HH:mm')}</span>&nbsp;
        <span className='badge bg-info'><i
          className='fa fa-clock'/> {round(moment.duration(moment().diff(moment(data.start))).asMinutes())}</span>&nbsp;
        <span className='badge bg-info'><i className='fa fa-file-import'/> {data['origin'] ?? 'Manual'}</span>&nbsp;
        {/*<span className='badge bg-info'>Carbs {data.meta.meals.totalCarbs}g</span>*/}
      </div>
    </div>}
    detailView={<pre dangerouslySetInnerHTML={{__html: syntaxHighlight(JSON.stringify(data, undefined, 2))}}></pre>}
  />
}

export default BolusItem;
