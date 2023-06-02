import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

function Home() {
  const navigate = useNavigate();

  //call handleResponserError function when fetching anything to run refreshAccessToken
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${baseUrl}/refresh`, {
        credentials: 'include',
      });
      if (response.status === 403 || response.status === 401) {
        navigate('/login');
        localStorage.removeItem('accessToken');
        return [];
      }
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userid', data.userid);
      console.log(data);
      return;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleUserProfile = () => {
    navigate('/user-profile');
  };

  const onHandleLogout = async () => {
    try {
      await fetch(`${baseUrl}/logout`, {
        method: 'PUT',
        credentials: 'include',
      });
    } catch (error) {
      console.error(error);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userid');
    localStorage.removeItem('roles');
    navigate('/');
  };

  // const handleResponseError = (response) => {
  //   if (response.status === 403) {
  //     refreshAccessToken(); // Call refreshAccessToken only on 403 error
  //   }
  //   // Handle other response errors if needed
  //   return response;
  // };

  return (
    <div className="App">
      <header className="App-header">
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-5">Home page</h1>
              <button className="btn btn-secondary" onClick={onHandleLogout}>
                Sign out
              </button>
              <button className="btn btn-secondary" onClick={handleUserProfile}>
                User Profile
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Home;
