import React, { useEffect, useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;



const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
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
    <div className="h-xl w-xl bg-gray-100 flex items-center justify-center">
      <div className="flex h-screen w-screen m-3">
        <div className="bg-gray-800 text-white ml-10 w-64 flex-none rounded-tl-lg rounded-bl-lg">
          <nav className="p-4">
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
          <div className="max-w-6xl h-full">
            {user && (
              <div className="bg-white shadow-lg h-full p-8 rounded-tr-lg rounded-br-lg">
                <h2 className="text-4xl text-center font-bold mb-4">User Information</h2>
                  <div className="space-y-6">
                  <div className="flex items-center">
                        <span className="font-semibold w-28 text-lg">Username:</span>
                        {editingUsername ? (
                          <input
                            type="text"
                            className={`text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-100 ${editingUsername ? 'opacity-100' : 'opacity-0 scale-95'}`}
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            onBlur={() => setEditingUsername(false)}
                          />
                        ) : (
                          <span className="text-base">{user.username}</span>
                        )}
                        <BiEdit
                          className={`ml-3 mt-1 text-base transition-all duration-300 ${editingUsername ? 'opacity-0' : 'opacity-100'}`}
                          onClick={() => setEditingUsername(true)}
                        />
                  </div>
                    <div className="flex items-center">
                      <span className="font-semibold w-28 text-lg">Email:</span>
                      {editingEmail ? (
                        <input
                          type="email"
                          className={`text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-100 ${editingEmail ? 'opacity-100' : 'opacity-0 scale-95'}`}
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          onBlur={() => setEditingEmail(false)}
                        />
                      ) : (
                        <span className="text-base">{user.email}</span>
                      )}
                      <BiEdit 
                      className={`ml-3 mt-1 text-base transition-all duration-300 ${editingEmail ? 'opacity-0' : 'opacity-100'}`}
                      onClick={() => setEditingEmail(true)} />
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold w-28 text-lg">Password:</span>
                      {editingPassword ? (
                        <input
                          type="password"
                          className={`text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-100 ${editingPassword ? 'opacity-100' : 'opacity-0 scale-95'}`}
                          value={user.password}
                          onChange={(e) => setUser({ ...user, password: e.target.value })}
                          onBlur={() => setEditingPassword(false)}
                        />
                      ) : (
                        <span className="text-base">{'*'.repeat(user.password.length)}</span>
                      )
                      }
                      <BiEdit 
                      className={`ml-3 mt-1 text-base transition-all duration-300 ${editingPassword ? 'opacity-0' : 'opacity-100'}`}
                      onClick={() => setEditingPassword(true)} />
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold w-28 text-lg">Address:</span>
                      {editingAddress ? (
                        <input
                          type="text"
                          className={`text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-100 ${editingAddress ? 'opacity-100' : 'opacity-0 scale-95'}`}
                          value={user.username}
                          onChange={(e) => setUser({ ...user, username: e.target.value })}
                          onBlur={() => setEditingAddress(false)}
                        />
                      ) : (
                        <span className="text-base">Address to be inserted</span>
                      )
                      }
                      <BiEdit 
                      className={`ml-3 mt-1 text-base transition-all duration-300 ${editingAddress ? 'opacity-0' : 'opacity-100'}`}
                      onClick={() => setEditingAddress(true)} />
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
