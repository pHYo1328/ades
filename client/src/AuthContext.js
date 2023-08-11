import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    // accessToken: null,
    userid: null,
    roles: '',
    isSignedIn: false,
    admin_id: null,
    isAdminSignedIn: false,
  });

  const [userDataLoaded, setUserDataLoaded] = useState(false);
  
  // Load user data from localStorage when the component mounts
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData) {
      setUserData(storedUserData);
    }
    setUserDataLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  return (
    <AuthContext.Provider value={{ userData, setUserData, userDataLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };




// import { createContext, useState } from 'react';

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [userData, setUserData] = useState({
//     // accessToken: null,
//     userid: null,
//     roles: '',
//     isSignedIn: false,
//     admin_id: null,
//     isAdminSignedIn: false,
//   });

//   return (
//     <AuthContext.Provider value={{ userData, setUserData }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext, AuthProvider };
