import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useForm} from "react-hook-form";
import { push } from 'connected-react-router';
import axios from "../../../utils/axios";
import ImageUploader from "../components/ImageUploader";
import {useDispatch} from "react-redux";

const Generic = ({ title, type}) => {
  const {register, handleSubmit, errors, getValues, watch, setValue} = useForm();
  const [files, setFiles] = useState();
  const dispatch = useDispatch();
  const onSubmit = async (...args) => {
    const values = getValues();
    const data = {
      start: timeOption === 'automatic' ? (new Date()).toISOString() : values.start,
      typeId: type,
      value: values.value,
      attachments: files,
      description: values.description
    };

    try {
      const response = await axios.post('/event', data);

      dispatch(push('/events'));
    } catch(e) {
      alert(e);
    }
  };

  const timeOption = watch('timeOption');

  return <div className='col'>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Time</div>
        <div className='card-body'>
          <div className="col-md-12">
            <div className='col-10 offset-1 text-center'>
              <div className="btn-group">
                <input type="radio" className="btn-check" name="timeOption" id="option1" autoComplete="off"
                       value="automatic" defaultChecked ref={register()}/>
                <label className="btn btn-secondary" htmlFor="option1">Automatic</label>

                <input type="radio" className="btn-check" name="timeOption" id="option2" autoComplete="off"
                       value="manual" ref={register()}/>
                <label className="btn btn-secondary" htmlFor="option2">Manual</label>
              </div>
            </div>
            <br/>
            <input type="datetime-local" className="form-control" name="start" id="validationCustom01"
                   ref={register()} disabled={timeOption !== 'manual'}/>
          </div>
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Attachments</div>
        <div className='card-body'>
          <ImageUploader onChange={setFiles}/>
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>{ title }</div>
        <div className='card-body'>
          <div className="mb-3">
            <label htmlFor="value" className="form-label">Value</label>
            <input type="number" className="form-control" id="value" name='value' ref={register()}/>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea className="form-control" id="description" name='description' ref={register()}/>
          </div>
        </div>
        <div className='card-footer'>
          <button className='btn btn-primary btn-block'>Create</button>
        </div>
      </div>
    </form>
  </div>
};

Generic.propTypes = {};

export default Generic
