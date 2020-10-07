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
import axiosInstance from "../../../utils/axios";
import {round} from "../../../utils/misc";
import axios from "../../../utils/axios";
import ImageUploader from "../components/ImageUploader";
import {push} from "connected-react-router";
import {useDispatch} from "react-redux";
import TimeSelector from "../components/TimeSelector";
import Meals from "../components/Meals";

const CorrectionMeal = () => {
  const {register, handleSubmit, errors, getValues, watch, setValue} = useForm();
  const [time, setTime] = useState();
  const dispatch = useDispatch();
  const onSubmit = async (...args) => {
    const values = getValues();
    const data = {
      start: time.value,
      typeId: 'CORRECTION_MEAL',
      title: null,
      value: parseFloat(mealsData.totalCarbs),
      meta: {
        factor: getFactorValue(calculateFactor()),
        meals: mealsData,
        originBolus: mealsData.totalKes * getFactorValue(calculateFactor())
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
  const [mealsData, setMealsData] = useState({meals: []});
  const [files, setFiles] = useState([]);

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
        <div className='card-header'>Meals</div>
        <div className='card-body'>
          <Meals data={mealsData} setData={setMealsData} />
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>KEs</div>
        <div className='card-body'>
          <div className='alert alert-primary text-center'>
            <h1>{round(mealsData.totalKes)}</h1>
            <h5>KEs</h5>
          </div>
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Description</div>
        <div className='card-body'>
          <textarea className='form-control' name='description' id='description' ref={register()}></textarea>
        </div>
        <div className='card-footer'>
          <button className='btn btn-primary btn-block' disabled={!mealsData.meals.length}>Create</button>
        </div>
      </div>
    </form>
  </div>
};

CorrectionMeal.propTypes = {};

export default CorrectionMeal
