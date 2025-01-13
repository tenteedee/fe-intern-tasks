import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms/userAtom';
import { useRequest } from 'ahooks';
import { Input, Button } from 'antd';
import { login } from './requests';
import { LoginParams } from './requests';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [, setUser] = useAtom(userAtom);
  const [usernameInput, setUsernameInput] = useState('');

  const { loading, run } = useRequest(login, {
    manual: true,
    onSuccess: (data, params: [LoginParams]) => {
      const [payload] = params;

      const userData = {
        username: payload.username,
      };

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);

      navigate('/posts');
    },
    onError: (error) => {
      console.error('Login error:', error);
      alert('Login failed!');
    },
  });

  const handleLogin = () => {
    if (!usernameInput) return;
    run({ username: usernameInput });
  };

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='bg-white p-6 shadow-md rounded-md'>
        <h1 className='text-2xl mb-4 text-center'>Login</h1>
        <label>Username: </label>
        <Input
          placeholder='Username'
          className='mb-4 min-w-[129px] w-full'
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
        />
        <div className='flex justify-center'>
          <Button
            type='primary'
            onClick={handleLogin}
            loading={loading}
            className='w-1/2'
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
