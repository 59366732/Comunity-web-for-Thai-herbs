import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import db, { auth, generateUserDocument } from "../firebase/firebase.js";
import { Refresh } from "@material-ui/icons";

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [activateEdit, setActiveEdit] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);

  const toggleEdit = (e) => {
    e.preventDefault();
    setActiveEdit(true);
  };

  const getNewUser = async (u) => {
    const newData = await generateUserDocument(u);
    setUser(newData);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    db.collection("users")
      .doc(user.uid)
      .update({ ...user, displayName })
      .then(
        setActiveEdit(false),
        getNewUser(user)
      );
  };

  const handleCancel = (e) => {
    e.preventDefault();

    setDisplayName(user.displayName);
    setActiveEdit(false);
  };

  return (
    <div>
      {!activateEdit ? (
        <div>
          <div>
            <div
              style={{
                display: "flex-start",
                marginLeft: "40%",
                background: `url(${
                  user.photoURL ||
                  "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
                })  `,
                backgroundSize: "cover",
                height: "200px",
                width: "200px",
              }}
            ></div>
            <form>
              <br />
              <br />
              <label htmlFor="displayName">Display Name:</label>&nbsp;
              <a>{user.displayName}</a>
              <br />
              <br />
              <label htmlFor="userEmail">Email:</label>&nbsp;
              <a>{user.email}</a>
              <br />
              <br />
              <label htmlFor="score">Score:</label>&nbsp;
              <a>{user.score}</a>
              <br />
              <br />
              <label htmlFor="level">Level:</label>&nbsp;
              <a>{user.level}</a>
              <br />
              <br />
              <button onClick={toggleEdit}>
                <a>Edit</a>
              </button>
            </form>
          </div>
          <br />
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex-start",
              marginLeft: "40%",
              background: `url(${
                user.photoURL ||
                "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
              })  `,
              backgroundSize: "cover",
              height: "200px",
              width: "200px",
            }}
          ></div>
          <form>
            <br />
            <br />
            <label htmlFor="displayName">Display Name:</label>&nbsp;
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="diaplayname ?"
            />
            <br />
            <br />
            <label htmlFor="userEmail">Email:</label>&nbsp;
            <a>{user.email}</a>
            <br />
            <br />
            <label htmlFor="score">Score:</label>&nbsp;
            <a>{user.score}</a>
            <br />
            <br />
            <label htmlFor="level">Level:</label>&nbsp;
            <a>{user.level}</a>
            <br />
            <br />
            <button onClick={handleUpdate} type="submit">
              <a>Save change</a>
            </button>
            <div>
              <button onClick={handleCancel} type="submit">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
