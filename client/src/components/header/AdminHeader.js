// import React, { useState, useEffect, useRef, useContext } from 'react';
// import { AuthContext } from '../../AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

// const Header = () => {
//   const userPanelRef = useRef(null);
//   const navigate = useNavigate();
//   const { userData, setUserData } = useContext(AuthContext);

//   // const handleOutsideClick = (event) => {
//   //   if (userPanelRef.current && !userPanelRef.current.contains(event.target)) {
//   //     setIsUserPanelOpen(false);
//   //   }
//   // };

//   const onHandleAdminLogout = async () => {
//     try {
//       await fetch(`${baseUrl}/logout`, {
//         method: 'PUT',
//         credentials: 'include',
//       });
//     } catch (error) {
//       console.error(error);
//     }
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('admin_id');
//     localStorage.removeItem('isAdminSignedIn');
//     setUserData({
//       ...userData,
//       accessToken: null,
//       admin_id: null,
//       roles: [],
//       isAdminSignedIn: false,
//     });
//     navigate('/');
//   };

//   // useEffect(() => {
//   //   document.addEventListener('click', handleOutsideClick);

//   //   return () => {
//   //     document.removeEventListener('click', handleOutsideClick);
//   //   };
//   // }, []);

//   return (
//     <header className="bg-white shadow top-0 left-0 sticky z-2">
//       <div className="container mx-auto px-4 py-6">
//         <nav className="flex items-center justify-between">
//           <div className="flex items-center">
//             <Link to="/" className="text-lg font-bold text-gray-800">
//               TECHZERO
//             </Link>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Link to="/admin" className="text-gray-800 hover:text-gray-600">
//               Dashboard
//             </Link>
//             <Link
//               to="/products/create"
//               className="text-gray-800 hover:text-gray-600"
//             >
//               Create
//             </Link>

//             <button
//               className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md text-lg"
//               onClick={onHandleAdminLogout}
//             >
//               Log Out
//             </button>
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;
