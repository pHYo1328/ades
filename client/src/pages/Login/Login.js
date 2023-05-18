import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onHandleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Incorrect username or password');
      return errorMessage;
    }

    const url = 'http://localhost:8081/login';

    const body = {
      username: username,
      password: password,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('this is my' + data);
        if (data.success) {
          console.log('Login successful');
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('userid', data.userid);
          document.cookie = `refreshToken=${data.newRefreshToken}; SameSite=None; Secure`;
          setErrorMessage('');
          navigate('/homepage');
        } else {
          console.log('Login failed');
          setErrorMessage('Incorrect username or password');
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('An error occurred. Please try again.');
      });
    console.log(username, password);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Log in to your account
          </h2>
        </div>
        <form onSubmit={onHandleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-200 text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-200 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* <div className="flex justify-end">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
              Forgot your password?
            </a>
          </div> */}
        <div className="flex justify-end">
        <button
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => navigate('/forgot')}
          >
            Forgot your password?
          </button>
        </div>
          
          <div>
            <button
              type="submit"
              className="mt-4 w-full px-4 py-2 rounded-md shadow-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              Log in
            </button>
          </div>
        </form>
        <div className="flex justify-center items-center mt-4">
          <span className="text-sm text-gray-600 mr-2">
            Don't have an account?
          </span>
          <button
            className="text-sm text-indigo-500 hover:text-indigo-600 focus:outline-none focus:underline"
            onClick={() => navigate('/register')}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
