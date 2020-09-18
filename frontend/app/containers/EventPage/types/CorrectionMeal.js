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

const CorrectionMeal = () => {
  const {register, handleSubmit, errors, getValues, watch, setValue} = useForm();
  const dispatch = useDispatch();
  const onSubmit = async (...args) => {
    const values = getValues();
    const data = {
      start: timeOption === 'automatic' ? (new Date()).toISOString() : values.start,
      typeId: 'CORRECTION_MEAL',
      title: null,
      originBolus: meals.reduce((total, e) => total + e.ke, 0) * getFactorValue(calculateFactor()),
      value: parseFloat(),
      meta: {
        factor: getFactorValue(calculateFactor()),
        meals: meals,
        totalCarbs: meals.reduce((total, e) => total + e.carbs, 0),
        totalKe: meals.reduce((total, e) => total + e.ke, 0)
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
  const [meals, setMeals] = useState([]);
  const [files, setFiles] = useState([]);

  const timeOption = watch('timeOption');
  const manualBolus = watch('manualBolus');
  const mealOptions = [
    {
      title: 'Dextro Mini',
      carbsPerUnit: 78,
      splitteable: true,
    },
    {
      title: 'Dextro Max',
      carbsPerUnit: 150,
      splitteable: true,
    },
    {
      title: 'Brandt Vollkorn Zwieback',
      carbsPerUnit: 6,
      splitteable: false,
    }
  ];

  const addMeal = i => {
    const values = getValues();
    const meal = mealOptions[i];
    const data = {
      title: meal.title,
      totalCarbs: meal.carbsPerUnit,
      nettoCarbs: meal.splitteable ? meal.carbsPerUnit * values['mealOption' + i] : meal.carbsPerUnit,
      amount: meal.splitteable ? values['mealOption' + i] : 1
    };

    data.ke = data.nettoCarbs / 10;

    setMeals([...meals, data]);
  }

  const deleteMeal = (i) => {
    const newMeals = [...meals];
    newMeals.splice(i, 1)
    setMeals(newMeals);
  }

  const totalKEs = meals.reduce( (total, e) => total + e.ke, 0 );

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
            <input type="datetime-local" className="form-control" name="start" id="validationCustom01"
                   ref={register()} disabled={timeOption !== 'manual'}/>
          </div>
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Options</div>
        <div className='card-body table-responsive'>
          <table className='table'>
            <tbody>
            { mealOptions.map((e, i) => {
              return <tr>
                <td>{e.title}</td>
                <td>{e.carbsPerUnit}g</td>
                {e.splitteable ? <td>
                  <div className="btn-group btn-group-sm">
                    <input type="radio" className="btn-check" name={`mealOption${i}`} id={`mealOption${i}_quarter`} autoComplete="off"
                           value="0.25" defaultChecked ref={register()}/>
                    <label className="btn btn-secondary" htmlFor={`mealOption${i}_quarter`}>1/4</label>

                    <input type="radio" className="btn-check" name={`mealOption${i}`} id={`mealOption${i}_half`} autoComplete="off"
                           value="0.5" ref={register()}/>
                    <label className="btn btn-secondary" htmlFor={`mealOption${i}_half`}>1/2</label>

                    <input type="radio" className="btn-check" name={`mealOption${i}`} id={`mealOption${i}_quarter1`} autoComplete="off"
                           value="0.75" ref={register()}/>
                    <label className="btn btn-secondary" htmlFor={`mealOption${i}_quarter1`}>3/4</label>

                    <input type="radio" className="btn-check" name={`mealOption${i}`} id={`mealOption${i}_full`} autoComplete="off"
                           value="1" ref={register()}/>
                    <label className="btn btn-secondary" htmlFor={`mealOption${i}_full`}>1</label>
                  </div>
                </td> : <td></td>}
                <td>
                  <button className='btn btn-primary btn-block' onClick={() => addMeal(i)}><i className='fa fa-plus' /></button>
                </td>
              </tr>
            }) }
            </tbody>
          </table>
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Meal</div>
        <div className='card-body table-responsive'>
          {meals.length > 0 ?
          <table className='table'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Carbs per 100g</th>
                <th>Carbs in portion</th>
                <th>Amount</th>
                <th>KE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {meals.map((e,i) => <tr>
              <td>{e.title}</td>
              <td>{e.totalCarbs}</td>
              <td>{e.nettoCarbs}</td>
              <td>{e.amount}</td>
              <td>{e.ke}</td>
              <td><button className='btn btn-danger' onClick={() => deleteMeal(i)}><i className='fa fa-trash' /></button> </td>
            </tr>)}
            </tbody>
          </table> :
            <div className='alert alert-info'>
              No Meals added yet
            </div>
          }
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Attachments</div>
        <div className='card-body'>
          <ImageUploader onChange={setFiles}/>
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>KEs</div>
        <div className='card-body'>
          <div className='alert alert-primary text-center'>
            <h1>{round(totalKEs)}</h1>
            <h5>KEs</h5>
          </div>
        </div>
        <div className='card-footer'>
          <button className='btn btn-primary btn-block' disabled={!meals.length}>Create</button>
        </div>
      </div>
    </form>
  </div>
};

CorrectionMeal.propTypes = {};

export default CorrectionMeal
