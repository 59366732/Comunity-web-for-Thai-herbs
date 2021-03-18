import React, { useState, useEffect, useContext } from "react";
import db, { auth, storage } from "../../firebase/firebase";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { UserContext } from "../../providers/UserProvider";
import firebase from "firebase";

export const getServerSideProps = async ({ query }) => {
  const content = {};
  content["main_id"] = query.id;
  await db
    .collection("herbs")
    .doc(query.id)
    .collection("historys")
    .where("herb_id", "==", query.id)
    .orderBy("timestamp", "desc")
    .limit(1)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (result) {
        content["id"] = result.id;
        content["userDisplayName"] = result.data().userDisplayName;
        content["thaiName"] = result.data().thaiName;
        content["engName"] = result.data().engName;
        content["sciName"] = result.data().sciName;
        content["familyName"] = result.data().familyName;
        content["info"] = result.data().info;
        content["attribute"] = result.data().attribute;
        content["timestamp"] = new Date(
          result.data().timestamp.seconds * 1000
        ).toDateString();
        content["imgUrl"] = result.data().imgUrl;
        content["chemBondUrl"] = result.data().chemBondUrl;
        content["NMRUrl"] = result.data().NMRUrl;
        content["status"] = result.data().status;
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
  return {
    props: {
      main_id: content.main_id,
      id: content.id,
      userDisplayName: content.userDisplayName,
      thaiName: content.thaiName,
      engName: content.engName,
      sciName: content.sciName,
      familyName: content.familyName,
      info: content.info,
      attribute: content.attribute,
      timestamp: content.timestamp,
      imgUrl: content.imgUrl,
      chemBondUrl: content.chemBondUrl,
      NMRUrl: content.NMRUrl,
      status: content.status,
    },
  };
};

const Blog = (props) => {
  dayjs.extend(relativeTime);
  const date = props.timestamp;
  const router = useRouter();

  const { user, setUser } = useContext(UserContext);

  const [activeEdit, setActiveEdit] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [uploadNoti, setUploadNoti] = useState(null);

  //form
  const [thaiNameEdit, setThaiNameEdit] = useState(props.thaiName);
  const [engNameEdit, setEngNameEdit] = useState(props.engName);
  const [sciNameEdit, setSciNameEdit] = useState(props.sciName);
  const [familyNameEdit, setFamilyNameEdit] = useState(props.familyName);
  const [infoEdit, setInfoEdit] = useState(props.info);
  const [attributeEdit, setAttributeEdit] = useState(props.attribute);

  //img
  const [image, setImage] = useState(null);
  const [ImgUrl, setUrl] = useState(props.imgUrl);
  const [newImgUrl, setNewImgUrl] = useState("");

  //Chem bond
  const [chemBond, setChemBond] = useState(null);
  const [chemBondUrl, setChemBondUrl] = useState(props.chemBondUrl); //props.chemBondUrl
  const [newChemBondUrl, setnewChemBondUrl] = useState("");

  //NMR
  const [NMR, setNMR] = useState(null);
  const [NMRUrl, setNMRUrl] = useState(props.NMRUrl); //props.NMRUrl
  const [newNMRUrl, setnewNMRUrl] = useState("");

  auth.onAuthStateChanged((user) => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });

  const toggleEdit = (e) => {
    e.preventDefault();

    setActiveEdit(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    db.collection("herbs")
      .doc(props.main_id)
      .collection("historys")
      .add({
        herb_id: props.main_id,
        userDisplayName: user.displayName,
        thaiName: thaiNameEdit,
        engName: engNameEdit,
        sciName: sciNameEdit,
        familyName: familyNameEdit,
        info: infoEdit,
        attribute: attributeEdit,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        imgUrl: newImgUrl,
        NMRUrl: newNMRUrl,
        chemBondUrl: newChemBondUrl,
        status: "ยังไม่ได้ยืนยัน",
        voteCount: 0,
      })
      .then(setActiveEdit(false));
  };

  const handleCancel = (e) => {
    e.preventDefault();

    db.collection("herbs")
      .doc(props.main_id)
      .collection("historys")
      .doc(props.id)
      .get()
      .then((result) => {
        setThaiNameEdit(result.data().thaiName);
        setEngNameEdit(result.data().engName);
        setSciNameEdit(result.data().sciName);
        setFamilyNameEdit(result.data().familyName);
        setInfoEdit(result.data().info);
        setAttributeEdit(result.data().attribute);
        setNewImgUrl(result.data().imgUrl);
        setnewChemBondUrl(result.data().chemBondUrl);
        setnewNMRUrl(result.data().NMRUrl);
        setActiveEdit(false);
      });
  };

  const handleDelete = (e) => {
    e.preventDefault();

    db.collection("herbs")
      .doc(props.main_id)
      .delete()
      .then(setActiveEdit(false), router.push("/"));
  };

  const uploadImg = (e) => {
    e.preventDefault();
    if (image) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((imgUrl) => {
              setNewImgUrl(imgUrl);
              setUploadNoti("Upload Complete!!");
              setTimeout(() => {
                setUploadNoti(null);
              }, 3000);
            });
        }
      );
    } else {
      setUploadNoti("Please select image!!");
      setTimeout(() => {
        setUploadNoti(null);
      }, 3000);
      return null;
    }
  };

  const uploadNMR = (e) => {
    e.preventDefault();
    if (NMR) {
      const uploadTask = storage.ref(`NMR/${NMR.name}`).put(NMR);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("NMR")
            .child(NMR.name)
            .getDownloadURL()
            .then((NMRUrl) => {
              setNewNMRUrl(NMRUrl);
              setUploadNoti("Upload Complete!!");
              setTimeout(() => {
                setUploadNoti(null);
              }, 3000);
            });
        }
      );
    } else {
      setUploadNoti("Please select image!!");
      setTimeout(() => {
        setUploadNoti(null);
      }, 3000);
      return null;
    }
  };

  const uploadChemBond = (e) => {
    e.preventDefault();
    if (chemBond) {
      const uploadTask = storage.ref(`chemBond/${chemBond.name}`).put(chemBond);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("chemBond")
            .child(chemBond.name)
            .getDownloadURL()
            .then((chemBondUrl) => {
              setnewChemBondUrl(chemBondUrl);
              setUploadNoti("Upload Complete!!");
              setTimeout(() => {
                setUploadNoti(null);
              }, 3000);
            });
        }
      );
    } else {
      setUploadNoti("Please select image!!");
      setTimeout(() => {
        setUploadNoti(null);
      }, 3000);
      return null;
    }
  };

  return (
    <div>
      <div>
        {!activeEdit ? (
          <div>
            <h1>{props.userDisplayName}</h1>
            <h2 style={{ color: "red" }}>สถานะ{props.status}</h2>
            <h2> ชื่อภาษาไทย:&nbsp;{thaiNameEdit}</h2>
            <br />
            <a>ชื่อภาษาอังกฤษ:&nbsp;{engNameEdit}</a>
            <br />
            <a>ชื่อทางวิทยาศาสตร์:&nbsp;{sciNameEdit}</a>
            <br />
            <a>ชื่อวงศ์ :&nbsp;{familyNameEdit}</a>
            <br />
            <a>ข้อมูลสมุนไพร:&nbsp;{infoEdit}</a>
            <br />
            <a>สรรพคุณของสมุนไพร:&nbsp;{attributeEdit}</a>
            <br />
            <img
              src={ImgUrl || "http://via.placeholder.com/200"}
              alt="firebase-image"
            />
            <br />
            <img
              src={chemBondUrl || "http://via.placeholder.com/200"}
              alt="firebase-image"
            />
            <br />
            <img
              src={NMRUrl || "http://via.placeholder.com/200"}
              alt="firebase-image"
            />
            <br />
            <br />
            <a>{date}</a>
            <br />
            <button onClick={() => router.back()}>
              <a>Back</a>
            </button>
            &nbsp;&nbsp;
            {loggedIn && (
              <button onClick={toggleEdit}>
                <a>Edit</a>
              </button>
            )}
            <div>
              <button>
                <a>^</a>
              </button>
              0
              <button>
                <a>v</a>
              </button>
            </div>
            <button key={props.main_id}>
              <Link
                href="../herb/[id]/history/history_list"
                as={"../herb/" + props.main_id + "/history/history_list"}
              >
                <a itemProp="hello">History</a>
              </Link>
            </button>
          </div>
        ) : (
          <form>
            <div>
              ชื่อภาษาไทย:&nbsp;
              <input
                value={thaiNameEdit}
                onChange={(e) => setThaiNameEdit(e.target.value)}
                placeholder="ชื่อสมุนไพรภาษาไทย ?"
              />
              <br />
            </div>
            <div>
              ชื่อภาษาอังกฤษ:&nbsp;
              <input
                value={engNameEdit}
                onChange={(e) => setEngNameEdit(e.target.value)}
                placeholder="ชื่อสมุนไพรภาษาอังกฤษ ?"
              />
              <br />
            </div>
            <div>
              ชื่อทางวิทยาศาสตร์:&nbsp;
              <input
                value={sciNameEdit}
                onChange={(e) => setSciNameEdit(e.target.value)}
                placeholder="ชื่อทางวิทยาศาสตร์ของสมุนไพร ?"
              />
              <br />
            </div>
            <div>
              ชื่อวงศ์:&nbsp;
              <input
                value={familyNameEdit}
                onChange={(e) => setFamilyNameEdit(e.target.value)}
                placeholder="ชื่อวงศ์ของสมุนไพร ?"
              />
              <br />
            </div>
            <div>
              ข้อมูลสมุนไพร:&nbsp;
              <textarea
                value={infoEdit}
                onChange={(e) => setInfoEdit(e.target.value)}
                placeholder="ข้อมูลสมุนไพร ?"
              />
              <br />
            </div>
            <div>
              สรรพคุณของสมุนไพร:&nbsp;
              <textarea
                value={attributeEdit}
                onChange={(e) => setAttributeEdit(e.target.value)}
                placeholder="สรรพคุณของสมุนไพร ?"
              />
              <br />
            </div>
            {uploadNoti !== null && <div>{uploadNoti}</div>}
            <br />
            <div>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <button onClick={uploadImg}>Upload</button>
            </div>
            <br />
            <div>
              <input
                type="file"
                onChange={(e) => setChemBond(e.target.files[0])}
              />
              <button onClick={uploadChemBond}>Upload</button>
            </div>
            <br />
            <div>
              <input type="file" onChange={(e) => setNMR(e.target.files[0])} />
              <button onClick={uploadNMR}>Upload</button>
            </div>
            <div>
              <button onClick={handleUpdate} type="submit">
                Save Change
              </button>
              <br />
            </div>
            <div>
              <button onClick={handleDelete} type="submit">
                Delete
              </button>
            </div>
            <div>
              <button onClick={handleCancel} type="submit">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default Blog;
