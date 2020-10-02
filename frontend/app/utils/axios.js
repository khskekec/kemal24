import axios from 'axios';
import { actions } from '../containers/App/redux';
import configureStore from '../configureStore';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3010/api/v1/',
  timeout: 20000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status && error.response.status === 401) {
      localStorage.clear();
      configureStore().dispatch(actions.setCurrentUser(null));
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
