import { useState } from 'react';
import useFetch from './useFetch';

const serviceGetUser = async () => {
  return {
    userId: 1,
    full_name: 'Peter',
  };
};

const serviceGetUserDelay = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        userId: 1,
        full_name: 'Peter',
      });
    }, 1000);
  });
};

function App() {
  // Case 1
  // const { data, loading, error } = useFetch(serviceGetUser);

  // Case 2
  const { data, loading, error } = useFetch(serviceGetUserDelay, {
    interval: 1000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data && (
        <div>
          <p>User ID: {data.userId}</p>
          <p>Full Name: {data.full_name}</p>
        </div>
      )}
    </>
  );
}

export default App;
