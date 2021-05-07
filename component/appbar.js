import Link from "next/link";
import { useState, useContext } from "react";
import Navbar0 from "./customs/navbar";
import { auth, firestore, } from "../database/firebase";
import { UserContext } from "../providers/UserProvider";
import { AppBar, Button } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
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
	const Navbar1 = () => {
		return (
			<AppBar>
				<Toolbar>
					<Link href="/">
						<IconButton
							edge="start"
							aria-label="home"
							href="/"
							style={{ color: `white`, fontSize: "200%" }}
						>
							เว็บชุมชนสมุนไพรไทย
						</IconButton>
					</Link>
					<Link href="/">
						<IconButton style={{ color: `white`, margin: "0 0 0 500px" }}>
							<Typography>หน้าแรก</Typography>
						</IconButton>
					</Link>
					<Link href="/search">
						<IconButton style={{ color: `white` }}>
							<Typography>ค้นหา</Typography>
						</IconButton>
					</Link>
					<Link href="/qanda">
						<IconButton style={{ color: `white` }}>
							<Typography>ถาม-ตอบ</Typography>
						</IconButton>
					</Link>
					<Link href="/signup">
						<IconButton style={{ color: `white` }}>
							<Typography>ลงทะเบียน</Typography>
						</IconButton>
					</Link>
					<Link href="/signin">
						<IconButton style={{ color: `white` }}>
							<Typography>ลงชื่อใช้งาน</Typography>
						</IconButton>
					</Link>
				</Toolbar>
			</AppBar>
		);
	};
	const Navbar2 = () => {
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
	};
	return (
		<React.Fragment>
			<Navbar0 />
		</React.Fragment>
	);
}
