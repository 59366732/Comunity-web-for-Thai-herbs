import * as React from "react";
import Link from "next/link";
import db, {
	auth,
	firestore,
	generateUserDocument,
} from "../../../database/firebase";
import { UserContext } from "../../../providers/UserProvider";
import { useContext, useState, } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import Slide from "@material-ui/core/Slide";
import {
	Avatar,
	Badge,
	Button,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Typography,
	withStyles,
	makeStyles,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import Fab from "@material-ui/core/Fab";
import Popover from "@material-ui/core/Popover";

function PaperComponent(props) {
	return (
		<Draggable
			handle="#draggable-dialog-title"
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	list: {
		width: 175,
		backgroundColor: "#32CD32",
	},
	linkText: {
		textDecoration: `none`,
		textTransform: `uppercase`,
		color: `white`,
		textOverflow: "ellipsis",
	},
	avatar: {
		width: theme.spacing(3),
		height: theme.spacing(3),
	},
	typography: {
		padding: theme.spacing(2),
	},
}));

const ProfileStyledBadge = withStyles((theme) => ({
	badge: {
		backgroundColor: "#44b700",
		color: "#44b700",
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		"&::after": {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			borderRadius: "50%",
			animation: "$ripple 1.0s infinite ease-in-out",
			border: "1px solid currentColor",
			content: '""',
		},
	},
	"@keyframes ripple": {
		"0%": {
			transform: "scale(.8)",
			opacity: 1,
		},
		"100%": {
			transform: "scale(2.4)",
			opacity: 0,
		},
	},
}))(Badge);

const NotiStyledBadge = withStyles((theme) => ({
	badge: {
		right: -3,
		top: 7,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: "0 4px",
	},
}))(Badge);

const SideDrawer = () => {
	const classes = useStyles();
	const [state, setState] = useState({ right: false });

	const { user, setUser } = useContext(UserContext);

	const [loggedIn, setLoggedIn] = useState(false);

	const [open, setOpen] = React.useState(false);
	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ [anchor]: open });
	};

	const sideDrawerList = (anchor) => (
		<div>
			<div
				className={classes.list}
				role="presentation"
				onClick={toggleDrawer(anchor, false)}
				onKeyDown={toggleDrawer(anchor, false)}
			>
				<List
					component="nav"
					style={{ display: "flex", flexDirection: "column" }}
				>
					<Link href="/">
						<IconButton style={{ color: `white`}}>
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
					{!loggedIn ? (
						<>
							<Link href="/signup">
								<IconButton style={{ color: `white` }}>
									<Typography>ลงทะเบียน</Typography>
								</IconButton>
							</Link>
							<Link href="/signin">
								<IconButton style={{ color: `white` }}>
									<Typography>เข้าสู่ระบบ</Typography>
								</IconButton>
							</Link>
						</>
					) : (
						<>
							<Link href="/profilepage">
								<IconButton>
									<ProfileStyledBadge
										overlap="circle"
										anchorOrigin={{
											vertical: "bottom",
											horizontal: "right",
										}}
										variant="dot"
									>
										<Avatar
											src={user.photoURL}
											alt="avatar"
											className={classes.avatar}
										/>
									</ProfileStyledBadge>
									<Typography
										style={{
											color: "white",
											textTransform: "capitalize",
											paddingLeft: "5px",
										}}
									>
										{user.displayName}
									</Typography>
								</IconButton>
							</Link>
							<IconButton onClick={handleClickOpen}>
								<Typography style={{ color: `red` }}>ออกจากระบบ</Typography>
							</IconButton>
							<Dialog
								open={open}
								TransitionComponent={Transition}
								keepMounted
								onClose={handleClose}
								PaperComponent={PaperComponent}
								aria-labelledby="draggable-dialog-title"
							>
								<DialogTitle
									style={{ cursor: "move" }}
									id="draggable-dialog-title"
								>
									<Typography>ยืนยันออกจากระบบ</Typography>
								</DialogTitle>
								<DialogContent>
									<DialogContentText>
										คุณต้องการออกจากระบบหรือไม่?
										คลิก(ใช่)เพื่อออกจากระบบหรือคลิก(ไม่ใช่)เพื่อคงอยู่ในระบบ.
									</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button autoFocus onClick={handleClose} color="default">
										<Typography>ไม่ใช่</Typography>
									</Button>
									<Button
										onClick={() => {
											auth.signOut();
										}}
										color="primary"
									>
										<Typography>ใช่</Typography>
									</Button>
								</DialogActions>
							</Dialog>
						</>
					)}
				</List>
			</div>
		</div>
	);

	return (
		<React.Fragment>
			<IconButton
				edge="start"
				aria-label="menu"
				onClick={toggleDrawer("right", true)}
			>
				<Menu fontSize="large" style={{ color: `white` }} />
			</IconButton>

			<Drawer
				anchor="right"
				open={state.right}
				// onOpen={toggleDrawer("right", true)}
				onClose={toggleDrawer("right", false)}
			>
				{sideDrawerList("right")}
			</Drawer>
		</React.Fragment>
	);
};

export default SideDrawer;
