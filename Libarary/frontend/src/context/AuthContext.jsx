import React, { createContext } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const serverUrl = "https://lib-k433.onrender.com";   // Your backend URL

  const value = { serverUrl };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
