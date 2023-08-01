  import { createContext, useState } from 'react';

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

    return (
      <AuthContext.Provider value={{ userData, setUserData }}>
        {children}
      </AuthContext.Provider>
    );
  };

  export { AuthContext, AuthProvider };
