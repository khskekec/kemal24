import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import axios from '../../utils/axios';
import { actions } from '../App/redux';
import "./Login.scss";

const LoginPage = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const dispatch = useDispatch();

  const loginHandler = async () => {
    const response = await axios.post('/auth/login', { username, password });

    dispatch(actions.setCurrentUser(response.data));
    localStorage.setItem('jwt', JSON.stringify(response.data));
  };

  return (
    <div className='login-container'>
      <div className='login-logo font-weight-900 text-size-5 shadow-lg'>
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
        <div>
          <button className="btn bg-brand btn-block" style={{color: 'white'}} onClick={loginHandler}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

LoginPage.propTypes = {};

export default LoginPage;
