import React, { useEffect, useState, createContext } from "react";
import db, { auth, generateUserDocument } from "../database/firebase";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged(async (userAuth) => {
      const userData = await generateUserDocument(userAuth);
      setUser(userData);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: (user) => setUser(user),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
