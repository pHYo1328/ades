import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

function ForgetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [cfmPassword, setCfmPassword] = useState('');
  const [email, setEmail] = useState('');

  const onHandleSubmit = (e) => {
    e.preventDefault();
    const url = `${baseUrl}/forgot`;

    const body = {
      email: email,
      password: password,
    };

    if (password !== cfmPassword)
      return alert('Password and Confirm Password must be the same');

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status === 404) {
          return {
            success: false,
            message: 'Password changed failed!',
          };
        } else {
          return {
            success: true,
            message: 'Password changed successfully!',
          };
        }
        // return response.json();
      })
      .then((data) => {
        console.log('this si the data', data);
        if (!data.success) {
          alert(data.message);
        } else {
          navigate('/login');
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(email, password, cfmPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-98px)] bg-indigo-950">
      <form
        className="max-w-lg w-full space-y-8 bg-white p-8 rounded-lg shadow-md"
        onSubmit={onHandleSubmit}
      >
        <div className="flex items-center mb-8">
          {/* <button
            className="text-gray-600 rounded-full p-2 mr-4"
            onClick={() => navigate('/login')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button> */}
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="text"
            placeholder="Enter your email"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter your new password"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="cfmPassword"
          >
            Confirm Password
          </label>
          <input
            id="cfmPassword"
            type="password"
            placeholder="Type here"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-10"
            value={cfmPassword}
            onChange={(e) => setCfmPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <button className="mt-4 w-full px-4 py-2 rounded-md shadow-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200">
            Reset Password!
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgetPassword;
