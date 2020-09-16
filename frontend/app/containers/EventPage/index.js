/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, {
  useState,
  useEffect,
  Fragment
} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import BaseTable, {
  AutoResizer,
  Column
} from 'react-base-table';
import axios from '../../utils/axios';
import Table from "./Table";
import {push} from 'connected-react-router';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import {Route} from "react-router-dom";

const key = 'event';

const EventPage = () => {
  const [events, setEvents] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => setEvents((await axios.get('/event')).data);
  const onEventDelete = async id => {
    await axios.delete('/event/' + id);
    await getData();
  }

  if (events === null) {
    return '';
  }

  return (<Fragment>
      <Table events={events} onActionDelete={onEventDelete}/>
      <a href='javascript:void(0)' onClick={() => dispatch(push('/events/create'))}
         style={{position: 'absolute', bottom: '1rem', right: '1rem'}}><i
        className='color-brand bg-white fa fa-4x fa-plus-circle color-primary border-radius-5'/></a>
    </Fragment>
  );
};

EventPage.propTypes = {};

export default EventPage;
