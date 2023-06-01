import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onHandleSubmit = (e) => {
    if (!username || !password) {
      setErrorMessage('Incorrect username or password');
      return errorMessage;
    }

    const url = `${baseUrl}/login-admin`;

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
          console.log('Admin login successful');
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('admin_id', data.userid);
          localStorage.setItem('roles', JSON.stringify(data.roles));
          document.cookie = `refreshToken=${data.newRefreshToken}; SameSite=None; Secure`;
          setErrorMessage('');
          alert('successful admin login');
          navigate('/verify-otp-admin');
        } else {
          console.log('Admin login failed');
          setErrorMessage('Incorrect username or password');
          alert('Incorrect username or password');
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('An error occurred. Please try again.');
      });
    console.log(username, password);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onHandleSubmit();
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-indigo-950">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Log in to your admin account
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
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
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
              onClick={() => navigate('/forgot-admin')}
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
            onClick={() => navigate('/register-admin')}
          >
            Sign up new admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
