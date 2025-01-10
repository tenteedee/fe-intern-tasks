import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/Login/LoginPage';
import PostsPage from './modules/Post/PostPage';

const App: React.FC = () => {
  const user = localStorage.getItem('user');

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />

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
