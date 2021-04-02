import React from "react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../providers/UserProvider";
import db, { auth } from "../database/firebase.js";
import firebase from "firebase";
import { useRouter } from "next/router";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import { fade, makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import Draggable, { DraggableCore } from "react-draggable";
import Slide from "@material-ui/core/Slide";
import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import {
	Grid,
	AppBar,
	Toolbar,
	Container,
	CssBaseline,
	Box,
	IconButton,
	TexField,
	Typography,
	TextField,
	List,
	ListItem,
} from "@material-ui/core/";

const frameStyles = {
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	justifyContent: "center",
	border: "solid 1px #00b906",
	paddingTop: "10px",
	paddingRight: "10px",
	paddingBottom: "10px",
	paddingLeft: "10px",
	marginTop: "10px",
	marginBottom: "10px",
	marginRight: "10px",
	marginLeft: "10px",
};

const useStyles = makeStyles((theme) => ({
	mainDiv: {
		marginTop: theme.spacing(2),
	},
	root: {
		display: `flex`,
		flexDirection: "column",
		justifyContent: `space-between`,
		alignItem: "center",
		width: "100%",
		backgroundColor: theme.palette.background.paper,
	},
	inline: {
		display: "inline",
		textIndent: "20px",
	},
	titleBarFlex: {
		marginTop: theme.spacing(1),
		display: `flex`,
		justifyContent: `space-between`,
	},
	titleDisplayFlex: {
		display: `flex`,
		justifyContent: `space-between`,
	},
	titleText: {
		textDecoration: `none`,
		textTransform: `uppercase`,
		color: `white`,
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(1),
			width: "auto",
		},
	},
	appBar: {
		position: "relative",
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: "25ch",
	},
	backButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
	editButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
	historyButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
	savechangeButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
	deleteButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
	cancelButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
	grid: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
		flexDirection: "row",
		display: "flex",
		padding: theme.spacing(2),
		justifyContent: "center",
		justifyItems: "space-around",
	},
	title: {
		display: "inline",
		fontWeight: "bold",
		variant: "h3",
	},
	titleEdit: {
		fontWeight: "bold",
		variant: "h3",
		textDecoration: "underline",
	},
	space: {
		display: "inline",
	},
	content: {
		display: "inline",
		fontWeight: "normal",
		textDecoration: "none",
	},
	// paper: {
	// 	padding: theme.spacing(2),
	// 	textAlign: "center",
	// 	color: theme.palette.text.secondary,
	// },
	cardRoot: {
		flexGrow: 1,
		padding: theme.spacing(2),
	},
	DAC: {
		marginBottom: "30px",
	},
	DIC: {
		marginBottom: "30px",
	},
	imageCard: {
		minWidth: "auto",
		maxWidth: "auto",
		marginTop: "10px",
		marginBottom: "10px",
		backgroundColor: "#ffffff",
	},
	attributeCard: {
		minWidth: "auto",
		maxWidth: "auto",
		marginTop: "10px",
		marginBottom: "10px",
		backgroundColor: "#f8f8ff",
	},
	userCard: {
		paddingLeft: "10px",
		paddingRight: "10px",
		width: "fit-content",
		minWidth: "auto",
		maxWidth: "auto",
	},
	userName: {
		display: "inline",
		color: "#007FFF",
	},
	dateTitle: {
		display: "inline",
		fontWeight: "bold",
		float: "left",
	},
	date: {
		fontWeight: "normal",
		color: "#007FFF",
		display: "inline",
	},
	herbDetail: {
		fontWeight: "normal",
		textIndent: "20px",
	},
	snackbar: {
		width: "100%",
		"& > * + *": {
			marginTop: theme.spacing(2),
		},
	},
	dialogPaper: {
		display: "flex",
		flexDirection: "column",
		margin: "auto",
		width: "960px",
		minWidth: "360px",
		height: "720px",
		minHeight: "480px",
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
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

const AddQuestion = () => {
	const classes = useStyles();
	const theme = useTheme();

	const { user, setUser } = useContext(UserContext);
	const [loggedIn, setLoggedIn] = useState(false);

	const router = useRouter();

	//input
	const [title, setTitle] = useState("");
	const [detail, setDetail] = useState("");

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		db.collection("QnA").add({
			userDisplayName: user.displayName,
			title: title,
			detail: detail,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			likeCount: 0,
		});

		setTitle("");
		setDetail("");
		router.push("/QnA");
	};

	// const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const [fullScreen, setFullScreen] = React.useState("true");
	const [fullWidth, setFullWidth] = React.useState("true");
	const [maxWidth, setMaxWidth] = React.useState("md");
	const [open, setOpen] = React.useState(false);
	const [error, setError] = useState(null);

	const [questionTitle, setQuestionTitle] = useState("");
	const [questionDetail, setQuestionDetail] = useState("");

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const ConfirmCancel = () => {
		const [openDialog, setOpenDialog] = React.useState(false);
		const handleClickOpenDialog = () => {
			setOpenDialog(true);
		};

		const handleCloseDialog = () => {
			setOpenDialog(false);
		};
		return (
			<div>
				<Button
					className={classes.backButton}
					onClick={handleClickOpenDialog}
					color="default"
					variant="outlined"
					startIcon={<CancelIcon />}
				>
					<Typography style={{ color: "black" }}>ยกเลิก</Typography>
				</Button>
				<Dialog
					open={openDialog}
					TransitionComponent={Transition}
					keepMounted
					onClose={handleCloseDialog}
					PaperComponent={PaperComponent}
					aria-labelledby="draggable-dialog-title"
				>
					<DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
						<Typography>ยืนยันการยกเลิกการแก้ไข</Typography>
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							คุณต้องการยกเลิกการตั้งกระทู้ถามใช่หรือไม่?
							คลิก(ใช่)เพื่อยกเลิกการตั้งกระทู้ถาม
							หรือคลิก(ไม่ใช่)เพื่อดำเนินการตั้งกระทู้ถามต่อ.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button autoFocus onClick={handleCloseDialog} color="default">
							<Typography>ไม่ใช่</Typography>
						</Button>
						<Button autoFocus onClick={handleClose} color="primary">
							<Typography>ใช่</Typography>
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	};

	return (
		<div>
			<ListItem>
				<Button onClick={handleClickOpen}>
					<Typography className={classes.titleText}>ตั้งกระทู้ถาม</Typography>
				</Button>
			</ListItem>
			<Dialog
				disableBackdropClick={true}
				disableEscapeKeyDown={true}
				fullscreen={fullScreen}
				fullwidth={fullWidth}
				maxWidth={maxWidth}
				open={open}
				onClose={handleClose}
				PaperComponent={PaperComponent}
				aria-labelledby="draggable-dialog-title"
			>
				<div
					fullscreen={fullScreen}
					fullwidth={fullWidth}
					maxwidth={maxWidth}
					className={classes.dialogPaper}
				>
					<DialogTitle>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton
									edge="start"
									color="inherit"
									onClick={handleClose}
									aria-label="close"
								>
									<CloseIcon />
								</IconButton>
								<Typography variant="h6" className={classes.title}>
									ตั้งกระทู้ถาม
								</Typography>
								<IconButton
									edge="end"
									color="inherit"
									onClick={handleClose}
									aria-label="close"
								>
									<CloseIcon />
								</IconButton>
							</Toolbar>
						</AppBar>
					</DialogTitle>
					<DialogContent dividers>
						<Box>
							{error !== null && <div>{error}</div>}
							<form>
								<div>
									<Typography className={classes.title}>
										หัวข้อคำถาม:
									</Typography>
									<TextField
										fullWidth
										variant="filled"
										fontFamily="sans-serif"
										placeholder="ตั้งชื่อหัวข้อคำถาม ?"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
									/>
								</div>
								<br />
								<br />
								<div>
									<Typography className={classes.title}>
										รายละเอียดคำถาม:
									</Typography>
									<TextField
										fullWidth
										multiline
										variant="filled"
										fontFamily="sans-serif"
										rows={14}
										placeholder="พิมพ์รายละเอียดคำถาม ?"
										value={detail}
										onChange={(e) => setDetail(e.target.value)}
									/>
								</div>
							</form>
						</Box>
					</DialogContent>
					<DialogActions>
						<ConfirmCancel />
						<div>
							<Button
								className={classes.savechangeButton}
								onClick={handleSubmit}
								type="submit"
								color="primary"
								startIcon={<SaveIcon />}
							>
								<Typography>บันทึก</Typography>
							</Button>
						</div>
					</DialogActions>
				</div>
			</Dialog>
		</div>
	);
}
export default AddQuestion;