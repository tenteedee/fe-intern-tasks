import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/Login/LoginPage';
import PostsPage from './modules/Post/PostPage';
import { useAtom } from 'jotai';
import { userAtom } from './atoms/userAtom';

const App: React.FC = () => {
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUser(userData);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={!user ? <LoginPage /> : <Navigate to='/posts' />}
        />

        <Route
          path='/posts'
          element={user ? <PostsPage /> : <Navigate to='/login' />}
        />

        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
