/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import axios from '../../utils/axios';
import EventDetails from './EventDetails';

const key = 'event';

const EventPage = () => {
  const [eventTypes, setEventTypes] = useState(null);
  const [eventType, setEventType] = useState(1);

  useEffect(() => {
    (async () => {
      const response = await axios.get('/event/types');

      setEventTypes(response.data);
    })();
  }, []);

  if (!eventTypes) return null;

  console.log(eventType);
  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <div className="container-fluid pt-3">
        <div className="row">
          <div className="col">
            <select
              className="form-control"
              value={eventType}
              onChange={e => setEventType(e.target.value)}
            >
              {eventTypes.map(e => (
                <option value={e.id}>{e.title}</option>
              ))}
            </select>
            <br />
            {eventType && <EventDetails type={eventType} />}
          </div>
        </div>
      </div>
    </div>
  );
};

EventPage.propTypes = {};

export default EventPage;
