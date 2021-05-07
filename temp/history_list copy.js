import React, { useContext, useState, useEffect } from "react";
import db, { auth } from "../database/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import firebase from "firebase";
import { UserContext } from "../providers/UserProvider";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Slide from "@material-ui/core/Slide";

import {
	List,
	ListItem,
	ListItemText,
	Divider,
	Icon,
	Box,
	Paper,
	Button,
	Grid,
	Card,
	Chip,
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
	makeStyles,
} from "@material-ui/core/";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ThumbsUpDownIcon from "@material-ui/icons/ThumbsUpDown";
const frameStyles = {
	position: "relative",
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	// border: "solid 1px #b9e937",
	padding: "5px",
	width: "fit-content",
	maxWidth: "auto",
	minWidth: "800px",
	paddingTop: "20px",
	paddingRight: "20px",
	paddingBottom: "20px",
	paddingLeft: "20px",
	marginTop: "20px",
	marginBottom: "20px",
	marginRight: "auto",
	marginLeft: "auto",
};

import styled from "styled-components";
import NoSsr from "@material-ui/core/NoSsr";
import { palette, spacing, typography } from "@material-ui/system";

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

const TitleBox = styled.div`
	${palette}${spacing}${typography}
`;
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	title: {
		display: "block",
		textAlign: "center",
		alignItem: "center",
		paddingTop: "10px",
		paddingBottom: "10px",
		paddingLeft: "10px",
		paddingRight: "10px",
		width: "fit-content",
		minWidth: "1080px",
		maxWidth: "auto",
	},
	lis: {
		fontWeight: "bold",
		variant: "h3",
		paddingRight: "5px",
	},
	content: {
		display: "inline",
		fontWeight: "normal",
		paddingLeft: "5px",
	},
	paper: {
		padding: "0 0 0 0",
		marginTop: "20px",
		marginBottom: "20px",
		width: "100%",
		maxWidth: "auto",
		backgroundColor: theme.palette.background.paper,
	},
	backButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
	buttonGrid: {
		direction: "column",
		justify: "center",
		alignItems: "center",
		marginTop: "20px",
	},
	hr: {
		width: "70%",
		marginLeft: "auto",
		marginRight: "auto",
	},
}));
export const getServerSideProps = async ({ query }) => {
	const content = {};
	content["main_id"] = query.id;

	return {
		props: {
			main_id: content.main_id,
		},
	};
};

function limitContent(string, limit) {
	var dots = "...";
	if (string.length > limit) {
		string = string.substring(0, limit) + dots;
	}

	return string;
}

