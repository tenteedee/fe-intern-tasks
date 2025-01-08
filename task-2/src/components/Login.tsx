import React, { useEffect, useState } from 'react';
import { VITE_APP_API, axiosInstant } from './../apis/requests';
import { userAtom, isLoggedInAtom } from './../atoms/atoms';
import { useAtom } from 'jotai';

const Login = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.username) {
          setUsername(parsedUser.username);
        }
      } catch (error) {
        console.warn('Failed to parse user from localStorage:', error);
      }
    }
  }, []);

  const onLogin = async () => {
    if (!username) {
      alert('Please enter your username');
      return;
    }

    try {
      const response = await axiosInstant.post(`${VITE_APP_API}/auth/login`, {
        username,
      });
      const data = response.data;
      console.log(data);

      if (data.accessToken) {
        const user = { username };
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        setIsLoggedIn(true);
        setUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <input
        type='text'
        placeholder='Enter your username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={onLogin}>Login</button>
    </div>
  );
};

export default Login;
