import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Widget = ({ title, value, icon, tendency, lastScan }) => {
  const tendencyUp = tendency > 0;
  return <div className='card shadow-lg'>
    <div className='card-body p-0'>
      <div className='container-fluid '>
        <div className='row'>
          <div className='col-auto bg-brand d-flex align-items-center'>
            <div className='text-size-2 mx-4' style={{color: 'white'}}>
              {icon}
            </div>
          </div>
          <div className='col text-truncate'>
            <div className='m-3 text-truncate'>
              <h3 className='mb-4 font-weight-900 text-size-4 text-center'>{value}</h3>
              <hr/>
             <span className='text-center d-block'>{title}</span>
            </div>
          </div>
          <div className='col-auto d-flex justify-content-center align-items-center bg-light flex-column'>
            <span className={classnames('color-success font-weight-bold', {'invisible': !tendencyUp})}>{tendency}</span>
            <i  className={classnames('fa fa-arrow-up color-white text-size-2 color-success', {'invisible': !tendencyUp})}/>
            <br/>
            <i className={classnames('fa fa-arrow-down color-white text-size-2 color-danger', {'invisible': tendencyUp})} />
            <span className={classnames('color-danger font-weight-bold', {'invisible': tendencyUp})}>{tendency}</span>
          </div>
        </div>
        <span className='badge bg-brand position-absolute' style={{top: -10, right: 0}}>{lastScan}</span>
      </div>
    </div>
  </div>
};

Widget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  icon: PropTypes.element.isRequired,
  tendency: PropTypes.number.isRequired,
  lastScan: PropTypes.string.isRequired
};

Widget.defaultProps = {}

export default Widget;
