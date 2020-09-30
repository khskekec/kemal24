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

const key = 'event';

const EventPage = () => {
  const {isLoading, failure, getData, reload} = useAjaxData({method: 'GET', url: '/event'});
  const dispatch = useDispatch();

  const onEventDelete = async id => {
    await axios.delete('/event/' + id);
    await reload();
  }

  if (isLoading) {
    return <h1>LOADING</h1>;
  }

  if (failure) {
    alert('Something went wrong');
  }

  return (<Fragment>
      <Table events={getData()} onActionDelete={onEventDelete}/>
      <a href='javascript:void(0)' onClick={() => dispatch(push('/events/create'))}
         style={{position: 'absolute', bottom: '1rem', right: '1rem'}}><i
        className='color-brand bg-white fa fa-4x fa-plus-circle color-primary border-radius-5'/></a>
    </Fragment>
  );
};

EventPage.propTypes = {};

export default EventPage;
