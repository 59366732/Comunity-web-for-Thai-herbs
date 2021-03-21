import React, { useEffect, useState, createContext } from "react";
import db, { auth, generateActivity } from "../database/firebase";

export const ActivityContext = createContext();

const ActivityProvider = ({ children }) => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged(async (userAuth) => {
      const activityData = await generateActivity(userAuth);
      setActivity(activityData);
    });
  }, []);

  return (
    <ActivityContext.Provider
      value={{
        activity: activity,
        setActivity: (activity) => setActivity(activity),
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export default ActivityProvider;
