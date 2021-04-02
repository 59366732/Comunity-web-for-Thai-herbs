import Link from "next/link";
import { auth, firestore, generateUserDocument } from "../../database/firebase";

import { UserContext } from "../../providers/UserProvider";
import { useContext, useState, useEffect } from "react";

import { Home, KeyboardArrowUp } from "@material-ui/icons";
import HideOnScroll from "./components/hideonscroll";
import SideDrawer from "./components/sidedrawer";
import BackToTop from "./components/backtotop";

import {
	Avatar,
	Divider,
	Button,
	Box,
	Grid,
	Badge,
	AppBar,
	Container,
	Hidden,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	makeStyles,
	withStyles,
	Toolbar,
	Typography,
} from "@material-ui/core";

import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import Fab from "@material-ui/core/Fab";
import Popover from "@material-ui/core/Popover";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import Slide from "@material-ui/core/Slide";


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
export default function ConfirmLogout() {
	return (
		<>
			<span>
				<Dialog
					open={openLogout}
					TransitionComponent={Transition}
					keepMounted
					onClose={handleCloseLogout}
					PaperComponent={PaperComponent}
					aria-labelledby="draggable-dialog-title"
				>
					<DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
						<Typography>ยืนยันออกจากระบบ</Typography>
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							คุณต้องการออกจากระบบหรือไม่?
							คลิก(ใช่)เพื่อออกจากระบบหรือคลิก(ไม่ใช่)เพื่อคงอยู่ในระบบ.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button autoFocus onClick={handleCloseLogout} color="default">
							<Typography>ไม่ใช่</Typography>
						</Button>
						<Link href="/">
							<Button
								onClick={() => {
									auth.signOut();
								}}
								color="primary"
							>
								<Typography>ใช่</Typography>
							</Button>
						</Link>
					</DialogActions>
				</Dialog>
			</span>
		</>
	);
}
