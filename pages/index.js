import React, { useState, useEffect } from "react";
import db from "../database/firebase.js";
import Addherb from "./addherb";
import Link from "next/link";
import { auth } from "../database/firebase";

function Home() {
  const [herbs, setHerbs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });
  //แก้ เอาชื่อล่าสุดมานะะะ!!!!
  useEffect(() => {
    db.collection("herbs")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const herbs = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHerbs(herbs);
      });
  }, []);

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        {loggedIn && (
          <div>
            <button>
              <Link href="/addherb">
                <a>add herb</a>
              </Link>
            </button>
          </div>
        )}
        {herbs.map((herb) => (
          <li key={herb.id}>
            <Link href="/herb/[id]" as={"/herb/" + herb.id}>
              <a itemProp="hello">{herb.thaiName}</a>
            </Link>
          </li>
        ))}
      </div>
    </div>
  );
}

export default Home;
