import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateModal = ({ closeModal, selectedUserId }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const url = 'http://localhost:8081/updateUser';

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('this is id', selectedUserId);
    // Create an object with the updated user information
    const updatedUser = {
      userid: selectedUserId,
      username,
      email,
      password,
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert('succesfully changed!');
        closeModal();
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error in updating user:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <div className="flex items-center mb-8">
          <button
            className="text-gray-600 rounded-full p-2 mr-4"
            onClick={closeModal}
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
          <h2 className="text-2xl font-bold text-gray-800">Update User</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Username:
            <input
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="block mb-2">
            Email:
            <input
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block mb-2">
            Password:
            <input
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
