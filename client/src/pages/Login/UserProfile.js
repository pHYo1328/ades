import React, { useEffect, useState } from 'react';
const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const url = `${baseUrl}/user-profile`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customer_id: localStorage.getItem('userid') }),
        });

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">User Information</h1>
      <div className="max-w-screen-2xl py-12 mx-auto">
        {user && (
          <table className="table w-full text-base">
            <thead>
              <tr>
                <th className="py-2 border-b-2 border-gray-700">Username</th>
                <th className="py-2 border-b-2 border-gray-700">Email</th>
              </tr>
            </thead>
            <tbody>
              <User key={user.id} user={user} />
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const User = ({ user }) => {
  return (
    <tr>
      <td className="py-2">{user.username}</td>
      <td className="py-2">{user.email}</td>
    </tr>
  );
};

export default UserProfile;
