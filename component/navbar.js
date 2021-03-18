//Material-ui
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import Link from "next/link";
// import { auth } from "../firebase/firebase";
import { auth, firestore, generateUserDocument } from "../firebase/firebase";

import { UserContext } from "../providers/UserProvider";
import { useContext, useState, useEffect } from "react";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);

  const [loggedIn, setLoggedIn] = useState(false);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });

  return (
    <AppBar>
      <Toolbar className="navbar-container">
        <h3>เว็บชุมชนสมุนไพรไทย</h3>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button color="inherit">
          <Link href="/">
            <a>หน้าแรก</a>
          </Link>
        </Button>
        <Button color="inherit">
          <Link href="/search">
            <a>ค้นหา</a>
          </Link>
        </Button>
        <Button color="inherit">
          <Link href="/QnA">
            <a>ถาม-ตอบ</a>
          </Link>
        </Button>
        <Button color="inherit">
          {!loggedIn ? (
            <Link href="/signup">
              <a>สมัครสมาชิก</a>
            </Link>
          ) : (
            <Link href="/profilepage">
              <a>สวัสดี{user.displayName} !</a>
            </Link>
          )}
        </Button>
        <Button color="inherit">
          {!loggedIn ? (
            <Link href="/signin">
              <a>เข้าสู่ระบบ</a>
            </Link>
          ) : (
            <div
              onClick={() => {
                auth.signOut();
              }}
            >
              <a>ออกจากระบบ</a>
            </div>
          )}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
