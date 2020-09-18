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
import axiosInstance from "../../../utils/axios";
import {round} from "../../../utils/misc";
import axios from "../../../utils/axios";
import {push} from "connected-react-router";
import {useDispatch} from "react-redux";

const Bolus = () => {
  const {register, handleSubmit, errors, getValues, watch, setValue} = useForm();
  const dispatch = useDispatch();
  const onSubmit = async (...args) => {
    const values = getValues();
    const data = {
      start: timeOption === 'automatic' ? (new Date()).toISOString() : values.start,
      typeId: 'BOLUS',
      title: null,
      bolusType,
      originBolus: meals.reduce((total, e) => total + e.ke, 0) * getFactorValue(calculateFactor()),
      value: bolusType === 'automatic' ?  meals.reduce((total, e) => total + e.ke, 0) * getFactorValue(calculateFactor()) : parseFloat(manualBolus),
      meta: {
        factor: getFactorValue(calculateFactor()),
        meals: meals,
        totalCarbs: meals.reduce((total, e) => total + e.carbs, 0),
        totalKe: meals.reduce((total, e) => total + e.ke, 0)
      },
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
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showImageContainer, setShowImageContainer] = useState(false);
  const [imageContainerData, setImageContainerData] = useState([]);
  const [currentBloodSugar, setCurrentBloodSugar] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get('/bloodSugar/current');

      setCurrentBloodSugar(response.data);
    })();
  }, []);

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
    const response = await axios.get('/food/search', {params: {search: values.mealSearch}});

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
  const manualBolus = watch('manualBolus');
  const bolusType = watch('bolusType');

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
        <th>{meals.reduce((total, e) => total + e.carbs, 0)}g</th>
        <th>{meals.reduce((total, e) => total + e.weight, 0)}g</th>
        <th></th>
        <th>{round(meals.reduce((total, e) => total + e.ke, 0))} Units</th>
      </tr>
      </tfoot>
    }
  </table>

  return <div className='col'>
    <form className={ classnames({'d-none': showSearch}) } onSubmit={handleSubmit(onSubmit)}>
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
        <div className='card-header'>Meal</div>
        <div className='card-body'>
          <div className="col-md-12">
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
                  <div className="col-12 col-md-4 offset-md-4">
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
                  <div className="col-12 col-md-4 offset-md-4">
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
                    <button className='btn btn-primary btn-block' onClick={search}><i className='fa fa-search'/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col-12'>
        <div className='table-responsive'>
        {mealsTable}
        </div>
      </div>
      <div className={ classnames('card', 'shadow-lg', 'mb-3', { 'd-none': meals.length === 0 })}>
        <div className='card-header'>Bolus</div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-12'>
              <div className='row'>
                <div className='col-3'>
                  <div className='alert alert-primary text-center col-auto'>
                    <h1>{getFactorValue(calculateFactor())}</h1>
                    <span className='badge bg-primary' style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px'
                    }}>{getFactorConfiguration(calculateFactor()).start} - {getFactorConfiguration(calculateFactor()).end} </span>
                    <h5>Factor</h5>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='alert alert-primary text-center'>
                    <h1>{round(meals.reduce((total, e) => total + e.ke, 0))}</h1>
                    <h5>KEs</h5>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='alert alert-success text-center'>
                    <h1>{currentBloodSugar ? currentBloodSugar.value : 'N/A'}</h1>
                    <h5>Blood Sugar</h5>

                    {currentBloodSugar &&
                    <span className='badge bg-primary' style={{position: 'absolute', top: '-3px', right: '-3px'}}><i
                      className='far fa-clock'/> {round(currentBloodSugar.minutesAgo)} minutes ago</span>}
                  </div>
                </div>
                <div className='col-3'>
                  <div className='alert alert-success text-center'>
                    <h1>{currentBloodSugar ? injectionMealInterval(currentBloodSugar.value) + ' mins' : 'N/A'}</h1>
                    <h5>Injection-Meal-Distance</h5>
                  </div>
                </div>
                <div className='col-12'>
                  <div className='alert alert-info text-center'>
                    <h1>{round(meals.reduce((total, e) => total + e.ke, 0) * getFactorValue(calculateFactor()))} Units</h1>
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
                  <label className="btn btn-secondary" htmlFor="bolusTypeOption2">Manual</label>
                </div>
              </div>
              <div className={classnames('mb-3', { 'd-none': bolusType === 'automatic' })}>
                <label htmlFor="manualBolus" className="form-label">Bolus</label>
                <input type='number' className='form-control' id="manualBolus" name='manualBolus' step="0.01" defaultValue='' ref={register()}/>
              </div>
              <div className={classnames('alert', 'alert-info', 'mt-5', {'d-none': meals.length === 0 || (manualBolus && manualBolus.length) === 0 || bolusType === 'automatic'})}>
                <h4>You are entering a manual bolus</h4>
                Deviation: {100 - (manualBolus / (round(meals.reduce((total, e) => total + e.ke, 0) * getFactorValue(calculateFactor())))) * 100} %
              </div>
              <div>
                <label htmlFor="mealTitle" className="form-label">Description</label>
                <textarea className='form-control' name='description' id='description' ref={register()}></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className='card-footer'>
          <button className='btn btn-primary btn-block'>Create</button>
        </div>
      </div>
    </form>
    {searchContainer}
  </div>
};

Bolus.propTypes = {};

export default Bolus
