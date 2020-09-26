import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const DateRangePicker = ({onChange}) => {
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [daysInPast, setDaysInPast] = useState(0);

  const handleStartEnd = () => onChange({start, end});
  const handleDaysInPast = () => onChange({start: moment().subtract(daysInPast, 'd').format('YYYY-MM-DD'), end: null});


  return <div className='container-fluid'>
    <div className='row'>
      <div className='col-12' style={{backgroundColor: '#dce3de'}}>
        <ul className="nav nav-pills flex-column flex-sm-row m-4" id="pills-tab" role="tablist">
          <li className="nav-item flex-sm-fill text-sm-center" role="presentation">
            <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab"
               aria-controls="pills-home" aria-selected="true">Start - End</a>
          </li>
          <li className="nav-item flex-sm-fill text-sm-center" role="presentation">
            <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab"
               aria-controls="pills-profile" aria-selected="false">Days in past</a>
          </li>
          <li className="nav-item flex-sm-fill text-sm-center" role="presentation">
            <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab"
               aria-controls="pills-contact" aria-selected="false">Presets</a>
          </li>
        </ul>
      </div>
    </div>
    <hr/>
    <div className='row'>
      <div className="tab-content" id="pills-tabContent">
        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
          <div className='row'>
            <div className='col-6'>
              <label>Start</label>
              <input type='datetime-local' className='form-control' value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div className='col-6'>
              <label>End</label>
              <input type='datetime-local' className='form-control' value={end} onChange={e => setEnd(e.target.value)}/>
            </div>
          </div>
          <hr/>
          <div className='col-12 mt-2'>
            <button type='button' className='btn btn-primary btn-block' onClick={handleStartEnd} disabled={!start || !end}>OK</button>
          </div>
        </div>
        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
          <div className='row'>
            <div className='col-12'>
              <input type='number' className='form-control form-control-lg' placeholder='Days in past from today..' value={daysInPast} onChange={e => setDaysInPast(e.target.value)}/>
            </div>
          </div>
          <hr/>
          <div className='col-12 mt-2'>
            <button type='button' className='btn btn-primary btn-block' disabled={!daysInPast} onClick={handleDaysInPast}>OK</button>
          </div>
        </div>
        <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">cvcvcv
        </div>
      </div>
    </div>
  </div>
}

export default DateRangePicker
