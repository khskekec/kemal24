import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useForm} from "react-hook-form";
import classnames from 'classnames';
import { calculateFactor, getFactorValue } from "../../CalculatorPage/utils";
import axiosInstance from "../../../utils/axios";
import {round} from "../../../utils/misc";

const Bolus = () => {
  const {register, handleSubmit, errors, getValues, watch, setValue} = useForm();
  const onSubmit = data => console.log(data);
  const [meals, setMeals] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showImageContainer, setShowImageContainer] = useState(false);
  const [imageContainerData, setImageContainerData] = useState([]);

  const addMeal = () => {
    const values = getValues();

    setMeals([...meals, {
      title: values.mealTitle,
      carbs: parseFloat(values.mealCarbs),
      weight: parseFloat(values.mealWeight),
      type: 'Per 100g',
      ke: (values.mealCarbs / 100 * values.mealWeight) / 10
    }]);

    setValue('mealTitle', '');
    setValue('mealCarbs', null);
    setValue('mealWeight', null);
  }

  const addPortionMeal = () => {
    const values = getValues();

    setMeals([...meals, {
      title: values.mealPortionTitle,
      carbs: parseFloat(values.mealPortionCarbs),
      weight: 0,
      type: 'Portion',
      ke: values.mealPortionCarbs / 10
    }]);

    setValue('mealTitle', '');
    setValue('mealCarbs', null);
    setValue('mealWeight', null);
  }

  const addSearchMeal = (index, meal) => {
    const values = getValues();
    const weight = values.mealSearchWeight[index];
    setMeals([...meals, {
      title: meal.title,
      carbs: parseFloat(meal.carbs),
      weight: parseFloat(weight),
      type: 'Per 100g',
      ke: (meal.carbs / 100 * weight) / 10
    }]);

    setShowSearch(false);
    setSearchResults([]);
  }

  const search = async () => {
    setSearchLoading(true);
    setShowSearch(true);
    const values = getValues();
    const response = await axiosInstance.get('/food/search', {params: {search: values.mealSearch}});

    setSearchLoading(false);
    setSearchResults(response.data);
  }

  const showImages = images => {
    setImageContainerData(images);
    setShowImageContainer(true);
  };

  let searchContainer = null;
  if (showSearch) {
    searchContainer = <div className='card shadow-lg'>
      <div className='card-header'>
        Search <button onClick={() => {
        setShowSearch(false);
        setSearchResults([])
      }}>Close</button>
      </div>
      <div className='card-body'>
        {searchLoading && <div>Loading</div>}
        {searchResults.length > 0 &&
        <ul className='list-group list-group-flush'>{searchResults.map((e, index) => <li className='list-group-item'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-auto col-md-2'>
                <img src={e.image.front} width='100' height='100'/>
                {/*<img src={e.image.ingredients} width='100' height='100'/>*/}
                {/*<img src={e.image.nutrition} width='100' height='100'/>*/}
                <button className='btn btn-primary btn-block mt-2'
                        onClick={() => showImages(Object.values(e.image))}>Show images
                </button>
              </div>
              <div className='col-auto mt-sm-5 mt-md-0 col-md-10'>
                <h5 className='col-12'>{e.title}</h5>
                <div className='col-12'>
                  <table className='table table-striped table-responsive'>
                    <tbody>
                    <tr>
                      <th>Carbs</th>
                      <td>{e.carbs}</td>
                    </tr>
                    <tr>
                      <th>Energy</th>
                      <td>{e.energy}</td>
                    </tr>
                    <tr>
                      <th>Nutri-Score</th>
                      <td>{e.nutriScore}</td>
                    </tr>
                    <tr>
                      <th>Link</th>
                      <td><a href={e.link} target='_blank'>Show on Open Food Facts</a></td>
                    </tr>
                    <tr>
                      <th>Code</th>
                      <td>{e.code}</td>
                    </tr>
                    <tr>
                      <td>
                        <input type='number' className='form-control' name={`mealSearchWeight[${index}]`}
                               ref={register()}/>
                      </td>
                      <td>
                        <button className='btn btn-primary' onClick={() => addSearchMeal(index, e)}>Add</button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </li>)}</ul>}
      </div>
      {
        showImageContainer && <div className='image-fullscreen-container container-fluid'>
          <div className='row mt-2'>
            <div className='col-2 offset-10 text-right' onClick={() => setShowImageContainer(false)}>
              <div className='btn btn-primary'><i className='fa fa-trash'/></div>
            </div>
          </div>
          <div className='row justify-content-center align-items-center'>
            {imageContainerData.map(e => <div className='col-auto'>
              <img src={e}/>
            </div>)}
          </div>
        </div>
      }
    </div>
  }

  const timeOption = watch('timeOption');
  const mealOptions = watch(['mealTitle', 'mealCarbs', 'mealWeight']);
  const mealPortionOptions = watch(['mealPortionTitle', 'mealPortionCarbs']);
  const mealSearch = watch('mealSearch');
  const manualBolus = watch('manualBolus');

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
            const newMeals = [...meals];
            newMeals.splice(i, 1)
            setMeals(newMeals);
          }}><i className='fa fa-trash'/></button>
        </td>
        <td>{e.title}</td>
        <td>{e.carbs}g</td>
        <td>{e.weight}g</td>
        <td>{e.type}</td>
        <td>{e.ke}</td>
      </tr>
    ) : <tr>
      <td colSpan={5}>No data available</td>
    </tr>}
    </tbody>
    {
      meals.length > 1 && <tfoot>
      <tr>
        <th></th>
        <th></th>
        <th>{meals.reduce((total, e) => total + e.carbs, 0)}g</th>
        <th>{meals.reduce((total, e) => total + e.weight, 0)}g</th>
        <th></th>
        <th>{meals.reduce((total, e) => total + e.ke, 0)} Units</th>
      </tr>
      </tfoot>
    }
  </table>

  return <div className='col'>
    <div className={classnames({'card': true, 'shadow-lg': true, 'd-none': showSearch})}>
      <div className='card-header'>
        Bolus
      </div>
      <div className='card-body'>
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-md-12">
            <label htmlFor="validationCustom01" className="form-label">Time</label>

            <div className='col-4 offset-4'>
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
          <hr/>
          <h2>Meal</h2>
          <hr/>
          <ul className="nav nav-pills mb-3 flex-column flex-sm-row" id="pills-tab" role="tablist">
            <li className="nav-item flex-sm-fill text-sm-center " role="presentation">
              <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab"
                 aria-controls="pills-home" aria-selected="true">Per 100g</a>
            </li>
            <li className="nav-item flex-sm-fill text-sm-center " role="presentation">
              <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab"
                 aria-controls="pills-profile" aria-selected="false">Portion</a>
            </li>
            <li className="nav-item flex-sm-fill text-sm-center " role="presentation">
              <a className="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab"
                 aria-controls="pills-contact" aria-selected="false">Search</a>
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
                  <input type="number" className="form-control" id="mealCarbs" name='mealCarbs' ref={register()}/>
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="mealWeight" className="form-label">Weight</label>
                  <input type="number" className="form-control" id="mealWeight" name='mealWeight' ref={register()}/>
                </div>
                <div className="col-12 mb-5 col-md-4 offset-md-4">
                  <button className='btn btn-primary btn-block' onClick={addMeal}
                          disabled={!mealOptions || Object.values(mealOptions).filter(e => !e).length}>
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
                  <input type="number" className="form-control" id="mealPortionCarbs" name='mealPortionCarbs'
                         ref={register()}/>
                </div>
                <div className="col-12 mb-5 col-md-4 offset-md-4">
                  <button className='btn btn-primary btn-block' onClick={addPortionMeal}
                          disabled={!mealPortionOptions || Object.values(mealPortionOptions).filter(e => !e).length}>
                    <i className='fa fa-plus-circle'></i> Add
                  </button>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="pills-contact" role="tabpanel"
                 aria-labelledby="pills-contact-tab">
              <div className='row mb-3'>
                <div className='col-10'>
                  <input type="text" id="mealSearch" name="mealSearch" placeholder='Enter search term...'
                         className='form-control' defaultValue='' ref={register()}/>
                </div>
                <div className='col-2'>
                  <button className='btn btn-primary btn-block' onClick={search}><i className='fa fa-search'/></button>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 table-responsive'>
            {mealsTable}
          </div>
          <hr/>
          <h2>Bolus</h2>
          <hr />
          <div className='row'>
            <div className='col-6'>
              <h1>
                Standard Bolus
              </h1>
              <div className='row'>
                <div className='col-6'>
                  <div className='alert alert-primary text-center col-auto'>
                    <h1>{getFactorValue(calculateFactor())}</h1>
                    <h5>Current Factor</h5>
                  </div>
                  <div className='alert alert-primary text-center'>
                    <h1>{ round(meals.reduce((total, e) => total + e.ke, 0)) }</h1>
                    <h5>KEs</h5>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='alert alert-success text-center'>
                    <h1>156</h1>
                    <h5>Blood Sugar</h5>
                    <span className='badge bg-primary' style={{position: 'absolute', top: '-3px', right: '-3px'}}><i className='far fa-clock' /> 3 mins ago</span>
                  </div>
                  <div className='alert alert-success text-center'>
                    <h1>10 mins</h1>
                    <h5>Spritz-Ess-Abstand TODO</h5>
                  </div>
                </div>
                <div className='col-12'>
                  <div className='alert alert-success text-center'>
                    <h1>{ round(meals.reduce((total, e) => total + e.ke, 0) * getFactorValue(calculateFactor()))}</h1>
                    <h5>Bolus</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-6'>
              <div className='col-auto align-self-center pl-2'>
                <h1>
                  Manual Bolus
                </h1>
                <div>
                  <label htmlFor="mealTitle" className="form-label">Bolus</label>
                  <input type='number' className='form-control' id="manualBolus" name='manualBolus' ref={register()}/>
                </div>
                <div className='alert alert-info mt-5'>
                  Deviation: { 100-(manualBolus / (round(meals.reduce((total, e) => total + e.ke, 0) * getFactorValue(calculateFactor())))) * 100} %
                </div>
              </div>
            </div>
            <div className='col-12'>
              <div className='row'>
                <div className='col-6'>
                  <button className='btn btn-primary btn-block'>Standard Bolus</button>
                </div>
                <div className='col-6'>
                  <button className='btn btn-primary btn-block'>Manual Bolus</button>
                </div>
              </div>
            </div>
          </div>
          <hr/>
          <div className="col-12">
            <button className="btn btn-primary" type="submit">Submit form</button>
          </div>
        </form>
      </div>
    </div>
    {searchContainer}
  </div>
};

Bolus.propTypes = {};

export default Bolus
