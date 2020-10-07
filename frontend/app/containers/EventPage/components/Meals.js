import React, {Fragment, useState, useEffect} from 'react';
import {useForm} from "react-hook-form";
import axios from "../../../utils/axios";
import {round} from "../../../utils/misc";

const PER_100_G_TYPE = 'p100g';
const PER_PORTION = 'pPortion';

const calculateKEs = (type, {carbs, weight}) => {
  return type === PER_100_G_TYPE ? (carbs / 100 * weight) / 10 : carbs / 10;
}

const createMeal = (title, carbs, weight, type) => ({
  title,
  carbs: parseFloat(carbs),
  weight: parseFloat(weight),
  type,
  ke: calculateKEs(type, {carbs, weight})
});

const Meals = ({data, setData}) => {
  const {register, watch, errors, setValue, getValues} = useForm();

  const mealOptions = watch(['mealTitle', 'mealCarbs', 'mealWeight']);
  const mealPortionOptions = watch(['mealPortionTitle', 'mealPortionCarbs']);

  useEffect(() => setData({
    totalCarbs: 0,
    totalKes: 0,
    totalWeight: 0,
    meals: [],
  }), []);

  const meals = data.meals || [];

  const updateMeals = meals => {
    setData({
      totalCarbs: meals.reduce((total, e) => total + e.carbs, 0),
      totalKes: meals.reduce((total, e) => total + e.ke, 0),
      totalWeight: meals.reduce((total, e) => total + e.weight, 0),
      meals: meals
    });
  }

  const addPosition = mealData => {
    const newMeals = [...data.meals, mealData];

    updateMeals(newMeals);
  }

  const addMeal = () => {
    const values = getValues();
    addPosition(createMeal(values.mealTitle, values.mealCarbs, values.mealWeight, PER_100_G_TYPE))

    setValue('mealTitle', '');
    setValue('mealCarbs', null);
    setValue('mealWeight', null);
  }

  const addPortionMeal = () => {
    const values = getValues();
    addPosition(createMeal(values.mealPortialTitle, values.mealPortionCarbs, 0, PER_PORTION))

    setValue('mealPortionTitle', '');
    setValue('mealPortionCarbs', null);
  }

  const mealsTable = <table className='table align-middle'>
    <thead className='table-dark'>
    <tr>
      <th></th>
      <th>Title</th>
      <th>Carbs</th>
      <th>Weight</th>
      <th>Type</th>
      <th>KE</th>
    </tr>
    </thead>
    <tbody>
    {meals.length > 0 ? meals.map((e, i) =>
      <tr key={i}>
        <td>
          <button className='btn btn-danger' onClick={() => {
            const newMeals = [...data.meals];
            newMeals.splice(i, 1)
            updateMeals(newMeals);

          }} type="button"><i className='fa fa-trash'/></button>
        </td>
        <td>{e.title}</td>
        <td>{e.carbs}g</td>
        <td>{e.weight}g</td>
        <td>{e.type}</td>
        <td>{round(e.ke)}</td>
      </tr>
    ) : <tr>
      <td colSpan={6}>No data available</td>
    </tr>}
    </tbody>
    {
      meals.length > 1 && <tfoot>
      <tr>
        <th></th>
        <th></th>
        <th>{data.totalCarbs}g</th>
        <th>{data.totalWeight}g</th>
        <th></th>
        <th>{round(data.totalKes)} Units</th>
      </tr>
      </tfoot>
    }
  </table>

  return <Fragment>
    <ul className="nav nav-pills mb-3 flex-column flex-sm-row" id="pills-tab" role="tablist">
      <li className="nav-item flex-sm-fill text-sm-center " role="presentation">
        <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab"
           aria-controls="pills-home" aria-selected="true">Per 100g</a>
      </li>
      <li className="nav-item flex-sm-fill text-sm-center " role="presentation">
        <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab"
           aria-controls="pills-profile" aria-selected="false">Portion</a>
      </li>
    </ul>
    <hr/>
    <div className="tab-content" id="pills-tabContent">
      <div className="tab-pane fade show active" id="pills-home" role="tabpanel"
           aria-labelledby="pills-home-tab">
        <div className='row'>
          <div className="col-md-4 mb-3">
            <label htmlFor="mealTitle" className="form-label">Title</label>
            <input type="input" className="form-control" id="mealTitle" name='mealTitle' ref={register()}/>
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="mealCarbs" className="form-label">Carbs 100g</label>
            <input type="number" step=".01" className="form-control" id="mealCarbs" name='mealCarbs' ref={register()}/>
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="mealWeight" className="form-label">Weight</label>
            <input type="number" step=".01" className="form-control" id="mealWeight" name='mealWeight'
                   ref={register()}/>
          </div>
          <div className="col-12 col-md-4 offset-md-4">
            <button className='btn btn-primary btn-block' onClick={addMeal}
                    disabled={!mealOptions || Object.values(mealOptions).filter(e => !e).length} type="button">
              <i className='fa fa-plus-circle'></i> Add
            </button>
          </div>
        </div>
      </div>
      <div className="tab-pane fade" id="pills-profile" role="tabpanel"
           aria-labelledby="pills-profile-tab">
        <div className='row'>
          <div className="col-md-6 mb-3">
            <label htmlFor="mealTitle" className="form-label">Title</label>
            <input type="input" className="form-control" id="mealPortionTitle" name='mealPortionTitle'
                   ref={register()}/>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="mealCarbs" className="form-label">Carbs per Portion</label>
            <input type="number" step=".01" className="form-control" id="mealPortionCarbs" name='mealPortionCarbs'
                   ref={register()}/>
          </div>
          <div className="col-12 col-md-4 offset-md-4">
            <button className='btn btn-primary btn-block' onClick={addPortionMeal}
                    disabled={!mealPortionOptions || Object.values(mealPortionOptions).filter(e => !e).length}
                    type="button">
              <i className='fa fa-plus-circle'></i> Add
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr/>
    {mealsTable}
  </Fragment>
}

export default Meals;
