import React, { useState } from 'react';
import CartContext from '../../context/CartContext';
import api from '../../index';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOTP] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });
      console.log(response);
      if (response.ok) {
        console.log('Successful OTP verification');
        navigate('/homepage');
      } else {
        console.log('Invalid OTP');
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="otp"
            className="block text-lg font-medium text-gray-700"
          >
            OTP
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-4 py-2"
          >
            Verify
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOTP;
