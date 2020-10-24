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
import TimeSelector from "../components/TimeSelector";

const CorrectionBolus = () => {
  const {register, handleSubmit, errors, getValues, watch, setValue} = useForm();
  const [currentBloodSugar, setCurrentBloodSugar] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [correction, setCorrection] = useState(0.1);
  const [threshold, setThreshold] = useState(200);
  const [files, setFiles] = useState([]);
  const [time, setTime] = useState();
  const dispatch = useDispatch();

  const calculateOriginalCorrection = () => (realCurrentBloodSugar - threshold) / 10 * correction;

  const onSubmit = async (...args) => {
    setLoading(true);
    const values = getValues();
    const data = {
      start: time.value,
      typeId: 'CORRECTION_BOLUS',
      meta: {
        type: values.bolusType,
        originValue: calculateOriginalCorrection(),
        bloodSugar: realCurrentBloodSugar
      },
      attachments: files,
      value: values.bolusType === 'automatic' ? calculateOriginalCorrection() : values.bolus,
      description: values.description
    };

    try {
      const response = await axios.post('/event', data);

      dispatch(push('/events'));
    } catch(e) {
      setLoading(false);
      alert(e);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await axios.get('/bloodSugar/current');
      setCurrentBloodSugar(response.data);
      setValue('realCurrentBloodSugar', response.data.value);
    })();
  }, []);

  const bolusType = watch('bolusType');
  const realCurrentBloodSugar = watch('realCurrentBloodSugar');
  const correctionBolus = calculateOriginalCorrection();
  const noCorrectionRequired = correctionBolus <= 0;
  const isAutomatic = bolusType === 'automatic';

  return <div className='col'>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Time</div>
        <div className='card-body'>
          <div className="col-md-12">
            <TimeSelector onChange={setTime} />
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
            <div className='col-12 col-md-4'>
              <div className='alert alert-info text-center'>
                <h1>{currentBloodSugar ? currentBloodSugar.value : 'N/A'}</h1>
                <h5>Blood Sugar</h5>
                {currentBloodSugar &&
                <span className='badge bg-primary' style={{position: 'absolute', top: '-3px', right: '-3px'}}><i
                  className='far fa-clock'/> {round(currentBloodSugar.minutesAgo)} minutes ago</span>}
              </div>
            </div>
            <div className='col-12 col-md-4'>
              <div className='alert alert-info text-center'>
                <h1>{threshold}</h1>
                <h5>Correction Threshold</h5>
              </div>
            </div>
            <div className='col-12 col-md-4'>
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
          <div className='col-12 col-md-10 offset-md-1 text-center'>
            <div className="btn-group btn-block">
              <input type="radio" className="btn-check" name="bolusType" id="bolusTypeOption1" autoComplete="off"
                     value="automatic" defaultChecked ref={register()}/>
              <label className="btn btn-secondary" htmlFor="bolusTypeOption1">Automatic</label>

              <input type="radio" className="btn-check" name="bolusType" id="bolusTypeOption2" autoComplete="off"
                     value="manual" ref={register()}/>
              <label className="btn btn-secondary" htmlFor="bolusTypeOption2">Manual</label>
            </div>
          </div>
          <hr />
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
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Description</div>
        <div className='card-body'>
            <textarea className="form-control" id="description" name='description' ref={register()}/>
        </div>
        <div className='card-footer'>
          <button className='btn btn-primary btn-block' disabled={noCorrectionRequired || isLoading}>Create</button>
        </div>
      </div>
    </form>
  </div>
};

CorrectionBolus.propTypes = {};

export default CorrectionBolus
