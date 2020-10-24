import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import axios from '../../utils/axios';
import {actions} from '../App/redux';
import {useForm} from 'react-hook-form';
import "./Login.scss";

const LoginPage = () => {
  const {register, handleSubmit, errors, getValues, watch, setValue} = useForm();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch();
  const username = watch('username');
  const password = watch('password');

  const onSubmit = async () => {
    setError(null);
    try {
      const response = await axios.post('/auth/login', {username, password});

      setSuccess(true);
      setTimeout(() => {
        dispatch(actions.setCurrentUser(response.data));
        localStorage.setItem('jwt', JSON.stringify(response.data));
      }, 1000);
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  console.log(errors);

  return (
    <div className='login-container'>
      <div className='login-logo font-weight-900 text-size-7 shadow-lg zIndex2'>
        <span>K24</span>
      </div>
      <div className='form-container '>
        <form onSubmit={handleSubmit(onSubmit)} className='zIndex2'>
          <div>
            <input
              className='form-control form-control-lg shadow-lg'
              type="text"
              placeholder="Username"
              name="username"
              ref={register({
                required: true,
                minLength: 5
              })}
            />
            <div className="valid-feedback">
              Looks good!
            </div>
          </div>
          <br/>
          <div>
            <input
              className='form-control form-control-lg'
              type="password"
              placeholder='Password'
              name='password'
              ref={register({
                required: true,
                minLength: 5
              })}
            />
          </div>
          <br/>
          {
            error && <div className='alert-danger  alert'>
              {error}
            </div>
          }
          {
            success && <div className='alert-success alert'>
              Logged in successfully
            </div>
          }
          <div>
            <button className="btn bg-brand btn-block btn-lg px-5" style={{color: 'white'}} type="submit" disabled={!username || !password}>
              Login <i className='fa fa-sign-in-alt'/>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

LoginPage.propTypes = {};

export default LoginPage;
