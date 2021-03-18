import React, { useState, useContext } from "react";
import db, { auth, storage } from "../firebase/firebase.js";
import firebase from "firebase";
import { useRouter } from "next/router";
import { UserContext } from "../providers/UserProvider";

function Addherb() {
  const [error, setError] = useState(null);
  const [uploadNoti, setUploadNoti] = useState(null);

  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  //herb form
  const [thaiName, setThaiName] = useState("");
  const [engName, setEngName] = useState("");
  const [sciName, setSciName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [info, setInfo] = useState("");
  const [attribute, setAttribute] = useState("");

  //img
  const [image, setImage] = useState(null);
  const [imgUrl, setImgUrl] = useState("");

  //NMR
  const [NMR, setNMR] = useState(null);
  const [NMRUrl, setNMRUrl] = useState("");

  //Chem bond
  const [chemBond, setChemBond] = useState(null);
  const [chemBondUrl, setChemBondUrl] = useState("");

  const pushToHistory = async (herb_id) => {
    const data = await db.collection("herbs").doc(herb_id).get();

    db.collection("herbs").doc(herb_id).collection("historys").add({
      herb_id: data.id,
      userDisplayName: data.data().userDisplayName,
      thaiName: data.data().thaiName,
      engName: data.data().engName,
      sciName: data.data().sciName,
      familyName: data.data().familyName,
      info: data.data().info,
      attribute: data.data().attribute,
      timestamp: data.data().timestamp,
      imgUrl: data.data().imgUrl,
      NMRUrl: data.data().NMRUrl,
      chemBondUrl: data.data().chemBondUrl,
      status: data.data().status,
      vote: data.data().vote,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (thaiName && info) {
      db.collection("herbs")
        .add({
          userDisplayName: user.displayName,
          thaiName: thaiName,
          engName: engName,
          sciName: sciName,
          familyName: familyName,
          info: info,
          attribute: attribute,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          imgUrl: imgUrl,
          NMRUrl: NMRUrl,
          chemBondUrl: chemBondUrl,
          status: "ยังไม่ได้ยืนยัน",
          voteCount: 0,
        })
        .then((result) => {
          pushToHistory(result.id);
        });
    } else {
      setError("At least ,you have to input thai name and basic information!!");
      setTimeout(() => {
        setError(null);
      }, 3000);
      return null;
    }

    setThaiName("");
    setEngName("");
    setSciName("");
    setFamilyName("");
    setInfo("");
    setAttribute("");
    setImage(null);
    setImgUrl("");
    setNMR(null);
    setNMRUrl("");
    setChemBond(null);
    setChemBondUrl("");
    router.push("/");
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
              setImgUrl(imgUrl);
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
              setNMRUrl(NMRUrl);
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
              setChemBondUrl(chemBondUrl);
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
        <h1>เพื่มข้อมูลสมุนไพรไทย</h1>
        {error !== null && <div>{error}</div>}
        <form>
          <div>
            ชื่อภาษาไทย:&nbsp;
            <input
              value={thaiName}
              onChange={(e) => setThaiName(e.target.value)}
              placeholder="ชื่อสมุนไพรภาษาไทย ?"
            />
            <br />
          </div>
          <div>
            ชื่อภาษาอังกฤษ:&nbsp;
            <input
              value={engName}
              onChange={(e) => setEngName(e.target.value)}
              placeholder="ชื่อสมุนไพรภาษาอังกฤษ ?"
            />
            <br />
          </div>
          <div>
            ชื่อทางวิทยาศาสตร์:&nbsp;
            <input
              value={sciName}
              onChange={(e) => setSciName(e.target.value)}
              placeholder="ชื่อทางวิทยาศาสตร์ของสมุนไพร ?"
            />
            <br />
          </div>
          <div>
            ชื่อวงศ์ :&nbsp;
            <input
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="ชื่อวงศ์ของสมุนไพร ?"
            />
            <br />
          </div>
          <div>
            ข้อมูลสมุนไพร:&nbsp;
            <textarea
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              placeholder="ข้อมูลสมุนไพร ?"
            />
            <br />
          </div>
          <div>
            สรรพคุณของสมุนไพร:&nbsp;
            <textarea
              value={attribute}
              onChange={(e) => setAttribute(e.target.value)}
              placeholder="สรรพคุณของสมุนไพร ?"
            />
            <br />
          </div>
          {uploadNoti !== null && <div>{uploadNoti}</div>}
          <div>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <button onClick={uploadImg}>Upload</button>
          </div>
          <div>
            <input
              type="file"
              onChange={(e) => setChemBond(e.target.files[0])}
            />
            <button onClick={uploadChemBond}>Upload</button>
          </div>
          <div>
            <input type="file" onChange={(e) => setNMR(e.target.files[0])} />
            <button onClick={uploadNMR}>Upload</button>
          </div>
          <button onClick={handleSubmit} type="submit">
            submit
          </button>
        </form>
        <button onClick={() => router.back()}>
          <a>Back</a>
        </button>
      </div>
    </div>
  );
}

export default Addherb;
