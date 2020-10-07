import React, {
  useState,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import {useForm} from "react-hook-form";
import classnames from 'classnames';
import {
  calculateFactor,
  getFactorConfiguration,
  getFactorValue
} from "../../CalculatorPage/utils";
import injectionMealInterval from "../../../utils/injectionMealInterval";
import {round} from "../../../utils/misc";
import axios from "../../../utils/axios";
import ImageUploader from "../components/ImageUploader";
import {push} from "connected-react-router";
import {useDispatch} from "react-redux";
import TimeSelector from "../components/TimeSelector";
import Meals from "../components/Meals";

const Bolus = () => {
  const {register, handleSubmit, errors, getValues, watch, setValue} = useForm();
  const [time, setTime] = useState();
  const dispatch = useDispatch();

  const autoFactor = getFactorValue(calculateFactor());
  const onSubmit = async (...args) => {
    const values = getValues();

    const data = {
      start: time.value,
      end: time.value,
      typeId: 'BOLUS',
      title: null,
      bolusType,
      value: bolusType === 'automatic' ?
        mealsData.totalKes * autoFactor :
          bolusType === 'manual' ? parseFloat(manualBolus) : mealsData.totalKes * manualFactor,
      meta: {
        originalBolus: mealsData.totalKes * autoFactor,
        originalFactor: autoFactor,
        factor: bolusType === 'manualFactor' ? manualFactor : autoFactor,
        deviation: (100 - (manualBolus / (round(mealsData.totalKes * autoFactor))) * 100) * -1,
        meals: mealsData
      },
      attachments: files,
      description: values.description
    };

    try {
      const response = await axios.post('/event', data);

      dispatch(push('/events'));
    } catch(e) {
      alert(e);
    }
  };
  const [currentBloodSugar, setCurrentBloodSugar] = useState(null);
  const [files, setFiles] = useState([]);
  const [mealsData, setMealsData] = useState({meals: []});

  useEffect(() => {
    (async () => {
      const response = await axios.get('/bloodSugar/current');

      setCurrentBloodSugar(response.data);
    })();
  }, []);

  const manualBolus = watch('manualBolus');
  const manualFactor = watch('manualFactor');
  const bolusType = watch('bolusType');
  const {meals} = mealsData;

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
          <ImageUploader onChange={setFiles} />
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Meal</div>
        <div className='card-body'>
          <Meals data={mealsData} setData={setMealsData}/>
        </div>
      </div>
      <div className={ classnames('card', 'shadow-lg', 'mb-3', { 'd-none': meals.length === 0 })}>
        <div className='card-header'>Bolus</div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-12'>
              <div className='row'>
                <div className='col-12 col-md-3'>
                  <div className='alert alert-primary text-center col-auto'>
                    <h1>{autoFactor}</h1>
                    <span className='badge bg-primary' style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px'
                    }}>{getFactorConfiguration(calculateFactor()).start} - {getFactorConfiguration(calculateFactor()).end} </span>
                    <h5>Factor</h5>
                  </div>
                </div>
                <div className='col-12 col-md-3'>
                  <div className='alert alert-primary text-center'>
                    <h1>{round(mealsData.totalKes)}</h1>
                    <h5>KEs</h5>
                  </div>
                </div>
                <div className='col-12 col-md-3'>
                  <div className='alert alert-success text-center'>
                    <h1>{currentBloodSugar ? currentBloodSugar.value : 'N/A'}</h1>
                    <h5>Blood Sugar</h5>

                    {currentBloodSugar &&
                    <span className='badge bg-primary' style={{position: 'absolute', top: '-3px', right: '-3px'}}><i
                      className='far fa-clock'/> {round(currentBloodSugar.minutesAgo)} minutes ago</span>}
                  </div>
                </div>
                <div className='col-12 col-md-3'>
                  <div className='alert alert-success text-center'>
                    <h1>{currentBloodSugar ? injectionMealInterval(currentBloodSugar.value) + ' mins' : 'N/A'}</h1>
                    <h5>Injection-Meal-Distance</h5>
                  </div>
                </div>
                <div className='col-12'>
                  <div className='alert alert-info text-center'>
                    <h1>{round(mealsData.totalKes * autoFactor)} Units</h1>
                    <h5>Bolus</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12'>
              <div className='col-10 offset-1 text-center'>
                <div className="btn-group">
                  <input type="radio" className="btn-check" name="bolusType" id="bolusTypeOption1" autoComplete="off"
                         value="automatic" defaultChecked ref={register()}/>
                  <label className="btn btn-secondary" htmlFor="bolusTypeOption1">Automatic</label>

                  <input type="radio" className="btn-check" name="bolusType" id="bolusTypeOption2" autoComplete="off"
                         value="manual" ref={register()}/>
                  <label className="btn btn-secondary" htmlFor="bolusTypeOption2">Manual Bolus</label>

                  <input type="radio" className="btn-check" name="bolusType" id="bolusTypeOption3" autoComplete="off"
                         value="manualFactor" ref={register()}/>
                  <label className="btn btn-secondary" htmlFor="bolusTypeOption3">Manual Factor</label>
                </div>
              </div>
              <div className={classnames('mb-3', { 'd-none': bolusType !== 'manual' })}>
                <label htmlFor="manualBolus" className="form-label">Bolus</label>
                <input type='number' className='form-control' id="manualBolus" name='manualBolus' step="0.01" defaultValue='' ref={register()}/>
              </div>
              <div className={classnames('mb-3', { 'd-none': bolusType !== 'manualFactor' })}>
                <label htmlFor="manualBolus" className="form-label">Factor</label>
                <input type='number' className='form-control' id="manualFactor" name='manualFactor' step="0.01" defaultValue={autoFactor} ref={register()} />
                <div className='alert alert-primary col-12 mt-3 text-center'>
                  <h1>{round(mealsData.totalKes * manualFactor)}</h1>
                  <h5>Bolus</h5>
                </div>
              </div>
              <div className={classnames('alert', 'alert-info', 'mt-5', {'d-none': meals.length === 0 || (manualBolus && manualBolus.length) === 0 || bolusType !== 'manual'})}>
                <h4>You are entering a manual bolus</h4>
                Deviation: {(100 - (manualBolus / (round(mealsData.totalKes * autoFactor))) * 100) * -1} %
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={ classnames('card', 'shadow-lg', 'mb-3', { 'd-none': meals.length === 0 })}>
        <div className='card-header'>Description</div>
        <div className='card-body'>
            <textarea className='form-control' name='description' id='description' ref={register()}></textarea>
        </div>
        <div className='card-footer'>
          <button className='btn btn-primary btn-block'>Create</button>
        </div>
      </div>
    </form>
  </div>
};

Bolus.propTypes = {};

export default Bolus
