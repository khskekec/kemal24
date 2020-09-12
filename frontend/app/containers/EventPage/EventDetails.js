/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import axios from '../../utils/axios';

const EventDetails = ({ type }) => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [value, setValue] = useState(0);

  const saveHandler = async () => {
    const response = await axios.post('/event', {
      title: null,
      value,
      typeId: type,
      start,
      end: start,
    });

    if (response.status === 200) {
      alert('Event was created');
    }
  };

  return (
    <div>
      {/* <input type="datetime-local" className='form-control' value={start} onChange={e => setStart(e.target.value)} /> */}
      <form className="row g-3">
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
        {[8].indexOf(parseInt(type)) != -1 && (
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
          <input
            type="number"
            className="form-control form-control-xxl"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Value..."
          />
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
        {/* <div className="col-12"> */}
        {/*  <label htmlFor="inputAddress" className="form-label">Address</label> */}
        {/*  <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St"> */}
        {/* </div> */}
        {/* <div className="col-12"> */}
        {/*  <label htmlFor="inputAddress2" className="form-label">Address 2</label> */}
        {/*  <input type="text" className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor"> */}
        {/* </div> */}
        {/* <div className="col-md-6"> */}
        {/*  <label htmlFor="inputCity" className="form-label">City</label> */}
        {/*  <input type="text" className="form-control" id="inputCity"> */}
        {/* </div> */}
        {/* <div className="col-md-4"> */}
        {/*  <label htmlFor="inputState" className="form-label">State</label> */}
        {/*  <select id="inputState" className="form-select"> */}
        {/*    <option selected>Choose...</option> */}
        {/*    <option>...</option> */}
        {/*  </select> */}
        {/* </div> */}
        {/* <div className="col-md-2"> */}
        {/*  <label htmlFor="inputZip" className="form-label">Zip</label> */}
        {/*  <input type="text" className="form-control" id="inputZip"> */}
        {/* </div> */}
        {/* <div className="col-12"> */}
        {/*  <div className="form-check"> */}
        {/*    <input className="form-check-input" type="checkbox" id="gridCheck"> */}
        {/*      <label className="form-check-label" htmlFor="gridCheck"> */}
        {/*        Check me out */}
        {/*      </label> */}
        {/*  </div> */}
        {/* </div> */}
        {/* <div className="col-12"> */}
        {/*  <button type="submit" className="btn btn-primary">Sign in</button> */}
        {/* </div> */}
      </form>
    </div>
  );
};

EventDetails.propTypes = {};

export default EventDetails;
