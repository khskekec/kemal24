/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, {
  Fragment
} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import axios from '../../utils/axios';
import Table from "./Table";
import {push} from 'connected-react-router';
import {
  useDispatch,
} from 'react-redux';
import {Route} from "react-router-dom";
import {useAjaxData} from "../../utils/hooks";
import CorrectionMeal from "./types/CorrectionMeal";
import GenericItem from "./components/Items/GenericItem";
import BloodSugarItem from "./components/Items/BloodSugarItem";
import LoadingIndicator from "../../components/LoadingIndicator";
import BolusItem from "./components/Items/BolusItem";
import CorrectionMealItem from "./components/Items/CorrectionMealItem";
import CorrectionBolusItem from "./components/Items/CorrectionBolusItem";

const key = 'event';

const EventPage = () => {
  const {isLoading, failure, getData, reload} = useAjaxData({method: 'GET', url: '/event'});
  const dispatch = useDispatch();

  const onEventDelete = async id => {
    await axios.delete('/event/' + id);
    await reload();
  }

  if (isLoading) {
    return <LoadingIndicator />
  }

  if (failure) {
    alert('Something went wrong');
  }

  const render = item => {
    // console.log(item);

    switch (item.EventType.constant) {
      case 'BLOOD_SUGAR':
        return <BloodSugarItem data={item} />
      case 'BOLUS':
        return <BolusItem data={item} />
      case 'CORRECTION_BOLUS':
        return <CorrectionBolusItem data={item} />
      case 'CORRECTION_MEAL':
        return <CorrectionMealItem data={item} />
      default:
        return <GenericItem data={item} />
    }
  }

  return (<Fragment>
      <ul className='list-group list-group-flush'>
        {getData().map(e => render(e))}
      </ul>
      <a href='javascript:void(0)' onClick={() => dispatch(push('/events/create'))}
         style={{position: 'absolute', bottom: '1rem', right: '1rem'}}><i
        className='color-brand bg-white fa fa-4x fa-plus-circle color-primary border-radius-5'/></a>
    </Fragment>
  );
};

EventPage.propTypes = {};

export default EventPage;
