import React from 'react';
import GenericItem from "./GenericItem";
import moment from "moment";
import {round, syntaxHighlight} from "../../../../utils/misc";
import pp from "pretty-print-json";

const CorrectionBolusItem = ({data}) => {
  return <GenericItem
    icon={<i className='fa fa-tools'/>}
    body={<span className='font-weight-bold'>Correction Bolus</span>}
    value={<div className='d-flex align-items-center'>
      <div>{round(data.value)}</div>
      <span style={{fontSize: '0.7rem'}}>UNITS</span></div>}
    footer={<div className='row p-0' style={{fontSize: '0.9rem'}}>
      <div className='col-auto ml-auto text-right'>
        <span className='badge bg-info'><i className='fa fa-calendar'/> {moment(data.start).format('DD.MM.YYYY HH:mm')}</span>&nbsp;
        <span className='badge bg-info'><i
          className='fa fa-clock'/> {round(moment.duration(moment().diff(moment(data.start))).asMinutes())}</span>&nbsp;
        <span className='badge bg-info'><i className='fa fa-file-import'/> {data['origin'] ?? 'Manual'}</span>&nbsp;
      </div>
    </div>}
    detailView={<pre dangerouslySetInnerHTML={{__html: pp.toHtml(data)}}></pre>}
  />
}

export default CorrectionBolusItem;
