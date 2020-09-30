import {useState, useEffect} from 'react';
import axiosInstance from "./axios";

export const useAjaxData = options => {
  const [data, setData] = useState({
    loading: false,
    error: false,
    done: false,
    response: null
  });

  const [initial, setInitial] = useState(true);
  const [forceReload, setForceReload] = useState(false);

  useEffect(() => {
    setData({...data, loading: true, done: false, error: false, response: null});

    if (!forceReload && !initial) return;

    (async () => {
      try {
        const response = await axiosInstance(options);
        setData({...data, loading: false, error: false, done: true, response: response});
      } catch (e) {
        setData({...data, loading: false, error: true, done: true, response: e});
      }
    })();

    setInitial(false);
    setForceReload(false);
  }, [JSON.stringify(options), forceReload])

  return {
    ...data,
    reload: () => setForceReload(true),
    success: data.done && !data.error,
    failure: data.done && data.error,
    isLoading: data.loading || !data.done || !data.response,
    getData: () => data.response.data
  }
}
