import { useEffect, useState } from 'react';

const useFetch = (service, options = {}) => {
  const { interval } = options;
  let intervalId = null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await service();
      setData(response);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (interval) {
      intervalId = setInterval(fetchData, interval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [interval]);

  return { data, loading, error };
};

export default useFetch;
