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
import Bolus from "./types/Bolus";
import BloodSugar from "./types/BloodSugar";
import BodyHeight from "./types/BodyHeight";
import BodyWeight from "./types/BodyWeight";
import HeartRate from "./types/HeartRate";
import CorrectionBolus from "./types/CorrectionBolus";
import CorrectionMeal from "./types/CorrectionMeal";

const EventModification = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [eventType, setEventType] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get('/event/types');

      setEventTypes(response.data);
    })();
  }, []);

  if (!eventTypes) return null;

  let eventComponent = <div className='col-12'><div className='alert alert-info'>Please select an event type...</div></div>;

  switch(eventType) {
    case 'BLOOD_SUGAR':
      eventComponent = <BloodSugar />;
      break;
    case 'BOLUS':
      eventComponent = <Bolus />;
      break;
    case 'BODY_HEIGHT':
      eventComponent = <BodyHeight />
      break;
    case 'BODY_WEIGHT':
      eventComponent = <BodyWeight />
      break;
    case 'HEART_RATE':
      eventComponent = <HeartRate />
      break;
    case 'CORRECTION_BOLUS':
      eventComponent = <CorrectionBolus />
      break;
    case 'CORRECTION_MEAL':
      eventComponent = <CorrectionMeal />
  }

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
                <option value={null}>-</option>
                {eventTypes.map(e => <option value={e.constant}>{e.title}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        {eventComponent}
      </div>
    </div>
  );
};

EventModification.propTypes = {};

export default EventModification;
