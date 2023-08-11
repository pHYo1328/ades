import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import api from '../../index';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOTP] = useState('');
  const [remainingTime, setRemainingTime] = useState(60);
  const { userData, setUserData } = useContext(AuthContext);


  useEffect(() => {
    const isUserSignedIn = localStorage.getItem('isSignedIn') === 'true';
    if (isUserSignedIn) {
      navigate('/');
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = location.state; //pass data from Login.js
      console.log(data);
      const response = await fetch(`${baseUrl}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp, username: data.username }),
      });
      console.log("username in otp is " + data.username);
      console.log(response);
      if (response.ok) {
        console.log('Successful OTP verification');
        alert('successful OTP');

        

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userid', data.userid);
        // localStorage.setItem('roles', JSON.stringify(data.roles));
        localStorage.setItem('userData', JSON.stringify({
          userid: data.userid,
          roles: data.roles,
          isSignedIn: true,
          admin_id: data.admin_id,
          isAdminSignedIn: data.isAdminSignedIn
        }));
        localStorage.setItem('isSignedIn', 'true');
        setUserData({
          ...userData,
          // accessToken: data.accessToken,
          userid: data.userid,
          roles: data.roles,
          isSignedIn: true,
        });
        console.log("this is whats inside authContext", userData);
        document.cookie = `refreshToken=${data.newRefreshToken}; SameSite=None; Secure`;
        navigate('/');
      } else {
        alert('Invalid OTP or OTP expired');
        console.log('Invalid OTP');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleVerifyOTPEmailClick = async () => {
    setRemainingTime(60); // Reset the timer to 60 seconds
    try {
      const data = location.state; //pass data from Login.js
      const response = await fetch(`${baseUrl}/send-otp-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: data.username }),
      });
      if (response.ok) {
        console.log("OTP Email verification request successful");
      } else {
        console.log("OTP Email verification request failed");
      }
    } catch (error) {
      console.error("Error fetching OTP Email verification:", error);
    }
  };
  

  useEffect(() => {
    if (remainingTime === 0) {
      return; // Don't start a new interval when timer is already at 0
    }

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(interval); // Clear the interval when time reaches 0
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [remainingTime]);



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
            type="number"
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

          <button
          type="button"
          className={`bg-gray-300 text-gray-700 rounded-md ml-4 px-4 py-2 ${remainingTime > 0 ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={handleVerifyOTPEmailClick}
          disabled={remainingTime > 0}
        >
          Resend OTP Email
        </button>
        </div>
        <p>Time remaining: {remainingTime} seconds</p>
      </form>
    </div>
  );
};

export default VerifyOTP;
