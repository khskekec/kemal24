/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import classnames from 'classnames';
import Factor from './components/Factor';
import { calculateFactor, factorConfiguration, getFactorValue } from './utils';
// import { useInjectReducer } from 'utils/injectReducer';
// import { useInjectSaga } from 'utils/injectSaga';
// import reducer from './reducer';
// import saga from './saga';

const key = 'calculator';

export function CalculatorPage({}) {
  // useInjectReducer({ key, reducer });
  // useInjectSaga({ key, saga });
  const [factor, setFactor] = useState(null);
  const [carbs100, setCarbs100] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  if (factor === null) {
    setFactor(calculateFactor(factorConfiguration));
  }

  return (
    <div>
      <div className="container-fluid pt-3">
        <div className="row">
          <div className="col">
            <div className="card text-white bg-dark mb-3">
              <div className="card-header">Factor</div>
              <div className="card-body text-center">
                <p className="card-text">
                  <Factor
                    configuration={factorConfiguration}
                    factor={factor}
                    onChange={setFactor}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={classnames('col', { 'd-none': !factor })}>
          <div className="card text-white bg-dark mb-3">
            <div className="card-header">Carbs in 100g</div>
            <div className="card-body text-center">
              <p className="card-text">
                <input
                  type="number" step=".01"
                  className="form-control form-control-xxl"
                  value={carbs100}
                  onChange={e => setCarbs100(e.target.value)}
                />
              </p>
            </div>
          </div>
        </div>
        <div className={classnames('col', { 'd-none': !carbs100 })}>
          <div className="card text-white bg-dark mb-3">
            <div className="card-header">Total Weight</div>
            <div className="card-body text-center">
              <p className="card-text">
                <input
                  type="number" step=".01"
                  className="form-control form-control-xxl"
                  value={totalWeight}
                  onChange={e => setTotalWeight(e.target.value)}
                />
              </p>
            </div>
          </div>
        </div>
        <div className={classnames('col', { 'd-none': !totalWeight })}>
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Result</div>
            <div className="card-body text-center">
              <p className="card-text">
                <h1>
                  {(
                    (((carbs100 / 100) * totalWeight) / 10) *
                    getFactorValue(factor)
                  ).toFixed(2)}{' '}
                  KE
                </h1>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CalculatorPage.propTypes = {};

export default CalculatorPage;
