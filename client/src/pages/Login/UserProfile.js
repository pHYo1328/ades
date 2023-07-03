import React, { useEffect, useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import ProfileWidget from '../../components/cloudinary/ProfileWidget';

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
  const [image, setImage] = useState(null);
  const url = `${baseUrl}/user-profile`;
  const url2 = `${baseUrl}/update-userProfile`;
  const url3 = `${baseUrl}/update-userProfileImage`;

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

  const updateUserProfile = async () => {
    try {
      const response = await fetch(url2, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      console.log(data);
      console.log('User information updated successfully.');
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  const handleUsernameChange = (e) => {
    setUser({ ...user, username: e.target.value });
  };

  const handleEmailChange = (e) => {
    setUser({ ...user, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setUser({ ...user, password: e.target.value });
  };

  // sets the image path when the user uploads an image
  const handleImageChange = (path) => {
    console.log('Selected image path:', path);
    setImage(path);
  };

  const updateProfileImage = async () => {
    try {
      const response = await fetch(url3, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: image,
          customer_id: user.customer_id,
        }),
      });

      const data = await response.json();
      console.log(data);
      console.log('User profile image updated successfully.');
      window.location.reload();
    } catch (error) {
      console.error('Error updating user profile image:', error);
    }
  };

  return (
    <div className="h-xl w-xl bg-gray-100 flex items-center justify-center">
      <div className="flex h-screen w-screen m-3">
        <div className="bg-gray-800 text-white ml-10 w-64 flex-none rounded-tl-lg rounded-bl-lg">
          <nav className="p-4">
            <ul className="space-y-2">
              <li className="py-2">
                <a
                  href="/user-profile"
                  className="block px-4 py-2 text-lg rounded-md hover:bg-gray-700"
                >
                  Profile Page
                </a>
              </li>
              <li className="py-2">
                <a
                  href="#"
                  className="block px-4 py-2 text-lg rounded-md hover:bg-gray-700"
                >
                  Order History
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-grow">
          <div className="max-w-6xl h-full">
            {user && (
              <div className="bg-white shadow-lg h-full p-8 rounded-tr-lg rounded-br-lg">
                <h2 className="text-4xl text-center font-bold mb-4">
                  User Information
                </h2>
                <div className="space-y-6">
                  <AdvancedImage
                    key={image}
                    cldImg={cld.image(user.image_url)}
                    className="h-50 w-50"
                  />
                  <div className="flex items-center">
                    <span className="font-semibold w-28 text-lg">
                      Username:
                    </span>
                    {editingUsername ? (
                      <input
                        type="text"
                        className={`text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-100 ${
                          editingUsername ? 'opacity-100' : 'opacity-0 scale-95'
                        }`}
                        value={user.username}
                        onChange={handleUsernameChange}
                        onBlur={() => setEditingUsername(false)}
                      />
                    ) : (
                      <span className="text-base">{user.username}</span>
                    )}
                    <BiEdit
                      className={`ml-3 mt-1 text-base transition-all duration-300 ${
                        editingUsername ? 'opacity-0' : 'opacity-100'
                      }`}
                      onClick={() => setEditingUsername(true)}
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-28 text-lg">Email:</span>
                    {editingEmail ? (
                      <input
                        type="email"
                        className={`text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-100 ${
                          editingEmail ? 'opacity-100' : 'opacity-0 scale-95'
                        }`}
                        value={user.email}
                        onChange={handleEmailChange}
                        onBlur={() => setEditingEmail(false)}
                      />
                    ) : (
                      <span className="text-base">{user.email}</span>
                    )}
                    <BiEdit
                      className={`ml-3 mt-1 text-base transition-all duration-300 ${
                        editingEmail ? 'opacity-0' : 'opacity-100'
                      }`}
                      onClick={() => setEditingEmail(true)}
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-28 text-lg">
                      Password:
                    </span>
                    {editingPassword ? (
                      <input
                        type="password"
                        className={`text-base border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-100 ${
                          editingPassword ? 'opacity-100' : 'opacity-0 scale-95'
                        }`}
                        onChange={handlePasswordChange}
                        onBlur={() => setEditingPassword(false)}
                      />
                    ) : (
                      <button
                        className="text-base text-blue-500 underline hover:text-blue-800"
                        onClick={() => setEditingPassword(true)}
                      >
                        Change Password
                      </button>
                    )}
                  </div>
                </div>
                <button
                  className="text-base text-white bg-blue-500 hover:bg-blue-600 rounded-lg py-2 px-4 mt-5"
                  onClick={updateUserProfile}
                >
                  Save
                </button>

                <ProfileWidget onImageChange={handleImageChange} />

                <button
                  className="text-base text-white bg-blue-500 hover:bg-blue-600 rounded-lg py-2 px-4 mt-5"
                  onClick={updateProfileImage}
                >
                  Save Profile Image
                </button>
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

{
  /* <div className="flex items-center">
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
                    </div> */
}
