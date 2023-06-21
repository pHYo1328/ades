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
            'Customer-Id': localStorage.getItem('userid'),
          },
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="flex min-h-screen py-12">
      <div className="bg-gray-800 text-white w-64 flex-none rounded-tl-lg rounded-bl-lg h-96">
        <nav className="p-4 h-full">
          <ul className="space-y-2">
            <li className="py-2">
              <a href="#" className="block px-4 py-2 text-lg rounded-md hover:bg-gray-700">Profile Page</a>
            </li>
            <li className="py-2">
              <a href="#" className="block px-4 py-2 text-lg rounded-md hover:bg-gray-700">Order History</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-grow">
        <div className="max-w-xl mx-auto">
          {user && (
            <div className="bg-white shadow-lg p-6 rounded-tr-lg rounded-br-lg h-96">
              <h2 className="text-2xl font-bold mb-4">User Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="font-semibold w-24 text-sm">Username:</span>
                  <span className="text-sm">{user.username}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-24 text-sm">Email:</span>
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold w-24 text-sm">Password:</span>
                  <span className="text-sm">{user.password}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

// const User = ({ user }) => {
//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-4">User Information</h2>
//       <div className="flex flex-col space-y-4">
//         <div className="flex items-center space-x-2">
//           <span className="font-semibold">Username:</span>
//           <span>{user.username}</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <span className="font-semibold">Email:</span>
//           <span>{user.email}</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <span className="font-semibold">Password:</span>
//           <span>{user.password}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

export default UserProfile;
