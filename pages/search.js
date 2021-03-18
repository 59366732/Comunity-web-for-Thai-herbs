// import React, { useState } from "react";
// import db from "../firebase/firebase.js";
// import Link from "next/link";

// function Search() {
//   const [herbs, setHerbs] = useState([]);
//   const [searchName, setSearchName] = useState([]);
//   const [error, setError] = useState(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (searchName) {
//       db.collection("herbs")
//         .where("thaiName", "==", searchName)
//         .orderBy("timestamp", "desc")
//         .onSnapshot((snapshot) =>
//           setHerbs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
//         );
//     } else {
//       setError("Please type something!");
//       setTimeout(() => {
//         setError(null);
//       }, 2000);
//     }

//     setSearchName("");
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       {error !== null && <div>{error}</div>}
//       <form>
//         <input
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
//           placeholder="search by name"
//         />
//         <button onClick={handleSubmit} type="submit">
//           search
//         </button>
//       </form>
//       <div>
//         {/*vvvv ตรงนี้ยังไม่ได้ vvvv  ในsubmitเพิ่มให้มันส่งค่าอะไรออะมาซักอย่างเพื่อเชค*/}
//         {herbs ? (
//           herbs.map((herb) => (
//             <li key={herb.id}>
//               <Link href="/herb/[id]" as={"/herb/" + herb.id}>
//                 <a itemProp="hello">{herb.herbname}</a>
//               </Link>
//             </li>
//           ))
//         ) : (
//           <h1>No matching documents</h1>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Search;

import React, { Component, useState } from "react";
import AsyncSelect from "react-select/async";
import db from "../firebase/firebase";

function Search() {
  const [selectedTag, setSelectedTag] = useState([]);

  const loadOptions = async (inputValue) => {
    inputValue = inputValue.toLowerCase().replace(/\W/g, "");
    return new Promise((resolve) => {
      db.collection("herbs")
        .orderBy("timestamp")
        .startAt(inputValue)
        .endAt(inputValue + "\uf8ff")
        .get()
        .then((docs) => {
          if (!docs.empty) {
            let recommendedTags = [];
            docs.forEach(function (doc) {
              const tag = {
                value: doc.id,
                label: doc.data().thaiName,
              };
              recommendedTags.push(tag);
            });
            return resolve(recommendedTags);
          } else {
            return resolve([]);
          }
        });
    });
  };

  handleOnChange = (tags) => {
    this.setState({
      selectedTag: [tags],
    });
  };

  return (
    <div>
      <AsyncSelect
        value={selectedTag}
        loadOptions={loadOptions}
        onChange={(e) => setSelectedTag(e.target.value)}
      />
      <p>Selected Tag:</p>
      {this.state.selectedTag.map((e) => {
        return <li key={e.value}>{e.label}</li>;
      })}
    </div>
  );
}

export default Search;
