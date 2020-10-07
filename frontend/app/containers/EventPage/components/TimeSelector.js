import React, {Fragment, useState, useEffect} from 'react';
import moment from "moment";

const TimeSelector = ({onChange}) => {
  const [mode, setMode] = useState('auto');
  const [value, setValue] = useState(moment().format('YYYY-MM-DDTHH:mm'));

  useEffect(() => onChange({mode, value: null}), []);
  return <Fragment>
    <div className='col-12 col-md-10 offset-md-1 text-center'>
      <div className="btn-group btn-block">
        <input type="radio" className="btn-check" name="timeOption" id="timeAutoMode" autoComplete="off"
               value="automatic" defaultChecked checked={mode === 'auto'} onChange={e => {
                 const val = moment().format('YYYY-MM-DDTHH:mm');
                 setMode('auto');
                 setValue(val);
                 onChange({mode: 'auto', value: null});
        }}/>
        <label className="btn btn-secondary" htmlFor="timeAutoMode">Automatic</label>

        <input type="radio" className="btn-check" name="timeOption" id="timeManualMode" autoComplete="off"
               value="manual" checked={mode === 'manual'} onChange={e => {
            setMode('manual');
            onChange({mode: 'manual', value});
        }}/>
        <label className="btn btn-secondary" htmlFor="timeManualMode">Manual</label>
      </div>
    </div>
    <hr />
    <input type="datetime-local" className="form-control" name="start" disabled={mode !== 'manual'} onChange={e => {
      setValue(e.target.value);
      onChange({mode: 'manual', value: e.target.value});
    }} value={value} />
  </Fragment>
}

export default TimeSelector;
