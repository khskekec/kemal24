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

const EventModification = () => {
  const [start, setStart] = useState(moment().format('YYYY-MM-DDTHH:mm:ss'));
  const [end, setEnd] = useState(moment().format('YYYY-MM-DDTHH:mm:ss'));
  const [value, setValue] = useState(0);
  const [eventTypes, setEventTypes] = useState(null);
  const [eventType, setEventType] = useState(1);

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
    <form className="row g-3 p-3 m-3 card shadow-lg">
      <div className="col-12">
        <label htmlFor="inputEventType" className="form-label">
          Event Type
        </label>
        <select
          className="form-control"
          value={eventType}
          onChange={e => setEventType(e.target.value)}
        >
          {eventTypes.map(e => (
            <option value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>
      <div className="col">
        <label htmlFor="inputStart" className="form-label">
          Start
        </label>
        <input
          id="inputStart"
          type="datetime-local"
          className="form-control"
          value={start}
          onChange={e => setStart(e.target.value)}
        />
      </div>
      {[8].indexOf(parseInt(eventType)) != -1 && (
        <div className="col">
          <label htmlFor="inputEnd" className="form-label">
            End
          </label>
          <input
            id="inputEnd"
            type="datetime-local"
            className="form-control"
            value={end}
            onChange={e => setEnd(e.target.value)}
          />
        </div>
      )}
      <div className="col-12">
        <label htmlFor="inputValue" className="form-label">
          Value
        </label>
        <input
          type="number"
          id='inputValue'
          className="form-control"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Value..."
        />
      </div>
      <div className="col-12">
        <label htmlFor="inputValue" className="form-label">
          Description
        </label>
        <textarea className='form-control'></textarea>
      </div>
      <div className="col-12">
        <button
          type="button"
          className="btn btn-primary"
          onClick={saveHandler}
        >
          Create
        </button>
      </div>
    </form>
  );
};

EventModification.propTypes = {};

export default EventModification;
