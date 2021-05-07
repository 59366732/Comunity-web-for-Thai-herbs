import React from "react";
import Link from "next/link";
import firebase from "firebase";
import db, {
	auth,
	firestore,
	generateUserDocument,
} from "../database/firebase.js";
import { UserContext } from "../providers/UserProvider";
import { useContext, useState, useEffect } from "react";
import Popup from "reactjs-popup";

import AddQuestion from "./addQnA";

import { fade, makeStyles } from "@material-ui/core/styles";
import ThumbsUpDownIcon from "@material-ui/icons/ThumbsUpDown";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Tooltip from "@material-ui/core/Tooltip";
import Search from "material-ui-search-bar";

import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import Draggable, { DraggableCore } from "react-draggable";
import Slide from "@material-ui/core/Slide";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {
	Paper,
	Dialog,
	DialogTitle,
	InputBase,
	TextField,
	Button,
	AppBar,
	Toolbar,
	IconButton,
	CssBaseline,
	Container,
	List,
	ListItem,
	Divider,
	ListItemIcon,
	ListItemText,
	ListItemAvatar,
	Avatar,
	Typography,
	Box,
	Grid,
	Checkbox,
} from "@material-ui/core/";

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
		wordWrap: "break-word",
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
	large: {
		width: theme.spacing(7),
		height: theme.spacing(7),
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

const QandA = () => {
	const [fullWidth, setFullWidth] = React.useState(true);
	const classes = useStyles();
	const [openAdd, setOpenAdd] = React.useState(false);
	const [openLike, setOpenLike] = React.useState(false);
	const [searchName, setSearchName] = useState("");

	const handleClickOpenAdd = () => {
		setOpenAdd(true);
	};

	const handleCloseAdd = () => {
		setOpenAdd(false);
	};

	const handleClickOpenLike = () => {
		setOpenLike(true);
	};

	const handleCloseLike = () => {
		setOpenLike(false);
	};

	const { user, setUser } = useContext(UserContext);
	const [response, setResponse] = useState([]);
	const [posts, setPosts] = useState([]);
	const [newLikePosts, setNewLikePosts] = useState([]);
	const [loggedIn, setLoggedIn] = useState(false);
	const [likedPost, setLikedPost] = useState([]);
	const [test, setTest] = useState(likedPost ? true : false);

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	useEffect(() => {
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
		// db.collection("LikePost")
		// 	.where("uid", "==", user.uid)
		// 	.get()
		// 	.then(function (querySnapshot) {
		// 		const content = querySnapshot.docs.map((doc) => ({
		// 			id: doc.id,
		// 			...doc.data(),
		// 		}));
		// 		setLikedPost(content);
		// 	});
		// ======================================================================================
		// db.collection("LikePost")
		// 	.orderBy("timestamp", "desc")
		// 	.onSnapshot((snap) => {
		// 		const newLikePostData = snap.docs.map((doc) => ({
		// 			id: doc.id,
		// 			...doc.data(),
		// 		}));
		// 		setNewLikePosts([]);
		// 		{
		// 			newLikePostData.map((newLikePost) => {
		// 				if (newLikePost.uid) {
		// 					db.collection("users")
		// 						.doc(newLikePost.uid)
		// 						.get()
		// 						.then((result) => {
		// 							const newObject = Object.assign(newLikePost, result.data());
		// 							setNewLikePosts((newLikePosts) => [
		// 								...newLikePosts,
		// 								newObject,
		// 							]);
		// 						});
		// 				}
		// 			});
		// 		}
		// 	});
	}, []);

	const thumbUp = async (postid) => {
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
			return voteORnot(mapData, postid);
		} else {
			//there isn't mapData
			const mapData = null;
			return voteORnot(mapData, postid);
		}
	};

	const voteORnot = (test, postid) => {
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

			return;
		}
		test.map((dt) => {
			if (dt.liked == true) {
				db.collection("QnA").doc(postid).update({ likeCount: Decrement });

				db.collection("LikePost").doc(dt.id).update({ liked: false });
			} else if (dt.liked == false) {
				db.collection("QnA").doc(postid).update({ likeCount: Increment });

				db.collection("LikePost").doc(dt.id).update({ liked: true });
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
	};

	function limitContent(string, limit) {
		var dots = "...";
		if (string.length > limit) {
			string = string.substring(0, limit) + dots;
		}
		return string;
	}

	const LoginPopupForAdd = () => {
		return (
			<span>
				<div>
					<ListItem>
						<Button onClick={handleClickOpenAdd}>
							<Typography className={classes.titleText}>
								ตั้งกระทู้ถาม
							</Typography>
						</Button>
					</ListItem>
				</div>
				<Dialog
					open={openAdd}
					TransitionComponent={Transition}
					keepMounted
					onClose={handleCloseAdd}
					PaperComponent={PaperComponent}
					aria-labelledby="draggable-dialog-title"
				>
					<MuiDialogTitle
						style={{ cursor: "move" }}
						id="draggable-dialog-title"
					>
						<Typography>เข้าสู่ระบบ?</Typography>
					</MuiDialogTitle>
					<MuiDialogContent>
						<DialogContentText>
							คุณต้องเข้าสู่ระบบก่อนเพื่อตั้งกระทู้ถาม
							คลิก(ใช่)เพื่อทำการเข้าสู้ระบบ
							หรือคลิก(ไม่ใช่)เพื่อปิดหน้าต่างนี้.
						</DialogContentText>
					</MuiDialogContent>
					<MuiDialogActions>
						<Button autoFocus onClick={handleCloseAdd} color="default">
							<Typography>ไม่ใช่</Typography>
						</Button>
						<Link href="/signin">
							<Button onClick={handleCloseAdd} color="primary">
								<Typography>ใช่</Typography>
							</Button>
						</Link>
					</MuiDialogActions>
				</Dialog>
			</span>
		);
	};

	const LoginPopupForLike = () => {
		return (
			<span>
				<Checkbox
					onClick={handleClickOpenLike}
					icon={
						<>
							<ThumbUpOutlinedIcon />
						</>
					}
					checkedIcon={
						<>
							<ThumbUpOutlinedIcon />
						</>
					}
					name="checkedH"
				/>
				<Dialog
					open={openLike}
					TransitionComponent={Transition}
					keepMounted
					onClose={handleCloseLike}
					PaperComponent={PaperComponent}
					aria-labelledby="draggable-dialog-title"
				>
					<MuiDialogTitle
						style={{ cursor: "move" }}
						id="draggable-dialog-title"
					>
						<Typography>เข้าสู่ระบบ?</Typography>
					</MuiDialogTitle>
					<MuiDialogContent>
						<DialogContentText>
							คุณต้องเข้าสู่ระบบก่อนเพื่อกดถูกใจคำถาม
							คลิก(ใช่)เพื่อทำการเข้าสู้ระบบ
							หรือคลิก(ไม่ใช่)เพื่อปิดหน้าต่างนี้.
						</DialogContentText>
					</MuiDialogContent>
					<MuiDialogActions>
						<Button autoFocus onClick={handleCloseLike} color="default">
							<Typography>ไม่ใช่</Typography>
						</Button>
						<Link href="/signin">
							<Button onClick={handleCloseLike} color="primary">
								<Typography>ใช่</Typography>
							</Button>
						</Link>
					</MuiDialogActions>
				</Dialog>
			</span>
		);
	};

	const asdf = (id) => {
		var bb = document.getElementById(id);
		console.log(bb);
		return bb;
	};

	const QuestionComponent = () => {
		return (
			<span>
				{posts.map((post) => (
					<div key={post.id}>
						<ListItem alignItems="flex-start">
							<ListItemIcon
								style={{
									display: "flex",
									padding: "0 0 0 0",
									justifyContent: "center",
								}}
							>
								<div style={{ display: "block" }}>
									{loggedIn ? (
										<Checkbox
											onClick={() => thumbUp(post.id)}
											icon={
												<>
													<ThumbUpOutlinedIcon
														onClick={() => thumbUp(post.id)}
													/>
												</>
											}
											checkedIcon={
												<>
													<ThumbUpIcon
														color="primary"
														className={classes.button}
														onClick={() => thumbUp(post.id)}
													/>
												</>
											}
											name="checkedH"
										/>
									) : (
										<LoginPopupForLike />
									)}
									<Typography
										style={{
											display: "flex",
											flexDirection: "column",
											textAlign: "center",
											padding: "0 0 0 0",
										}}
									>
										{post.likeCount}
									</Typography>
								</div>
							</ListItemIcon>
							{/* <ListItemIcon
								style={{
									display: "flex",
									padding: "0 0 0 0",
									justifyContent: "center",
								}}
							>
								<div style={{ display: "flex" }}>
									<div style={{ display: "flex", flexDirection: "column" }}>
										<Checkbox
											icon={<ExpandLessIcon className={classes.large} />}
											checkedIcon={<ExpandLessIcon className={classes.large} />}
										/>
										<Typography style={{ textAlign: "center" }}>
											{post.likeCount}
										</Typography>
										<Checkbox
											icon={<ExpandMoreIcon className={classes.large} />}
											checkedIcon={<ExpandMoreIcon className={classes.large} />}
										/>
									</div>
								</div>
							</ListItemIcon> */}
							{/* <ListItemIcon
								style={{
									display: "flex",
									padding: "0 0 0 10px",
									justifyContent: "center",
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										textAlign: "center",
										padding: "8px 0 0 0",
									}}
								>
									<QuestionAnswerIcon />
									<Typography style={{ padding: "10px 0 0 0" }}>1</Typography>
								</div>
							</ListItemIcon> */}
							<ListItemText
								style={{ margin: "0 0 0 10px" }}
								primary={
									<React.Fragment>
										<Link href="./QandA/[QnA_id]" as={"/QandA/" + post.id}>
											<a>
												<Typography
													itemProp="hello"
													style={{ fontWeight: "bold", wordWrap: "break-word" }}
												>
													{limitContent(post.title, 100)}
												</Typography>
											</a>
										</Link>
									</React.Fragment>
								}
								secondary={
									<React.Fragment>
										<Typography
											component="span"
											variant="body2"
											className={classes.inline}
											color="textPrimary"
										>
											{limitContent(post.detail, 250)}
										</Typography>
										<br />
										<br />
										<Typography
											variant="caption"
											style={{
												margin: "4px 0 0 0",
												fontWeight: "bold",
												float: "left",
											}}
										>
											โดย:
										</Typography>
										&ensp;
										<Typography
											variant="caption"
											style={{
												color: "#007FFF",
												textTransform: "capitalize",
											}}
										>
											{post.displayName}
										</Typography>
										&ensp;
										<Typography
											variant="caption"
											style={{ fontWeight: "bold", display: "inline" }}
										>
											เมื่อ:
										</Typography>
										&ensp;
										<Typography
											variant="caption"
											style={{
												display: "inline",
												color: "#007FFF",
												textTransform: "capitalize",
											}}
										>
											{new Date(post.timestamp.seconds * 1000).toDateString()}
										</Typography>
										<Typography
											style={{ display: "inline", fontWeight: "bold" }}
										>
											,&nbsp;
										</Typography>
										<Typography
											variant="caption"
											style={{
												color: "#007FFF",
												display: "inline",
												textTransform: "lowercase",
											}}
										>
											{new Date(
												post.timestamp.seconds * 1000
											).toLocaleTimeString()}
										</Typography>
										{/* <div>{post.user_id}</div>
										<div>{user.uid}</div>
										<div>
											{post.user_id === user.uid ? (
												<Button>Equal</Button>
											) : (
												<Button>Not Equal</Button>
											)}
										</div> */}
										{/* {newLikePosts.map((newLikePost) => (
											<div key={newLikePost.id}>
												<div>{newLikePost.uid}</div>
												<div>{user.uid}</div>
												<div>
													{newLikePost.uid === user.uid ? (
														<Button>Equal</Button>
													) : (
														<Button>Not Equal</Button>
													)}
												</div>
											</div>
										))} */}
									</React.Fragment>
								}
							/>
						</ListItem>
						<Divider />
					</div>
				))}
			</span>
		);
	};

	return (
		<div className="App">
			<div className={classes.mainDiv}>
				<Toolbar component="nav">
					<Container maxWidth="md" className={classes.titleBarFlex}>
						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
							}}
						>
							<Grid
								container
								spacing={1}
								style={{ display: "flex", justifyContent: "space-between" }}
							>
								{/* <div>
									<ListItem>
										<Button>
											<Typography className={classes.titleText}>
												คำถามยอดนิยม
											</Typography>
										</Button>
									</ListItem>
								</div>
								<div>
									<ListItem>
										<Button>
											<Typography className={classes.titleText}>
												คำถามล่าสุด
											</Typography>
										</Button>
									</ListItem>
								</div> */}
								{loggedIn ? <AddQuestion /> : <LoginPopupForAdd />}
								<div className={classes.search}>
									<Search
										style={{ display: "flex-end" }}
										fullWidth
										variant="outlined"
										value={""}
										onChange={(e) => setSearchName(e.target.value)}
										placeholder="ค้นหา"
									/>
								</div>
							</Grid>
						</div>
					</Container>
				</Toolbar>
			</div>
			<Container
				component="main"
				maxWidth="md"
				className={classes.titleBarFlex}
			>
				<List className={classes.root}>
					<Divider />
					<QuestionComponent />
				</List>
			</Container>
		</div>
	);
};
export default QandA;
