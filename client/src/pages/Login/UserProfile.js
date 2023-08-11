import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { BiEdit } from 'react-icons/bi';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import ProfileWidget from '../../components/cloudinary/ProfileWidget';
import { BsCaretUpFill } from "react-icons/bs";
import { BsCaretDownFill} from "react-icons/bs";

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

const UserProfile = () => {
  const { userData, setUserData, userDataLoaded} = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const url = `${baseUrl}/user-profile`;
  const url2 = `${baseUrl}/update-userProfile`;
  const url3 = `${baseUrl}/update-userProfileImage`;
  const deleteURL = `${baseUrl}/deleteUserCustomer`;

  useEffect(() => {
    if (!userDataLoaded) {
      // User data is not yet loaded, you might want to show a loading indicator
      console.log("user data not loaded yet");
      return;
    }
  
    if (!userData.roles || userData.roles === '') {
      console.log('Redirecting to login page');
      navigate('/login');
    } else if (userData.roles.includes('admin')) {
      console.log('Redirecting to admin');
      navigate('/admin');
    }
  }, [userData, userDataLoaded]);


  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

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

  console.log("this is my current role", userData.roles);
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
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(deleteURL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: user.customer_id,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('User deleted successfully');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userid');
        // localStorage.removeItem('roles');
        localStorage.removeItem('isSignedIn');
        setUserData({
          ...userData,
          // accessToken: null,
          userid: null,
          roles: [],
          isSignedIn: false,
        });
        console.log("navigating to homepage...");
        navigate('/');
      } else {
        console.error('Failed to delete user:', data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
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
                  className="block px-4 py-2 text-lg rounded-md hover:bg-gray-700 font-bold"
                >
                  Profile Page
                </a>
              </li>
              <li className="py-2">
                    <button
                    onClick={() => toggleSection('orders')}
                    className="flex items-center justify-between px-4 py-2 text-lg rounded-md hover:bg-gray-700 cursor-pointer"
                    >
                    <span className="mr-20 font-bold">Orders</span>
                    {expandedSection === 'orders' ? <BsCaretUpFill /> : <BsCaretDownFill />}
                    </button>
                    {expandedSection === 'orders' && (
                    <ul className="pl-4 text-lg space-y-1">
                        <li className="hover:bg-gray-700 rounded-md">
                        <a href="/orderToPay" className="block px-2 py-1">To Pay</a>
                        </li>
                        <li className="hover:bg-gray-700 rounded-md">
                        <a href="/orderToShip" className="block px-2 py-1">To Ship</a>
                        </li>
                        <li className="hover:bg-gray-700 rounded-md">
                        <a href="/orderToDeliver" className="block px-2 py-1">To Receive</a>
                        </li>
                        <li className="hover:bg-gray-700 rounded-md">
                        <a href="/orderDelivered" className="block px-2 py-1">Completed</a>
                        </li>
                    </ul>
                    )}
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
                  <div className="flex flex-col items-center">
                    <div className="relative rounded-full h-48 w-48 overflow-hidden">
                      <AdvancedImage
                        key={image}
                        cldImg={cld.image(user.image_url)}
                        className="object-cover h-full w-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-full h-full opacity-0 transition-opacity duration-300 bg-gray-500 hover:opacity-100">
                        <ProfileWidget onImageChange={handleImageChange} />
                      </div>
                    </div>

                    <button
                      className="mt-5 px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                      onClick={updateProfileImage}
                    >
                      Save Profile Image
                    </button>
                  </div>

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

                    <button
                      className="text-base bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 px-4 mt-4 ml-8"
                      onClick={handleDeleteUser}
                    >
                      Delete User
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
