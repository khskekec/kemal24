import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import axios from '../../utils/axios';
import { actions } from '../App/redux';

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
    <div>
      <div>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      <div>
        <button className="btn btn-primary" onClick={loginHandler}>
          Login
        </button>
      </div>
    </div>
  );
};

LoginPage.propTypes = {};

export default LoginPage;
