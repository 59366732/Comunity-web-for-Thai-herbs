import React from "react";
import Link from "next/link";
import db, { auth, storage } from "../../database/firebase";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReplyIcon from "@material-ui/icons/Reply";
import Portal from "@material-ui/core/Portal";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { fade, makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import Draggable, { DraggableCore } from "react-draggable";
import Slide from "@material-ui/core/Slide";

import {
	Avatar,
	Chip,
	Snackbar,
	Box,
	Icon,
	Paper,
	Button,
	Grid,
	Card,
	CardActions,
	CardActionArea,
	CardMedia,
	CardContent,
	Typography,
	CardHeader,
	TextField,
	Container,
	CssBaseline,
	ThemeProvider,
} from "@material-ui/core/";

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

const frameStyles = {
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	justifyContent: "center",
	border: "solid 1px #00b906",
	paddingTop: "20px",
	paddingRight: "20px",
	paddingBottom: "20px",
	paddingLeft: "20px",
	marginTop: "20px",
	marginBottom: "20px",
	marginRight: "20px",
	marginLeft: "20px",
};

const replyBorder = {
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	justifyContent: "center",
	border: "solid 1px #00b906",
	paddingTop: "20px",
	paddingRight: "20px",
	paddingBottom: "20px",
	paddingLeft: "20px",
	marginTop: "20px",
	marginBottom: "20px",
	marginRight: "20px",
	marginLeft: "50px",
};
const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
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
	replyButton: {
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
	},
	title: {
		display: "inline",
		fontWeight: "bold",
		variant: "h3",
		textDecoration: "underline",
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
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
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
	questionDetail: {
		fontWeight: "normal",
		textIndent: "20px",
	},
	snackbar: {
		width: "100%",
		"& > * + *": {
			marginTop: theme.spacing(2),
		},
	},
	alert: {
		// padding: theme.spacing(1),
		// margin: theme.spacing(1, 0),
		// border: "1px solid",
	},
}));

const user_own_question = "ชื่อเจ้าของกระทู้...";
const question_title = "หัวข้อคำถาม...";
const question_detail =
	"รายละเอียดคำถาม...รายละเอียดคำถาม...รายละเอียดคำถาม...รายละเอียดคำถาม...รายละเอียดคำถาม...รายละเอียดคำถาม...รายละเอียดคำถาม...";

const user_own_answer = "ชื่อผู้แสดงความคิดเห็น...";
const answer_detail =
	"รายละเอียดความคิดเห็น...รายละเอียดความคิดเห็น...รายละเอียดความคิดเห็น...รายละเอียดความคิดเห็น...รายละเอียดความคิดเห็น...รายละเอียดความคิดเห็น...รายละเอียดความคิดเห็น...";
