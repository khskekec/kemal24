import React, {
  useEffect,
  useState
} from 'react';
import PropTypes from 'prop-types';
import classnames  from 'classnames';
import {useForm} from "react-hook-form";
import axios from "../../../utils/axios";
import {round} from "../../../utils/misc";
import {push} from "connected-react-router";
import {useDispatch} from "react-redux";
import ImageUploader from "../components/ImageUploader";

const CorrectionBolus = () => {
  const {register, handleSubmit, errors, getValues, watch, setValue} = useForm();
  const [currentBloodSugar, setCurrentBloodSugar] = useState(null);
  const [correction, setCorrection] = useState(0.1);
  const [threshold, setThreshold] = useState(200);
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();

  const onSubmit = async (...args) => {
    const values = getValues();
    const data = {
      start: timeOption === 'automatic' ? (new Date()).toISOString() : values.start,
      typeId: 'CORRECTION_BOLUS',
      meta: {
        type: values.bolusType,
        originValue: (realCurrentBloodSugar - threshold) / 10 * correction,
        bloodSugar: realCurrentBloodSugar
      },
      attachments: files,
      value: values.bolusType === 'automatic' ? (realCurrentBloodSugar - threshold) / 10 * correction : values.value,
      description: values.description
    };

    try {
      const response = await axios.post('/event', data);

      dispatch(push('/events'));
    } catch(e) {
      alert(e);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await axios.get('/bloodSugar/current');
      setCurrentBloodSugar(response.data);
    })();
  }, []);

  const timeOption = watch('timeOption');
  const bolusType = watch('bolusType');
  const realCurrentBloodSugar = watch('realCurrentBloodSugar');
  const correctionBolus = (realCurrentBloodSugar - threshold) / 10 * correction;
  const noCorrectionRequired = correctionBolus <= 0;
  const isAutomatic = bolusType === 'automatic';
  const isTimeAutomatic = timeOption === 'automatic';

  return <div className='col'>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Time</div>
        <div className='card-body'>
          <div className="col-md-12">
            <div className='col-10 offset-1 text-center'>
              <div className="btn-group">
                <input type="radio" className="btn-check" name="timeOption" id="option1" autoComplete="off"
                       value="automatic" defaultChecked ref={register()}/>
                <label className="btn btn-secondary" htmlFor="option1">Automatic</label>

                <input type="radio" className="btn-check" name="timeOption" id="option2" autoComplete="off"
                       value="manual" ref={register()}/>
                <label className="btn btn-secondary" htmlFor="option2">Manual</label>
              </div>
            </div>
            <br/>
            <input type="datetime-local" className="form-control" className={ classnames('form-control', {'d-none': isTimeAutomatic}) } name="start" id="validationCustom01"
                   ref={register()} disabled={timeOption !== 'manual'} />
                   <div className={classnames('alert alert-info', {'d-none': !isTimeAutomatic})}>
                     Time will be setted automatically on event creation
                   </div>
          </div>
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Attachments</div>
        <div className='card-body'>
          <ImageUploader onChange={setFiles}/>
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Correction Bolus</div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-4'>
              <div className='alert alert-info text-center'>
                <h1>{currentBloodSugar ? currentBloodSugar.value : 'N/A'}</h1>
                <h5>Blood Sugar</h5>
                {currentBloodSugar &&
                <span className='badge bg-primary' style={{position: 'absolute', top: '-3px', right: '-3px'}}><i
                  className='far fa-clock'/> {round(currentBloodSugar.minutesAgo)} minutes ago</span>}
              </div>
            </div>
            <div className='col-4'>
              <div className='alert alert-info text-center'>
                <h1>{threshold}</h1>
                <h5>Correction Threshold</h5>
              </div>
            </div>
            <div className='col-4'>
              <div className='alert alert-info text-center'>
                <h1>{correction} Units</h1>
                <h5>Insulin units per 10 over sugar</h5>
              </div>
            </div>
            <div className='col-12'>
              { noCorrectionRequired ? <div className='alert alert-info text-center'>
                No correction required
              </div> :  <div className='alert alert-info text-center'>
                <h1>{correctionBolus} Units</h1>
                <h5>Correction insulin</h5>
              </div> }
            </div>
          </div>
          <div className='col-10 offset-1 text-center'>
            <div className="btn-group">
              <input type="radio" className="btn-check" name="bolusType" id="bolusTypeOption1" autoComplete="off"
                     value="automatic" defaultChecked ref={register()}/>
              <label className="btn btn-secondary" htmlFor="bolusTypeOption1">Automatic</label>

              <input type="radio" className="btn-check" name="bolusType" id="bolusTypeOption2" autoComplete="off"
                     value="manual" ref={register()}/>
              <label className="btn btn-secondary" htmlFor="bolusTypeOption2">Manual</label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="realCurrentBloodSugar" className="form-label">Real Blood Sugar</label>
            <input type="number" step=".01" className="form-control" id="realCurrentBloodSugar" name='realCurrentBloodSugar' ref={register()}
                   defaultValue={currentBloodSugar ? currentBloodSugar.value : null} onBlur={ e => { e.target.value.length === 0 ? setValue('realCurrentBloodSugar', currentBloodSugar.value) : null}} />
          </div>
          <div className={ classnames('mb-4', { 'd-none': isAutomatic }) }>
            <label htmlFor="bolus" className="form-label">Bolus</label>
            <input type="number" step=".01" className="form-control" id="bolus" name='bolus' ref={register()} disabled={noCorrectionRequired} />
          </div>
          <div className={ classnames('mb-4', 'alert', 'alert-info', 'd-none', { 'd-block': noCorrectionRequired && !isAutomatic}) }>
            You cannot enter a manual bolus because there is no need for a correction for the given blood sugar value
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea className="form-control" id="description" name='description' ref={register()}/>
          </div>
        </div>
        <div className='card-footer'>
          <button className='btn btn-primary btn-block' disabled={noCorrectionRequired}>Create</button>
        </div>
      </div>
    </form>
  </div>
};

CorrectionBolus.propTypes = {};

export default CorrectionBolus
