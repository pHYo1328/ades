import { useState, useContext, useEffect } from 'react';
import React from 'react';
import { BsEyeFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const isUserSignedIn = localStorage.getItem('isSignedIn') === 'true';
    if (isUserSignedIn) {
      navigate('/');
    }
  }, []);
  
  const onHandleSubmit = () => {
    if (!username || !password) {
      setErrorMessage('Incorrect username or password');
      return;
    }

    const url = `${baseUrl}/login`;

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
        if (data.success) {
          setErrorMessage('');
          alert('successful login');
          
          navigate('/verify-otp', { state: { ...data, username: username } });
        } else {
          setErrorMessage('Incorrect username or password');
          alert('Incorrect username or password');
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('An error occurred. Please try again.');
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onHandleSubmit();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-98px)] bg-indigo-950">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Log in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6">
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
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-200 text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-500 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <BsEyeSlashFill className="mr-3" /> : <BsEyeFill className="mr-3" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => navigate('/verify-email')}
            >
              Forgot your password?
            </button>
          </div>
          <div>
            <button
              type="button"
              className="mt-4 w-full px-4 py-2 rounded-md shadow-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
              onClick={onHandleSubmit}
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
