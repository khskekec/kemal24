/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import { getFactorValue } from '../CalculatorPage/utils';

const key = 'correction-calculator';

export function CorrectionCalculatorPage({}) {
  const [bloodSugar, setBloodSugar] = useState(0);
  const [correction, setCorrection] = useState(0.1);
  const [threshold, setThreshold] = useState(200);
  return (
    <div>
      <div className="container-fluid pt-3">
        <div className="row">
          <div className="col">
            <div className="card text-white bg-dark mb-3">
              <div className="card-header">Current Blood Sugar</div>
              <div className="card-body text-center">
                <p className="card-text">
                  <input
                    type="number" step=".01"
                    className="form-control form-control-xxl"
                    value={bloodSugar}
                    onChange={e => setBloodSugar(e.target.value)}
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card text-white bg-dark mb-3">
              <div className="card-header">Correction rule</div>
              <div className="card-body text-center">
                <p className="card-text">
                  <div className="container-fluid p-0">
                    <div className="row mb-2">
                      <div className="col font-weight-bold">Threshold</div>
                      <div className="col font-weight-bold">
                        Insuline per 10mg/dl blood sugar
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <input
                          type="number" step=".01"
                          className="form-control form-control-xxl"
                          value={threshold}
                          onChange={e => setThreshold(e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="number" step=".01"
                          className="form-control form-control-xxl"
                          value={correction}
                          onChange={e => setCorrection(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </p>
              </div>
            </div>
          </div>
          <div
            className={classnames('col', {
              'd-none': !bloodSugar || !correction,
            })}
          >
            <div className="card text-white bg-primary mb-3">
              <div className="card-header">Result</div>
              <div className="card-body">
                <p className="card-text">
                  {threshold > bloodSugar ? (
                    <div className="alert alert-danger" role="alert">
                      Current blood sugar is lower then the threshold
                    </div>
                  ) : (
                    <h1 className="text-center">
                      {(((bloodSugar - threshold) / 10) * correction).toFixed(
                        2,
                      )}{' '}
                      Units
                    </h1>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CorrectionCalculatorPage.propTypes = {};

export default CorrectionCalculatorPage;
