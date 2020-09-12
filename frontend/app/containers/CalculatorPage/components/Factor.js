import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Factor = ({ configuration, factor, onChange }) => (
  <div className="btn-group" role="group" aria-label="Basic example">
    {configuration.map(item => (
      <button
        type="button"
        className={classnames('btn', 'btn-outline-info', 'p-3', 'px-5', {
          active: item.id === factor,
        })}
        onClick={() => onChange(item.id)}
      >
        <i className={`fa fa-${item.icon} fa-2x d-block mb-3`} />
        <span className="badge bg-secondary">{item.factor}</span>
      </button>
    ))}
  </div>
);

Factor.propTypes = {};

export default Factor;