const SampleQuestionDetail = () => {
	const classes = useStyles();
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const [loggedIn, setLoggedIn] = useState(false);
	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	const [showReplyField, setShowReplyField] = React.useState(false);
	const container = React.useRef(null);

	const handleReply = () => {
		setShowReplyField(!showReplyField);
	};

	const LoginPopup = () => {
		return (
			<span>
				<Dialog
					open={open}
					TransitionComponent={Transition}
					keepMounted
					onClose={handleClose}
					PaperComponent={PaperComponent}
					aria-labelledby="draggable-dialog-title"
				>
					<DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
						<Typography>เข้าสู่ระบบ?</Typography>
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							คุณต้องเข้าสู่ระบบเพื่อแสดงความคิดเห็น เข้าสู่ระบบตอนนี้?
							คลิก(ใช่)เพื่อทำการเข้าสู้ระบบ หรือคลิก(ไม่ใช่)ปิดหน้าต่างนี้.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button autoFocus onClick={handleClose} color="default">
							<Typography>ไม่ใช่</Typography>
						</Button>
						{/* ยังกลับไปไม่ได้ */}
						<Link href="./signin">
							<Button color="primary">
								<Typography>ใช่</Typography>
							</Button>
						</Link>
					</DialogActions>
				</Dialog>
			</span>
		);
	};

	return (
		<div>
			<Container component="main">
				<CssBaseline />
				<Box style={frameStyles}>
					<form>
						<div className={classes.cardRoot}>
							<div>
								<Grid container spacing={3}>
									<Grid item xs={6}>
										<Card className={classes.userCard}>
											<CardActionArea>
												<Typography className={classes.title}>โดย</Typography>
												<Typography className={classes.space}>
													:&nbsp;
												</Typography>
												<Typography className={classes.userName}>
													{user_own_question}
												</Typography>
											</CardActionArea>
										</Card>
									</Grid>
								</Grid>
							</div>
						</div>
						<div className={classes.DAC}>
							<Card className={classes.attributeCard}>
								<CardContent>
									<div>
										<Typography className={classes.title}>
											หัวข้อคำถาม
										</Typography>
										<Typography className={classes.space}>:&nbsp;</Typography>
										<Typography className={classes.content}>
											{question_title}
										</Typography>
									</div>
								</CardContent>
							</Card>
						</div>
						<div className={classes.DAC}>
							<Card
								className={classes.attributeCard}
								style={{ marginTop: "10px" }}
							>
								<CardContent>
									<Typography className={classes.title}>
										รายละเอียดคำถาม:
									</Typography>
									<Typography className={classes.questionDetail}>
										{question_detail}
									</Typography>
								</CardContent>
							</Card>
						</div>
						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								justifyContent: "center",
							}}
						>
							<Grid
								container
								spacing={1}
								style={{ display: "flex", justifyContent: "space-between" }}
							>
								<Button
									className={classes.backButton}
									onClick={() => router.back()}
									color="default"
									variant="outlined"
									startIcon={<ArrowBackIcon />}
								>
									<Typography style={{ color: "black" }}>กลับ</Typography>
								</Button>
								{loggedIn ? (
									<Button
										onClick={handleReply}
										className={classes.replyButton}
										color="primary"
									>
										{showReplyField ? (
											<Typography>ปิด</Typography>
										) : (
											<Typography>ตอบกลับ</Typography>
										)}
									</Button>
								) : (
									<React.Fragment>
										<Button
											onClick={handleClickOpen}
											className={classes.replyButton}
											color="primary"
										>
											ตอบกลับ
										</Button>
										<LoginPopup />
									</React.Fragment>
								)}
							</Grid>
						</div>
						{showReplyField ? (
							<Portal container={container.current}>
								<span>
									<div style={replyBorder}>
										<TextField
											fullwidth
											id="outlined-multiline-flexible"
											id="filled-multiline-static"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											placeholder="เขียนคำถาม ?"
										/>
										<div>
											<Button style={{ marginTop: "10px" }} color="primary">
												<Typography>ส่งข้อความ</Typography>
											</Button>
										</div>
									</div>
								</span>
							</Portal>
						) : null}
						<div className={classes.alert} ref={container} />
						<div className={classes.DAC} style={{ marginLeft: "50px" }}>
							<Card
								className={classes.attributeCard}
								style={{ marginTop: "20px" }}
							>
								<CardContent>
									<Typography className={classes.title}>
										ความคิดเห็นที่ 1 โดย
									</Typography>
									<Typography className={classes.space}>:&nbsp;</Typography>
									<Typography className={classes.userName}>
										{user_own_answer}
									</Typography>
									<Typography className={classes.questionDetail}>
										{answer_detail}
									</Typography>
								</CardContent>
							</Card>
						</div>
						<div
							className={classes.DAC}
							style={{ marginLeft: "50px", marginTop: "10px" }}
						>
							<Card
								className={classes.attributeCard}
								style={{ marginTop: "10px" }}
							>
								<CardContent>
									<Typography className={classes.title}>
										ความคิดเห็นที่ 2 โดย
									</Typography>
									<Typography className={classes.space}>:&nbsp;</Typography>
									<Typography className={classes.userName}>
										{user_own_answer}
									</Typography>
									<Typography className={classes.questionDetail}>
										{answer_detail}
									</Typography>
								</CardContent>
							</Card>
						</div>
					</form>
				</Box>
			</Container>
		</div>
	);
};

export default SampleQuestionDetail;
