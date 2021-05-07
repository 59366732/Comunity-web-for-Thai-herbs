import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import firebase from "firebase";
import db, { auth, storage } from "../../database/firebase";
import { UserContext } from "../../providers/UserProvider";
import { useRouter } from "next/router";

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
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

import {
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Avatar,
	Chip,
	Snackbar,
	IconButton,
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
	// border: "solid 1px #00b906",
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
	// border: "solid 1px #00b906",
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
		wordWrap: "break-word",
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
		padding: "0 0 10px 0",
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
	postDetail: {
		fontWeight: "normal",
		textIndent: "20px",
		wordWrap: "break-word",
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

export const getServerSideProps = async ({ query }) => {
	const content = {};
	content["Question_id"] = query.QnA_id;

	await db
		.collection("QnA")
		.doc(query.QnA_id)
		.get()
		.then((result) => {
			content["user_id"] = result.data().user_id;
			content["postTitle"] = result.data().title;
			content["postDetail"] = result.data().detail;
			content["postTime"] = new Date(
				result.data().timestamp.seconds * 1000
			).toLocaleTimeString();
			content["postDate"] = new Date(
				result.data().timestamp.seconds * 1000
			).toDateString();
			content["postLikeCount"] = result.data().likeCount;
		})
		.catch(function (error) {
			console.log("Error getting documents: ", error);
		});
	return {
		props: {
			Question_id: content.Question_id,
			user_id: content.user_id,
			postTime: content.postTime,
			postDate: content.postDate,
			postTile: content.postTitle,
			postDetail: content.postDetail,
			postLikeCount: content.postLikeCount,
		},
	};
};

const QnApost = (props) => {
	const classes = useStyles();

	const { user, setUser } = useContext(UserContext);
	//=====================================================
	const [posts, setPosts] = useState([]);
	//=====================================================
	const [comments, setComments] = useState([]);
	const router = useRouter();
	const [loggedIn, setLoggedIn] = useState(false);
	const [displayName, setDisplayName] = useState("");
	const [level, setLevel] = useState("");
	const [likedPost, setLikedPost] = useState([]);
	const [test, setTest] = useState(likedPost ? true : false);

	//input
	const [inputComment, setInputComment] = useState("");

	useEffect(() => {
		db.collection("QnA")
			.doc(props.Question_id)
			.collection("comments")
			.orderBy("timestamp")
			.onSnapshot((snap) => {
				const commentData = snap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				setComments([]);
				{
					commentData.map((comment) => {
						if (comment.user_id) {
							db.collection("users")
								.doc(comment.user_id)
								.get()
								.then((result) => {
									const newObject = Object.assign(comment, result.data());
									setComments((comments) => [...comments, newObject]);
								});
						}
					});
				}
			});
		db.collection("users")
			.doc(props.user_id)
			.get()
			.then((result) => {
				setDisplayName(result.data().displayName);
				setLevel(result.data().level);
			});
		///==============TEST BEGIN=========================================
		db.collection("QnA")
			.orderBy("timestamp", "desc")
			.onSnapshot((snap) => {
				const postData = snap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setPosts([]);
				{
					postData.map((post) => {
						if (post.user_id) {
							db.collection("users")
								.doc(post.user_id)
								.get()
								.then((result) => {
									const newObject = Object.assign(post, result.data());
									setPosts((posts) => [...posts, newObject]);
								});
						}
					});
				}
			});

		db.collection("LikePost")
			.where("uid", "==", user.uid)
			.get()
			.then(function (querySnapshot) {
				const content = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setLikedPost(content);
			});
		///==============TEST END===========================================
	}, []);

	///==============TEST BEGIN=========================================
	const Post_thumbUp = async (postid) => {
		let data = await db
			.collection("LikePost")
			.where("postid", "==", postid)
			.where("uid", "==", user.uid)
			.limit(1)
			.get();

		const mapData = data.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		if (mapData.length != 0) {
			//there is mapData
			return Post_voteORnot(mapData, postid);
		} else {
			//there isn't mapData
			const mapData = null;
			return Post_voteORnot(mapData, postid);
		}
	};

	const Post_voteORnot = (test, postid) => {
		//increment
		const Increment = firebase.firestore.FieldValue.increment(+1);
		//decrement
		const Decrement = firebase.firestore.FieldValue.increment(-1);

		if (test == null) {
			db.collection("QnA").doc(postid).update({ likeCount: Increment });
			db.collection("LikePost").add({
				uid: user.uid,
				postid: postid,
				liked: true,
			});
			db.collection("QnA")
				.doc(postid)
				.get()
				.then(function (doc) {
					if (doc.exists) {
						// console.log("Document data:", doc.data());
						const likeCount = likeCount;
						if (likeCount == 0) {
							Like = likeCount;
						} else {
							Like = likeCount + 1;
						}
						return Like;
					} else {
						// doc.data() will be undefined in this case
						console.log("No such document!");
					}
				})
				.catch(function (error) {
					console.log("Error getting document:", error);
				});
			return;
		}
		test.map((dt) => {
			if (dt.liked == true) {
				db.collection("QnA").doc(postid).update({ likeCount: Decrement });

				db.collection("LikePost").doc(dt.id).update({ liked: false });

				db.collection("QnA")
					.doc(postid)
					.get()
					.then(function (doc) {
						if (doc.exists) {
							console.log("Document data:", doc.data());
							var Like1 = doc.data();
							console.log(Like1.toString());
						} else {
							// doc.data() will be undefined in this case
							console.log("No such document!");
						}
					})
					.catch(function (error) {
						console.log("Error getting document:", error);
					});
				console.log(postid);
				async ({ query }) => {
					const content = {};
					content["Question_id"] = query.QnA_id;
					await db
						.collection("QnA")
						.doc(query.QnA_id)
						.get()
						.then((result) => {
							content["newLikeCount"] = result.data().likeCount;
						})
						.catch(function (error) {
							console.log("Error getting documents: ", error);
						});
					return {
						props: {
							Like2: content.newLikeCount,
						},
					};
				};
			} else if (dt.liked == false) {
				db.collection("QnA").doc(postid).update({ likeCount: Increment });
				db.collection("LikePost").doc(dt.id).update({ liked: true });
				db.collection("QnA")
					.doc(postid)
					.get()
					.then(function (doc) {
						if (doc.exists) {
							console.log("Document data:", doc.data());
							var Like1 = doc.data();
							console.log(Like1.toString());
						} else {
							// doc.data() will be undefined in this case
							console.log("No such document!");
						}
					})
					.catch(function (error) {
						console.log("Error getting document:", error);
					});
				console.log(postid);
				async ({ query }) => {
					const content = {};
					content["Question_id"] = query.QnA_id;
					await db
						.collection("QnA")
						.doc(query.QnA_id)
						.get()
						.then((result) => {
							content["newLikeCount"] = result.data().likeCount;
						})
						.catch(function (error) {
							console.log("Error getting documents: ", error);
						});
					return {
						props: {
							Like2: content.newLikeCount,
						},
					};
				};
			}
		});
	};
	const LikeCount = (props) => {
		const LikeNum = props.Like2;
		return (
			<span>
				<Typography>{LikeNum}</Typography>
			</span>
		);
	};
	///==============TEST END===========================================
	const Comment_thumbUp = async (commentid) => {
		let data = await db
			.collection("LikeComment")
			.where("commentid", "==", commentid)
			.where("uid", "==", user.uid)
			.limit(1)
			.get();

		const mapData = data.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		if (mapData.length != 0) {
			//there is mapData
			return Comment_voteORnot(mapData, commentid);
		} else {
			//there isn't mapData
			const mapData = null;
			return Comment_voteORnot(mapData, commentid);
		}
	};
	const Comment_voteORnot = (mapData, commentid) => {
		//increment
		const Increment = firebase.firestore.FieldValue.increment(+1);
		//decrement
		const Decrement = firebase.firestore.FieldValue.increment(-1);

		if (mapData == null) {
			db.collection("QnA")
				.doc(props.Question_id)
				.collection("comments")
				.doc(commentid)
				.update({ likeCount: Increment });

			db.collection("LikeComment").add({
				uid: user.uid,
				commentid: commentid,
				liked: true,
			});

			return;
		}
		mapData.map((dt) => {
			if (mapData != null) {
				db.collection("QnA")
					.doc(props.Question_id)
					.collection("comments")
					.doc(commentid)
					.update({ likeCount: Decrement });

				db.collection("LikeComment").doc(dt.id).delete();
			}
			// if (dt.liked == true) {
			// 	db.collection("QnA")
			// 		.doc(props.Question_id)
			// 		.collection("comments")
			// 		.doc(commentid)
			// 		.update({ likeCount: Decrement });

			// 	db.collection("LikeComment").doc(dt.id).update({ liked: false });
			// } else if (dt.liked == false) {
			// 	db.collection("QnA")
			// 		.doc(props.Question_id)
			// 		.collection("comments")
			// 		.doc(commentid)
			// 		.update({ likeCount: Increment });

			// 	db.collection("LikeComment").doc(dt.id).update({ liked: true });
			// }
		});
	};

	const [fullWidth, setFullWidth] = React.useState("true");
	const [open, setOpen] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleCloseConfirm = () => {
		setOpen(false);
	};
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

	const addComment = (e) => {
		e.preventDefault();

		db.collection("QnA").doc(props.Question_id).collection("comments").add({
			user_id: user.uid,
			comment: inputComment,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			likeCount: 0,
		});

		db.collection("users")
			.doc(user.uid)
			.update({ score: firebase.firestore.FieldValue.increment(+0.1) });

		setInputComment("");
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
							คุณต้องเข้าสู่ระบบก่อนเพื่อแสดงความคิดเห็น
							คลิก(ใช่)เพื่อทำการเข้าสู้ระบบ
							หรือคลิก(ไม่ใช่)เพื่อปิดหน้าต่างนี้.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button autoFocus onClick={handleClose} color="default">
							<Typography>ไม่ใช่</Typography>
						</Button>
						<Link href="../signin">
							<Button onClick={handleCloseConfirm} color="primary">
								<Typography>ใช่</Typography>
							</Button>
						</Link>
					</DialogActions>
				</Dialog>
			</span>
		);
	};

	return (
		<React.Fragment>
			<Container component="main">
				<CssBaseline />
				<Box style={frameStyles}>
					<div>
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
													{displayName}
												</Typography>
												<Typography className={classes.space}>
													&nbsp;
												</Typography>
												<Typography className={classes.title}>
													ระดับผู้ใช้
												</Typography>
												<Typography className={classes.space}>
													:&nbsp;
												</Typography>
												<Typography className={classes.userName}>
													{level}
												</Typography>
											</CardActionArea>
										</Card>
										<br />
										<Card className={classes.userCard}>
											<CardActionArea>
												<Typography className={classes.title}>เมื่อ</Typography>
												<Typography className={classes.space}>
													:&nbsp;
												</Typography>
												<Typography className={classes.userName}>
													{props.postDate}
												</Typography>
												<Typography className={classes.space}>
													,&nbsp;
												</Typography>
												<Typography className={classes.userName}>
													{props.postTime}
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
											{props.postTile}
										</Typography>
									</div>
									<div>
										<Typography className={classes.title}>
											รายละเอียดคำถาม:
										</Typography>
										<Typography className={classes.space}>:&nbsp;</Typography>
										<Typography className={classes.postDetail}>
											{props.postDetail}
										</Typography>
									</div>
								</CardContent>
								<CardActions style={{ display: "flex" }}>
									<IconButton onClick={() => Post_thumbUp(props.Question_id)}>
										<ThumbUpAltIcon />
									</IconButton>
									<div style={{ margin: "0 0 0 0" }}>
										<Typography>{props.postLikeCount}</Typography>
										<Typography className={classes.space}>&nbsp;</Typography>
										<Typography>Like</Typography>
									</div>
								</CardActions>
								{/* <div>
									<Typography>Here:</Typography>
									<LikeCount />
								</div> */}
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
									<>
										{showReplyField ? (
											<Button
												onClick={handleReply}
												className={classes.replyButton}
												color="secondary"
												startIcon={<CloseIcon />}
											>
												ปิด
											</Button>
										) : (
											<Button
												onClick={handleReply}
												className={classes.replyButton}
												color="primary"
												startIcon={<ReplyIcon />}
											>
												ตอบกลับ
											</Button>
										)}
									</>
								) : (
									<React.Fragment>
										<Button
											onClick={handleClickOpen}
											className={classes.replyButton}
											color="primary"
											startIcon={<ReplyIcon />}
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
											fullWidth
											id="outlined-multiline-flexible"
											id="filled-multiline-static"
											variant="outlined"
											multiline
											rows={7}
											color="primary"
											fontFamily="sans-serif"
											placeholder="พิมพ์ข้อความ ?"
											value={inputComment}
											onChange={(e) => setInputComment(e.target.value)}
										/>
										<div>
											<Button
												startIcon={<ReplyIcon />}
												style={{ marginTop: "10px" }}
												color="primary"
												onClick={addComment}
												type="submit"
											>
												<Typography>ส่ง</Typography>
											</Button>
										</div>
									</div>
								</span>
							</Portal>
						) : null}
						<div className={classes.alert} ref={container} />
						<br />
						<div>
							{comments.map((comment) => (
								<div key={comment.id} style={{ margin: "10px 0 30px 50px" }}>
									<Card
										className={classes.attributeCard}
										style={{ marginTop: "10px" }}
									>
										<CardContent>
											<Typography className={classes.title}>
												ความคิดเห็นโดย
											</Typography>
											<Typography className={classes.space}>:&nbsp;</Typography>
											<Typography className={classes.userName}>
												{comment.displayName}
											</Typography>
											<Typography className={classes.space}>&nbsp;</Typography>
											<Typography className={classes.title}>เมื่อ</Typography>
											<Typography className={classes.space}>:&nbsp;</Typography>
											<Typography className={classes.userName}>
												{new Date(
													comment.timestamp.seconds * 1000
												).toDateString()}
											</Typography>
											<Typography className={classes.space}>,&nbsp;</Typography>
											<Typography className={classes.userName}>
												{new Date(
													comment.timestamp.seconds * 1000
												).toLocaleTimeString()}
											</Typography>
											<br />
											<Typography className={classes.postDetail}>
												&nbsp;{comment.comment}
											</Typography>
										</CardContent>
										<CardActions style={{ display: "flex" }}>
											<IconButton onClick={() => Comment_thumbUp(comment.id)}>
												<ThumbUpAltIcon />
											</IconButton>
											<div style={{ margin: "0 0 0 0" }}>
												<Typography>{comment.likeCount}</Typography>
												<Typography className={classes.space}>
													&nbsp;
												</Typography>
												<Typography>Like</Typography>
											</div>
										</CardActions>
									</Card>
								</div>
							))}
						</div>
					</div>
				</Box>
			</Container>
		</React.Fragment>
	);
};

export default QnApost;
