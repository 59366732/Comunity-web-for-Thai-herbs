import React, { useContext, useState, useEffect } from "react";
import db, { auth } from "../../../../firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import firebase from "firebase";
import { UserContext } from "../../../../providers/UserProvider";

export const getServerSideProps = async ({ query }) => {
  const content = {};
  content["main_id"] = query.id;

  return {
    props: {
      main_id: content.main_id,
    },
  };
};

const history = (props) => {
  const { user, setUser } = useContext(UserContext);
  const [historys, setHistorys] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [notification, setNotification] = useState("");

  const router = useRouter();

  auth.onAuthStateChanged((user) => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });

  useEffect(() => {
    db.collection("herbs")
      .doc(props.main_id)
      .collection("historys")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const history = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistorys(history);
      });
  }, []);

  const getdata = async (hisid) => {
    let data = await db
      .collection("vote")
      .where("herbid", "==", hisid)
      .where("uid", "==", user.uid)
      .limit(1)
      .get();

    const mapData = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(mapData);

    if (mapData.length != 0) {
      //there is mapData
      return voteORnot(mapData, hisid);
    } else {
      //there isn't mapData
      const mapData = null;
      return voteORnot(mapData, hisid);
    }
  };

  const voteORnot = (test, hisid) => {
    //increment
    const userIncre = firebase.firestore.FieldValue.increment(+1);
    const knownUserIncre = firebase.firestore.FieldValue.increment(+2);
    const trustUserIncre = firebase.firestore.FieldValue.increment(+10);
    //decrement
    const userDecre = firebase.firestore.FieldValue.increment(-1);
    const knownUserDecre = firebase.firestore.FieldValue.increment(-2);
    const trustUserDecre = firebase.firestore.FieldValue.increment(-10);

    console.log(test);
    if (test == null) {
      if (user.level == "user") {
        db.collection("herbs")
          .doc(props.main_id)
          .collection("historys")
          .doc(hisid)
          .update({ voteCount: userIncre });
      }

      if (user.level == "known user") {
        db.collection("herbs")
          .doc(props.main_id)
          .collection("historys")
          .doc(hisid)
          .update({ voteCount: knownUserIncre });
      }

      if (user.level == "trust user") {
        db.collection("herbs")
          .doc(props.main_id)
          .collection("historys")
          .doc(hisid)
          .update({ voteCount: trustUserIncre });
      }

      db.collection("vote").add({
        uid: user.uid,
        herbid: hisid,
        voted: true,
      });

      return;
    }
    test.map((dt) => {
      if (dt.voted == true) {
        if (user.level == "user") {
          db.collection("herbs")
            .doc(props.main_id)
            .collection("historys")
            .doc(hisid)
            .update({ voteCount: userDecre });
        }

        if (user.level == "known user") {
          db.collection("herbs")
            .doc(props.main_id)
            .collection("historys")
            .doc(hisid)
            .update({ voteCount: knownUserDecre });
        }

        if (user.level == "trust user") {
          db.collection("herbs")
            .doc(props.main_id)
            .collection("historys")
            .doc(hisid)
            .update({ voteCount: trustUserDecre });
        }

        db.collection("vote").doc(dt.id).update({ voted: false });
      } else if (dt.voted == false) {
        if (user.level == "user") {
          db.collection("herbs")
            .doc(props.main_id)
            .collection("historys")
            .doc(hisid)
            .update({ voteCount: userIncre });
        }

        if (user.level == "known user") {
          db.collection("herbs")
            .doc(props.main_id)
            .collection("historys")
            .doc(hisid)
            .update({ voteCount: knownUserIncre });
        }

        if (user.level == "trust user") {
          db.collection("herbs")
            .doc(props.main_id)
            .collection("historys")
            .doc(hisid)
            .update({ voteCount: trustUserIncre });
        }

        db.collection("vote").doc(dt.id).update({ voted: true });
      }
    });
  };

  // const incrementVote = (id) => {
  //   const increment = firebase.firestore.FieldValue.increment(+1);

  //   //check that this user voted or not?
  //   if (liked) {
  //     //disable vote up button
  //     return null;
  //   } else {
  //     //increase vote count
  //     db.collection("herbs")
  //       .doc(props.main_id)
  //       .collection("historys")
  //       .doc(id)
  //       .update({ voteCount: increment })
  //       .then(setLiked(true)); //set this user voted this herb
  //   }
  // };

  // const decrementVote = (id) => {
  //   const decrement = firebase.firestore.FieldValue.increment(-1);

  //   if (!liked) {
  //     return null;
  //   } else {
  //     db.collection("herbs")
  //       .doc(props.main_id)
  //       .collection("historys")
  //       .doc(id)
  //       .update({ voteCount: decrement })
  //       .then(setLiked(false));
  //   }
  // };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1>history</h1>
        {historys.map((history) => (
          <li key={history.id}>
            <Link
              href="../../../herb/[id]/history/detail/[detail_id]"
              as={
                "../../../herb/" +
                props.main_id +
                "/history/detail/" +
                history.id
              }
            >
              <>
                {history.thaiName}&nbsp;&nbsp;
                {new Date(history.timestamp.seconds * 1000).toDateString()}
                &nbsp;&nbsp;
                <a style={{ color: "red" }}>{history.status}</a>&nbsp;&nbsp;
                {history.voteCount}
              </>
            </Link>
            {loggedIn && (
              <>
                {/* <button onClick={() => incrementVote(history.id)}>^</button>
                <button onClick={() => decrementVote(history.id)}>v</button> */}
                <button onClick={() => getdata(history.id)}>vote</button>
              </>
            )}
          </li>
        ))}
        <br />
        <br />
        <button onClick={() => router.back()}>
          <a>Back</a>
        </button>
      </div>
    </div>
  );
};

export default history;
