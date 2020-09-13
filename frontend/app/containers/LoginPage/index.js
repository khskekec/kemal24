import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import axios from '../../utils/axios';
import { actions } from '../App/redux';
import "./Login.scss";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch();

  const loginHandler = async () => {
    setError(null);
    try {
      const response = await axios.post('/auth/login', { username, password });

      setSuccess(true);
      setTimeout(() => {
        dispatch(actions.setCurrentUser(response.data));
        localStorage.setItem('jwt', JSON.stringify(response.data));
      }, 1000);
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-logo font-weight-900 text-size-7 shadow-lg'>
        <span>K24</span>
      </div>
      <div className='form-container'>
        <div>
          <input
            className='form-control form-control-lg shadow-lg'
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <br/>
        <div>
          <input
            className='form-control form-control-lg'
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
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
          <button className="btn bg-brand btn-block btn-lg px-5" style={{color: 'white'}} onClick={loginHandler}>
            Login <i className='fa fa-sign-in-alt' />
          </button>
        </div>
      </div>
    </div>
  );
};

LoginPage.propTypes = {};

export default LoginPage;
