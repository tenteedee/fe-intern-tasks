import { useEffect, useState } from 'react';
import { VITE_APP_API, axiosInstant } from './apis/requests';
import { useAtom } from 'jotai';
import { isLoggedInAtom, userAtom } from './atoms/atoms';
import Login from './components/Login';

const Post1 = () => {
  useEffect(() => {
    axiosInstant.get('/posts');
  }, []);

  return <h1>Component 1</h1>;
};

const Post2 = () => {
  useEffect(() => {
    axiosInstant.get('/posts?page=2');
  }, []);

  return <h1>Component 2</h1>;
};

function App() {
  // const [login, setLogin] = useState(!!localStorage.getItem('accessToken'));
  const [user] = useAtom(userAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

  useEffect(() => {
    axiosInstant.get('/posts?page=1');
  }, []);

  return (
    <div className='App'>
      <Post1 />
      <br />
      <Post2 />
      <br />

      <div>
        {isLoggedIn ? (
          <>
            <h3>Welcome! {user?.username}</h3>
            <button
              onClick={() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setIsLoggedIn(false);
              }}
            >
              Logout
            </button>
            <p>Token will expire after 1m. Please check network</p>
          </>
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
}

export default App;
