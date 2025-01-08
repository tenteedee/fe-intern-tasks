import { useEffect, useState } from 'react';
import { VITE_APP_API, axiosInstant } from './apis/requests';

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
  const [login, setLogin] = useState(!!localStorage.getItem('accessToken'));

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const token = localStorage.getItem('accessToken');
  //     setLogin(!!token);
  //   }, 1000); // Kiểm tra mỗi giây (hoặc tăng thời gian nếu cần)

  //   return () => clearInterval(interval); // Dọn dẹp khi component unmount
  // }, []);
  useEffect(() => {
    setLogin(!!localStorage.getItem('accessToken'));
  }, []);

  useEffect(() => {
    axiosInstant.get('/posts?page=1');
  }, []);

  const onLogin = async () => {
    // const r = await fetch(`${VITE_APP_API}/auth/login`, {
    //   method: 'post',
    //   body: JSON.stringify({
    //     username: 'adminRefresh2',
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // }).then((r) => r.json());
    const response = await axiosInstant.post(`${VITE_APP_API}/auth/login`, {
      username: 'adminRefresh2',
    });
    const user = response.data;

    if (user?.accessToken) {
      localStorage.setItem('accessToken', user?.accessToken);
      localStorage.setItem('refreshToken', user?.refreshToken);
      setLogin(true);
    }
  };

  return (
    <div className='App'>
      <Post1 />
      <br />
      <Post2 />
      <br />

      <div>
        {login ? (
          <>
            <button
              onClick={() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setLogin(false);
              }}
            >
              Logout
            </button>
            <p>Token will expire after 1m. Please check network</p>
          </>
        ) : (
          <button onClick={onLogin}>Login</button>
        )}
      </div>
    </div>
  );
}

export default App;
