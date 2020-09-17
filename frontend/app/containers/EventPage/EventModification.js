/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, {
  useState,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import axios from '../../utils/axios';
import moment from 'moment';
import Bolus from "./types/Bolus";

const EventModification = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [eventType, setEventType] = useState('BLOOD_SUGAR');

  useEffect(() => {
    (async () => {
      const response = await axios.get('/event/types');

      setEventTypes(response.data);
    })();
  }, []);

  if (!eventTypes) return null;

  const saveHandler = async () => {
    const response = await axios.post('/event', {
      title: null,
      value,
      typeId: eventType,
      start,
      end: start,
    });

    if (response.status === 200) {
      alert('Event was created');
    }
  };

  return (
    <div className='container-fluid mt-3'>
      <div className='row justify-content-center mb-3'>
        <div className='col-12'>
          <div className='card shadow-lg'>
            <div className='card-header'>
              Event type
            </div>
            <div className='card-body'>
              <select className="form-select" aria-label="" onChange={e => setEventType(e.target.value)}>
                {eventTypes.map(e => <option value={e.constant}>{e.title}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <Bolus />
      </div>
    </div>
  );
};

EventModification.propTypes = {};

export default EventModification;