const history = (props) => {
	//Vote confirm
	const [open, setOpen] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	//test
	const main_id = props.main_id;
	// console.log(main_id);

	const [fullWidth, setFullWidth] = React.useState(true);
	const classes = useStyles();
	const { user, setUser } = useContext(UserContext);
	const [historys, setHistorys] = useState([]);
	const [init, setInit] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);
	const [notification, setNotification] = useState("");

	const router = useRouter();

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	useEffect(() => {
		db.collection("herbs")
			.doc(props.main_id)
			.collection("historys")
			.orderBy("timestamp", "desc")
			.onSnapshot((snap) => {
				const historyData = snap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setHistorys([]);
				{
					historyData.map((history) => {
						if (history.user_id) {
							db.collection("users")
								.doc(history.user_id)
								.get()
								.then((result) => {
									const newObject = Object.assign(history, result.data());
									setHistorys((historys) => [...historys, newObject]);
								});
						}
					});
				}
			});
	}, []);

	const getdata = async (hisid) => {
		let data = await db
			.collection("vote")
			.where("herbid", "==", hisid)
			.where("uid", "==", user.uid)
			.limit(1)
			.get();

		const mapData = data.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		// console.log(mapData);

		if (mapData.length != 0) {
			//there is mapData
			return voteORnot(mapData, hisid);
		} else {
			//there isn't mapData
			const mapData = null;
			return voteORnot(mapData, hisid);
		}
	};

	const voteORnot = (mapData, hisid) => {
		//increment
		const userIncre = firebase.firestore.FieldValue.increment(+1);
		const knownUserIncre = firebase.firestore.FieldValue.increment(+2);
		const trustUserIncre = firebase.firestore.FieldValue.increment(+5);
		//decrement
		const userDecre = firebase.firestore.FieldValue.increment(-1);
		const knownUserDecre = firebase.firestore.FieldValue.increment(-2);
		const trustUserDecre = firebase.firestore.FieldValue.increment(-5);

		// console.log(test);
		if (mapData == null) {
			if (user.level == "user") {
				db.collection("herbs")
					.doc(props.main_id)
					.collection("historys")
					.doc(hisid)
					.update({ voteCount: userIncre });
			}

			if (user.level == "known user") {
				db.collection("herbs")
					.doc(props.main_id)
					.collection("historys")
					.doc(hisid)
					.update({ voteCount: knownUserIncre });
			}

			if (user.level == "trust user") {
				db.collection("herbs")
					.doc(props.main_id)
					.collection("historys")
					.doc(hisid)
					.update({ voteCount: trustUserIncre });
			}

			db.collection("vote").add({
				uid: user.uid,
				herbid: hisid,
				// voted: true,
			});

			db.collection("users")
				.doc(user.uid)
				.update({ score: firebase.firestore.FieldValue.increment(+1) });

			db.collection("herbs")
				.doc(props.main_id)
				.collection("historys")
				.doc(hisid)
				.get()
				.then((result) => {
					if (result.data().voteCount >= 5) {
						db.collection("herbs")
							.doc(props.main_id)
							.collection("historys")
							.doc(hisid)
							.update({ status: "ยืนยันแล้ว" });

						db.collection("users")
							.doc(result.data().user_id)
							.update({
								score: firebase.firestore.FieldValue.increment(+5),
								addHerb: true,
							});
					}
				});

			return;
		}
		mapData.map((dt) => {
			if (mapData.voted == true) {
				if (user.level == "user") {
					db.collection("herbs")
						.doc(props.main_id)
						.collection("historys")
						.doc(hisid)
						.update({ voteCount: userDecre });
				}

				if (user.level == "known user") {
					db.collection("herbs")
						.doc(props.main_id)
						.collection("historys")
						.doc(hisid)
						.update({ voteCount: knownUserDecre });
				}

				if (user.level == "trust user") {
					db.collection("herbs")
						.doc(props.main_id)
						.collection("historys")
						.doc(hisid)
						.update({ voteCount: trustUserDecre });
				}

				db.collection("vote").doc(dt.id).update({ voted: false });
			} else if (dt.voted == false) {
				if (user.level == "user") {
					db.collection("herbs")
						.doc(props.main_id)
						.collection("historys")
						.doc(hisid)
						.update({ voteCount: userIncre });
				}

				if (user.level == "known user") {
					db.collection("herbs")
						.doc(props.main_id)
						.collection("historys")
						.doc(hisid)
						.update({ voteCount: knownUserIncre });
				}

				if (user.level == "trust user") {
					db.collection("herbs")
						.doc(props.main_id)
						.collection("historys")
						.doc(hisid)
						.update({ voteCount: trustUserIncre });
				}

				db.collection("vote").doc(dt.id).update({ voted: true });

				db.collection("users")
					.doc(user.uid)
					.update({ score: firebase.firestore.FieldValue.increment(+1) });
			}
		});
	};

	const space = (
		<span>
			<Divider light />
			<Divider light />
			<Divider light />
			<Divider light />
		</span>
	);

	return (
		<div>
			<Container component="main">
				<CssBaseline />
				<Box style={frameStyles}>
					<div>
						<Grid
							fullwidth="true"
							spacing={3}
							container
							direction="column"
							justify="center"
							alignItems="center"
						>
							<div className={classes.title}>
								<NoSsr>
									<Box
										color="primary.main"
										bgcolor="background.paper"
										fontFamily="fontFamily"
										fontSize={{
											xs: "h6.fontSize",
											sm: "h4.fontSize",
											md: "h3.fontSize",
										}}
										p={{ xs: 2, sm: 3, md: 4 }}
									>
										ประวัติการแก้ไข
									</Box>
								</NoSsr>
							</div>
						</Grid>
						<div
							component="nav"
							className={classes.paper}
							aria-label="mailbox folders"
						>
							{historys.map((history) => (
								<div key={history.id}>
									<div style={{ display: "inline" }}>
										<ListItem variant="outlined" button divider>
											<li style={{ width: "fit-content" }}>
												<Link
													href="../../../herb/[id]/history/detail/[detail_id]"
													as={
														"../../../herb/" +
														props.main_id +
														"/history/detail/" +
														history.id
													}
												>
													<a className={classes.content}>
														<Typography
															className="txt"
															style={{ color: "#007FFF", display: "inline" }}
														>
															{limitContent(history.thaiName, 35)}
														</Typography>
														<Typography style={{ display: "inline" }}>
															&nbsp;ถูกแก้ไขเมื่อ&nbsp;
														</Typography>
														<Typography
															style={{ color: "#007FFF", display: "inline" }}
														>
															{new Date(
																history.timestamp.seconds * 1000
															).toDateString()}
														</Typography>
														<Typography style={{ display: "inline" }}>
															&nbsp;เวลา:&nbsp;
														</Typography>
														<Typography
															style={{ color: "#007FFF", display: "inline" }}
														>
															{new Date(
																history.timestamp.seconds * 1000
															).toLocaleTimeString()}
														</Typography>
														<Typography style={{ display: "inline" }}>
															&nbsp;โดย:&nbsp;
														</Typography>
														<Typography
															style={{ color: "#007FFF", display: "inline" }}
														>
															{limitContent(history.displayName, 15)}
														</Typography>
														<Typography style={{ display: "inline" }}>
															&nbsp;สถานะ:&nbsp;
														</Typography>
														{history.status === "ยืนยันแล้ว" ? (
															<Typography
																style={{ color: "#03C03C", display: "inline" }}
															>
																{history.status}
															</Typography>
														) : (
															<Typography
																style={{ color: "#FF0800", display: "inline" }}
															>
																{history.status}
															</Typography>
														)}
														<Typography style={{ display: "inline" }}>
															&nbsp;จำนวนโหวต:&nbsp;
														</Typography>
														<Typography
															style={{ color: "#007FFF", display: "inline" }}
														>
															{history.voteCount}
														</Typography>
													</a>
												</Link>
											</li>
											{loggedIn &&
												user.level != "visitor" &&
												history.voteCount < 5 &&
												history.user_id != user.uid && (
													<div style={{ padding: "0 0 0 10px" }}>
														<Button
															startIcon={<ThumbsUpDownIcon />}
															onClick={handleClickOpen}
														>
															โหวต
														</Button>
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
																<Typography>
																	ยืนยันร่วมโหวตข้อมูลสมุนไพร
																</Typography>
															</DialogTitle>
															<DialogContent>
																<DialogContentText>
																	คุณต้องการ
																	<a style={{ color: "red" }}>โหวต</a>
																	ข้อมูลสมุนไพรนี้ใช่หรือไม่?
																	คลิก(ใช่)เพื่อทำการโหวตข้อมูลสมุนไพร
																	หรือคลิก(ไม่ใช่)เพื่อยกเลิกการโหวต
																</DialogContentText>
															</DialogContent>
															<DialogActions>
																<Button
																	autoFocus
																	onClick={handleClose}
																	color="default"
																>
																	<Typography>ไม่ใช่</Typography>
																</Button>
																<Button
																	onClick={() => {
																		getdata(history.id);
																	}}
																	color="primary"
																>
																	<Typography>ใช่</Typography>
																</Button>
															</DialogActions>
														</Dialog>
													</div>
												)}
										</ListItem>
									</div>
									{space}
								</div>
							))}
						</div>
						<Grid
							fullwidth="true"
							spacing={3}
							container
							className={classes.buttonGrid}
						>
							<Button
								startIcon={<ArrowBackIcon />}
								color="default"
								variant="outlined"
								className={classes.backButton}
								onClick={() => router.back()}
							>
								<Typography style={{ color: "black" }}>กลับ</Typography>
							</Button>
						</Grid>
					</div>
				</Box>
			</Container>
		</div>
	);
};

export default history;

///เพิ่มแจ้งเตือนหน้าแรก
///เพิ่มจำนวนโหวตหน้า history
///เพิ่มชื่อผู้แก้ไข history
///เพิ่มวันที่และเวลา history

// ปรับบทที่ 3
// บทที่4 เอาโครงบทที่3 มาเขียนพวกขั้นตอน พวกไดอะแกรม(4.1)
//                 เอารูปการใช้งานมาแปะแล้วอธิบายรายละเอียด
