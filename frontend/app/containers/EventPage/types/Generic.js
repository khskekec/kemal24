import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useForm} from "react-hook-form";
import { push } from 'connected-react-router';
import axios from "../../../utils/axios";
import ImageUploader from "../components/ImageUploader";
import {useDispatch} from "react-redux";
import TimeSelector from "../components/TimeSelector";

const Generic = ({ title, type}) => {
  const {register, handleSubmit, errors, getValues, watch, setValue} = useForm();
  const [files, setFiles] = useState();
  const [isLoading, setLoading] = useState(false);
  const [time, setTime] = useState(null);
  const dispatch = useDispatch();
  const onSubmit = async (...args) => {
    setLoading(true);
    const values = getValues();
    const data = {
      start: time.value,
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

  return <div className='col'>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Time</div>
        <div className='card-body'>
          <div className="col-md-12">
            <TimeSelector onChange={setTime}/>
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
            <input type="number" step=".01" className="form-control" id="value" name='value' ref={register()} required/>
        </div>
      </div>
      <div className='col-12 card shadow-lg mb-3'>
        <div className='card-header'>Description</div>
        <div className='card-body'>
          <textarea className='form-control' name='description' id='description' ref={register()}></textarea>
        </div>
        <div className='card-footer'>
          <button className='btn btn-primary btn-block' disabled={isLoading}>Create</button>
        </div>
      </div>
    </form>
  </div>
};

Generic.propTypes = {};

export default Generic
