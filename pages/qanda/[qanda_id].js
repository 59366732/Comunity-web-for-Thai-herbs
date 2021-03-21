import React, { useState, useContext, useEffect } from "react";
import db, { auth, storage } from "../../firebase/firebase";
import firebase from "firebase";
import { UserContext } from "../../providers/UserProvider";
import { useRouter } from "next/router";

export const getServerSideProps = async ({ query }) => {
  const content = {};
  content["Question_id"] = query.QnA_id;

  await db
    .collection("QnA")
    .doc(query.QnA_id)
    .get()
    .then((result) => {
      content["title"] = result.data().title;
      content["detail"] = result.data().detail;
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
  return {
    props: {
      Question_id: content.Question_id,
      title: content.title,
      detail: content.detail,
    },
  };
};

const QnApost = (props) => {
  const { user, setUser } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const router = useRouter();

  //input
  const [inputComment, setInputComment] = useState("");

  useEffect(() => {
    db.collection("QnA")
      .doc(props.Question_id)
      .collection("comments")
      .orderBy("timestamp")
      .onSnapshot((snap) => {
        const comment = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(comment);
      });
  }, []);

  const addComment = (e) => {
    e.preventDefault();

    db.collection("QnA").doc(props.Question_id).collection("comments").add({
      userDisplayName: user.displayName,
      comment: inputComment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      likeCount: 0,
    });

    setInputComment("");
  };

  const thumbUp = async (commentid) => {
    let data = await db
      .collection("LikeComment")
      .where("commentid", "==", commentid)
      .where("uid", "==", user.uid)
      .limit(1)
      .get();

    const mapData = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (mapData.length != 0) {
      //there is mapData
      return voteORnot(mapData, commentid);
    } else {
      //there isn't mapData
      const mapData = null;
      return voteORnot(mapData, commentid);
    }
  };

  const voteORnot = (test, commentid) => {
    //increment
    const Increment = firebase.firestore.FieldValue.increment(+1);
    //decrement
    const Decrement = firebase.firestore.FieldValue.increment(-1);

    if (test == null) {
      db.collection("QnA")
        .doc(props.Question_id)
        .collection("comments")
        .doc(commentid)
        .update({ likeCount: Increment });

      db.collection("LikeComment").add({
        uid: user.uid,
        commentid: commentid,
        liked: true,
      });

      return;
    }
    test.map((dt) => {
      if (dt.liked == true) {
        db.collection("QnA")
          .doc(props.Question_id)
          .collection("comments")
          .doc(commentid)
          .update({ likeCount: Decrement });

        db.collection("LikeComment").doc(dt.id).update({ liked: false });
      } else if (dt.liked == false) {
        db.collection("QnA")
          .doc(props.Question_id)
          .collection("comments")
          .doc(commentid)
          .update({ likeCount: Increment });

        db.collection("LikeComment").doc(dt.id).update({ liked: true });
      }
    });
  };

  return (
    <div>
      <h1> หัวข้อ:&nbsp;{props.title}</h1>
      <h2> เนื้อหา:&nbsp;{props.detail}</h2>
      <div>
        {comments.map((comment) => (
          <li key={comment.id}>
            <a>{comment.userDisplayName}</a>&nbsp;:
            <br />
            <a itemProp="hello">{comment.comment}</a>
            <br />
            <a>Like&nbsp;:&nbsp;{comment.likeCount}</a>&nbsp;&nbsp;
            <button onClick={() => thumbUp(comment.id)}>Like</button>
          </li>
        ))}
      </div>

      <form>
        <div>
          <input
            value={inputComment}
            onChange={(e) => setInputComment(e.target.value)}
            placeholder="comment ....."
          />
          <br />
          <button onClick={addComment} type="submit">
            post
          </button>
        </div>
      </form>
      <button onClick={() => router.back()}>
        <a>Back</a>
      </button>
    </div>
  );
};

export default QnApost;
