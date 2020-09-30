import React, {useState} from 'react';
import PropTypes from 'prop-types';
import DateRangePicker from "./DateRangePicker";
import {useDispatch} from "react-redux";
import {actions} from "../redux";
import classnames from 'classnames';


const FixedDateRangePicker = () => {
  const [dateRangeVisible, setDataRangeVisible] = useState(false);
  const dispatch = useDispatch();

  const handleDateRangeChange = dateRange => dispatch(actions.setDateRange(dateRange))

  return <div className='position-fixed' style={{zIndex: 999, width: 'calc(100% - 10rem)'}}>
    <div className={classnames('bg-white shadow-lg',{'d-none': !dateRangeVisible})}>
      <DateRangePicker onChange={handleDateRangeChange} />
    </div>
    <div className='text-center'>
      <button className='px-5 bg-primary border-0 color-white' style={{borderRadius: '0 0 10px 10px'}} onClick={() => setDataRangeVisible(!dateRangeVisible)}><i className={classnames('fa', {'fa-chevron-up': dateRangeVisible, 'fa-chevron-down': !dateRangeVisible})} /></button>
    </div>
  </div>
};

export default FixedDateRangePicker;
