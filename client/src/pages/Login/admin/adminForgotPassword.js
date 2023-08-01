import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

function ForgetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [cfmPassword, setCfmPassword] = useState('');
  const [email, setEmail] = useState('');

  const onHandleSubmit = (e) => {
    e.preventDefault();
    const url = `${baseUrl}/forgot-admin`;

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
            message: 'Admin password changed failed!',
          };
        } else {
          return {
            success: true,
            message: 'Admin password changed successfully!',
          };
        }
        // return response.json();
      })
      .then((data) => {
        console.log('this si the data', data);
        if (!data.success) {
          alert(data.message);
        } else {
          navigate('/login-admin');
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(email, password, cfmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950">
      <form
        className="max-w-lg w-full space-y-8 bg-white p-8 rounded-lg shadow-md"
        onSubmit={onHandleSubmit}
      >
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Forgot Admin Password
          </h2>
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
