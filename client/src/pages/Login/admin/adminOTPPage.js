import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;


const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOTP] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/verify-otp-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });
      console.log(response);
      if (response.ok) {
        // OTP verification successful
        console.log('Successful OTP verification for admin');
        navigate('/homepage-admin');
      } else {
        // Invalid OTP
        console.log('Invalid OTP!');
      }
    } catch (error) {
      console.error(error);
      // Handle error
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
            OTP ADMIN
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
