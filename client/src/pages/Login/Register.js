import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cfmPassword, setCfmPassword] = useState('');
  const [email, setEmail] = useState('');

  const onHandleSubmit = (e) => {
    e.preventDefault();
    const url = 'http://localhost:8081/register';

    const body = {
      username: username,
      email: email,
      password: password,
    };

    if (password !== cfmPassword)
      return alert('Password and Confirm Password must be the same');

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate('/login');
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(username, password, cfmPassword, email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="max-w-lg w-full space-y-8 bg-white p-8 rounded-lg shadow-md"
        onSubmit={onHandleSubmit}
      >
        <div className="flex items-center mb-8">
          <button
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
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Register</h2>
        </div>

        <div className="mb-6">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Type here"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Type here"
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
          <button className="bg-blue-500 text-white py-2 px-4 rounded-full w-2/3 hover:bg-blue-700">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
