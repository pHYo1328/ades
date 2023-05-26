import React, { useEffect } from 'react';

const RefreshAccessToken = ({ baseUrl, navigate }) => {
  useEffect(() => {
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

    refreshAccessToken();
  }, [baseUrl, navigate]);

  return null;
};

export default RefreshAccessToken;
