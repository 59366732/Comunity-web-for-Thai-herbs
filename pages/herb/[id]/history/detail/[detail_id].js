import React, { useState, useContext, useEffect } from "react";
import db, { auth, storage } from "../../../../../database/firebase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { UserContext } from "../../../../../providers/UserProvider";
import firebase from "firebase";
import ReactLoading from "react-loading";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SaveIcon from "@material-ui/icons/Save";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { SnackbarProvider, useSnackbar } from "notistack";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Slide from "@material-ui/core/Slide";

import {
	Icon,
	Box,
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
	makeStyles,
} from "@material-ui/core/";

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

const frameStyles = {
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	justifyContent: "center",
	// border: "solid 1px #b9e937",
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
	root: {
		display: "flex",
		flexWrap: "wrap",
		marginTop: "70px",
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
	savechangeButton: {
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
	},
	title: {
		display: "inline",
		fontWeight: "bold",
		variant: "h3",
		paddingRight: "5px",
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
		paddingLeft: "5px",
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
		marginTop: "30px",
	},
	DIC: {
		marginTop: "30px",
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
		width: "fit-content",
		paddingLeft: "0px",
		paddingRight: "10px",
		minWidth: "auto",
		maxWidth: "auto",
	},
	statusCard: {
		float: "Right",
		paddingLeft: "10px",
		paddingRight: "10px",
		width: "fit-content",
		minWidth: "auto",
		maxWidth: "auto",
	},
	status: {
		display: "inline",
		color: "red",
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
}));

export const getServerSideProps = async ({ query }) => {
	const content = {};
	content["main_id"] = query.id;
	content["detail_id"] = query.detail_id;

	await db
		.collection("herbs")
		.doc(query.id)
		.collection("historys")
		.doc(query.detail_id)
		.get()
		.then((result) => {
			content["user_id"] = result.data().user_id;
			content["thaiName"] = result.data().thaiName;
			content["engName"] = result.data().engName;
			content["sciName"] = result.data().sciName;
			content["familyName"] = result.data().familyName;
			content["info"] = result.data().info;
			content["attribute"] = result.data().attribute;
			content["timestamp"] = new Date(
				result.data().timestamp.seconds * 1000
			).toLocaleTimeString();
			content["date"] = new Date(
				result.data().timestamp.seconds * 1000
			).toDateString();
			content["imgUrl"] = result.data().imgUrl;
			content["chemBondUrl"] = result.data().chemBondUrl;
			content["NMRUrl"] = result.data().NMRUrl;
			content["status"] = result.data().status;
		})
		.catch(function (error) {
			console.log("Error getting documents: ", error);
		});
	return {
		props: {
			main_id: content.main_id,
			detail_id: content.detail_id,
			user_id: content.user_id,
			thaiName: content.thaiName,
			engName: content.engName,
			sciName: content.sciName,
			familyName: content.familyName,
			info: content.info,
			attribute: content.attribute,
			date: content.date,
			timestamp: content.timestamp,
			imgUrl: content.imgUrl,
			chemBondUrl: content.chemBondUrl,
			NMRUrl: content.NMRUrl,
			status: content.status,
		},
	};
};

const detail = (props) => {
	const classes = useStyles();
	const [fullWidth, setFullWidth] = React.useState("true");
	const [open, setOpen] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	dayjs.extend(relativeTime);
	// const date = props.date;
	const time = props.timestamp;
	const router = useRouter();

	const { user, setUser } = useContext(UserContext);
	const [displayName, setDisplayName] = useState("");
	const [level, setLevel] = useState("");

	const [activeEdit, setActiveEdit] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);
	const [uploadNoti, setUploadNoti] = useState(null);
	const [loading, setLoading] = useState(false);

	//form
	const [thaiNameEdit, setThaiNameEdit] = useState(props.thaiName);
	const [engNameEdit, setEngNameEdit] = useState(props.engName);
	const [sciNameEdit, setSciNameEdit] = useState(props.sciName);
	const [familyNameEdit, setFamilyNameEdit] = useState(props.familyName);
	const [infoEdit, setInfoEdit] = useState(props.info);
	const [attributeEdit, setAttributeEdit] = useState(props.attribute);

	//img
	const [image, setImage] = useState(null);
	const [ImgUrl, setUrl] = useState(props.imgUrl);
	const [newImgUrl, setNewImgUrl] = useState("");

	//Chem bond
	const [chemBond, setChemBond] = useState(null);
	const [chemBondUrl, setChemBondUrl] = useState(props.chemBondUrl); //props.chemBondUrl
	const [newChemBondUrl, setnewChemBondUrl] = useState("");

	//NMR
	const [NMR, setNMR] = useState(null);
	const [NMRUrl, setNMRUrl] = useState(props.NMRUrl); //props.NMRUrl
	const [newNMRUrl, setNewNMRUrl] = useState("");

	const select_img_alert = (
		<span>
			<Alert severity="warning">
				<Typography>กรุณาเลือกรูปภาพ!!!</Typography>
			</Alert>
		</span>
	);
	const upload_complete_alert = (
		<span>
			<Alert severity="success">
				<Typography>อัพโหลดรูปภาพเรียบร้อย!!!</Typography>
			</Alert>
		</span>
	);

	useEffect(() => {
		db.collection("users")
			.doc(props.user_id)
			.get()
			.then((result) => {
				setDisplayName(result.data().displayName);
				setLevel(result.data().level);
			});
	}, []);

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	const toggleEdit = (e) => {
		e.preventDefault();

		setActiveEdit(true);
	};

	const handleUpdate = (e) => {
		e.preventDefault();

		db.collection("herbs")
			.doc(props.main_id)
			.collection("historys")
			.add({
				herb_id: props.main_id,
				user_id: user.uid,
				thaiName: thaiNameEdit,
				engName: engNameEdit,
				sciName: sciNameEdit,
				familyName: familyNameEdit,
				info: infoEdit,
				attribute: attributeEdit,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				imgUrl: newImgUrl,
				NMRUrl: newNMRUrl,
				chemBondUrl: newChemBondUrl,
				status: "ยังไม่ได้ยืนยัน",
				voteCount: 0,
			})
			.then(
				setActiveEdit(false),
				setTimeout(() => {
					setLoading(true), (window.location.href = "/herb/" + props.main_id);
				}, 3000)
			);
	};

	const handleCancel = (e) => {
		e.preventDefault();

		db.collection("herbs")
			.doc(props.main_id)
			.collection("historys")
			.doc(props.detail_id)
			.get()
			.then((result) => {
				setThaiNameEdit(result.data().thaiName);
				setEngNameEdit(result.data().engName);
				setSciNameEdit(result.data().sciName);
				setFamilyNameEdit(result.data().familyName);
				setInfoEdit(result.data().info);
				setAttributeEdit(result.data().attribute);
				setNewImgUrl(result.data().imgUrl);
				setnewChemBondUrl(result.data().chemBondUrl);
				setnewNMRUrl(result.data().NMRUrl);
				setActiveEdit(false);
			});
	};

	const uploadImg = (e) => {
		e.preventDefault();
		if (image) {
			const uploadTask = storage.ref(`images/${image.name}`).put(image);
			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					console.log(error);
				},
				() => {
					storage
						.ref("images")
						.child(image.name)
						.getDownloadURL()
						.then((imgUrl) => {
							setNewImgUrl(imgUrl);
							setUploadNoti(upload_complete_alert);
							setTimeout(() => {
								setUploadNoti(null);
							}, 3000);
						});
				}
			);
		} else {
			setUploadNoti(select_img_alert);
			setTimeout(() => {
				setUploadNoti(null);
			}, 3000);
			return null;
		}
	};

	const uploadNMR = (e) => {
		e.preventDefault();
		if (NMR) {
			const uploadTask = storage.ref(`NMR/${NMR.name}`).put(NMR);
			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					console.log(error);
				},
				() => {
					storage
						.ref("NMR")
						.child(NMR.name)
						.getDownloadURL()
						.then((NMRUrl) => {
							setNewNMRUrl(NMRUrl);
							setUploadNoti(upload_complete_alert);
							setTimeout(() => {
								setUploadNoti(null);
							}, 3000);
						});
				}
			);
		} else {
			setUploadNoti(select_img_alert);
			setTimeout(() => {
				setUploadNoti(null);
			}, 3000);
			return null;
		}
	};

	const uploadChemBond = (e) => {
		e.preventDefault();
		if (chemBond) {
			const uploadTask = storage.ref(`chemBond/${chemBond.name}`).put(chemBond);
			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					console.log(error);
				},
				() => {
					storage
						.ref("chemBond")
						.child(chemBond.name)
						.getDownloadURL()
						.then((chemBondUrl) => {
							setnewChemBondUrl(chemBondUrl);
							setUploadNoti(upload_complete_alert);
							setTimeout(() => {
								setUploadNoti(null);
							}, 3000);
						});
				}
			);
		} else {
			setUploadNoti(select_img_alert);
			setTimeout(() => {
				setUploadNoti(null);
			}, 3000);
			return null;
		}
	};

	const ConfirmCancel = () => {
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
						<Typography>ยืนยันการยกเลิกการแก้ไข</Typography>
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							คุณต้องการยกเลิกการแก้ไขข้อมูลสมุนไพรนี้ใช่หรือไม่?
							คลิก(ใช่)เพื่อกลับสู่หน้าข้อมูลสมุนไพร
							หรือคลิก(ไม่ใช่)เพื่อดำเนินการแก้ไขต่อ.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button autoFocus onClick={handleClose} color="default">
							<Typography>ไม่ใช่</Typography>
						</Button>
						<Button onClick={handleCancel} color="primary">
							<Typography>ใช่</Typography>
						</Button>
					</DialogActions>
				</Dialog>
			</span>
		);
	};

	const Status = () => {
		if (props.status === "ยืนยันแล้ว") {
			return (
				<span>
					<Typography style={{ color: "#03C03C" }}>{props.status}</Typography>
				</span>
			);
		} else {
			return (
				<span>
					<Typography style={{ color: "#FF0800" }}>{props.status}</Typography>
				</span>
			);
		}
	};

	return (
		<SnackbarProvider maxSnack={3}>
			<Container component="main">
				<CssBaseline />
				<Box style={frameStyles}>
					<div>
						{!activeEdit ? (
							<div>
								{loading && <ReactLoading type={"bars"} color={"black"} />}
								<form>
									<div>
										<Typography
											variant="h4"
											style={{
												fontWeight: "bold",
												paddingLeft: "10px",
												paddingRight: "10px",
												paddingTop: "10px",
												display: "inline",
											}}
										>
											ประวัติการแก้ไขเมื่อ
										</Typography>
										<Typography
											variant="h4"
											style={{
												fontWeight: "bold",
												display: "inline",
											}}
										>
											:&nbsp;
										</Typography>
										<Typography
											variant="h5"
											style={{
												fontWeight: "normal",
												color: "#007FFF",
												display: "inline",
											}}
										>
											{props.date}
										</Typography>
									</div>
									<div className={classes.cardRoot}>
										<Grid container spacing={2}>
											<Grid item xs={6}>
												<Card className={classes.userCard}>
													<Typography
														style={{
															display: "inline",
															textDecoration: "underline",
															fontWeight: "bold",
															paddingLeft: "10px",
															paddingRight: "10px",
															paddingBottom: "10px",
														}}
													>
														ผู้แก้ไข
													</Typography>
													<Typography className={classes.space}>
														:&nbsp;
													</Typography>
													<Typography
														style={{
															fontWeight: "normal",
															color: "#007FFF",
															display: "inline",
														}}
													>
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
												</Card>
											</Grid>
											<Grid item xs={6}>
												<Card className={classes.statusCard}>
													<CardActionArea>
														<Typography className={classes.title}>
															สถานะข้อมูล
														</Typography>
														<Typography className={classes.space}>
															:&nbsp;
														</Typography>
														<Status />
													</CardActionArea>
												</Card>
											</Grid>
										</Grid>
									</div>
									<div className={classes.DAC}>
										<Card className={classes.attributeCard}>
											<CardContent>
												<div>
													<Typography className={classes.title}>
														ชื่อภาษาไทย
													</Typography>
													<Typography className={classes.space}>
														:&nbsp;
													</Typography>
													<Typography className={classes.content}>
														{props.thaiName}
													</Typography>
												</div>
												<br />
												<div>
													<Typography className={classes.title}>
														ชื่อภาษาอังกฤษ
													</Typography>
													<Typography className={classes.space}>
														:&nbsp;
													</Typography>
													<Typography className={classes.content}>
														{props.engName}
													</Typography>
												</div>
												<br />
												<div>
													<Typography className={classes.title}>
														ชื่อทางวิทยาศาสตร์
													</Typography>
													<Typography className={classes.space}>
														:&nbsp;
													</Typography>
													<Typography className={classes.content}>
														{props.sciName}
													</Typography>
												</div>
												<br />
												<div>
													<Typography className={classes.title}>
														ชื่อวงศ์
													</Typography>
													<Typography className={classes.space}>
														:&nbsp;
													</Typography>
													<Typography className={classes.content}>
														{props.familyName}
													</Typography>
												</div>
											</CardContent>
										</Card>
									</div>
									<div className={classes.DAC}>
										<Card className={classes.attributeCard}>
											<CardContent>
												<Typography className={classes.title}>
													ข้อมูลสมุนไพร:
												</Typography>
												<Typography className={classes.herbDetail}>
													{props.info}
												</Typography>
											</CardContent>
										</Card>
									</div>
									<div className={classes.DAC}>
										<Card className={classes.attributeCard}>
											<CardContent>
												<Typography className={classes.title}>
													สรรพคุณของสมุนไพร:
												</Typography>
												<Typography className={classes.herbDetail}>
													{props.attribute}
												</Typography>
											</CardContent>
										</Card>
									</div>
									<div className={classes.DAC}>
										<Card className={classes.imageCard}>
											<CardContent>
												<Typography className={classes.title}>
													รูปสมุนไพร
												</Typography>
												<Grid item xs={12} sm={6} md={3}>
													<img
														component="img"
														width="100%!important"
														height="100%!important"
														objectfit="contain"
														src={props.imgUrl}
														alt=""
													/>
												</Grid>
											</CardContent>
										</Card>
									</div>
									<div className={classes.DAC}>
										<Card className={classes.imageCard}>
											<CardContent>
												<Typography className={classes.title}>
													รูปพันธะเคมี
												</Typography>
												<Grid item xs={12} sm={6} md={3}>
													<img
														component="img"
														width="1080px!important"
														height="auto!important"
														objectfit="contain"
														src={props.chemBondUrl}
														alt="No image"
													/>
												</Grid>
											</CardContent>
										</Card>
									</div>
									<div className={classes.DAC}>
										<Card className={classes.imageCard}>
											<CardContent>
												<Typography className={classes.title}>
													ตาราง NMR
												</Typography>
												<Grid item xs={12} sm={6} md={3}>
													<img
														component="img"
														width="1080px!important"
														height="auto!important"
														objectfit="contain"
														src={props.NMRUrl}
														alt="No image"
													/>
												</Grid>
											</CardContent>
										</Card>
									</div>
									<div>
										<div className={classes.cardRoot}>
											<Grid container spacing={3}>
												<Grid item xs={12}>
													<Typography
														style={{ fontWeight: "bold", float: "left" }}
													>
														เมื่อ:&nbsp;
													</Typography>
													<Typography
														style={{
															color: "#007FFF",
															textTransform: "capitalize",
															display: "inline",
															float: "left",
														}}
													>
														{props.date}
													</Typography>
													<Typography
														style={{
															fontWeight: "bold",
															display: "inline",
															float: "left",
														}}
													>
														&nbsp;เวลา:&nbsp;
													</Typography>
													<Typography
														style={{
															color: "#007FFF",
															textTransform: "capitalize",
															float: "left",
														}}
													>
														{props.timestamp}
													</Typography>
												</Grid>
											</Grid>
										</div>
									</div>
								</form>
								{loading && <ReactLoading type={"bars"} color={"black"} />}
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										justifyContent: "center",
										marginTop: "20px",
									}}
								>
									<Grid
										container
										spacing={1}
										style={{ display: "flex", justifyContent: "center" }}
									>
										{loggedIn && (
											<Button
												startIcon={<EditIcon />}
												className={classes.editButton}
												onClick={toggleEdit}
												color="primary"
											>
												<Typography>แก้ไข</Typography>
											</Button>
										)}

										<Button
											startIcon={<ArrowBackIcon />}
											className={classes.backButton}
											onClick={() => router.back()}
											color="default"
											variant="outlined"
										>
											<Typography style={{ color: "black" }}>กลับ</Typography>
										</Button>
									</Grid>
								</div>
							</div>
						) : (
							<div>
								<form>
									<div>
										<Typography
											variant="h4"
											style={{
												fontWeight: "bold",
												paddingLeft: "10px",
												paddingRight: "10px",
												paddingTop: "10px",
												display: "inline",
											}}
										>
											ประวัติการแก้ไข:
										</Typography>
										<Typography
											variant="h5"
											style={{
												fontWeight: "normal",
												color: "#007FFF",
												display: "inline",
											}}
										>
											{props.date}
										</Typography>
									</div>
									<div style={{ padding: "10px 0 10px 0" }}>
										<Typography className={classes.titleEdit}>
											ชื่อภาษาไทย:
										</Typography>
										<TextField
											fullWidth
											id="filled-multiline-static"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											value={thaiNameEdit}
											onChange={(e) => setThaiNameEdit(e.target.value)}
											placeholder="ชื่อสมุนไพรภาษาไทย ?"
										/>
									</div>
									<div style={{ padding: "10px 0 10px 0" }}>
										<Typography className={classes.titleEdit}>
											ชื่อภาษาอังกฤษ:
										</Typography>
										<TextField
											fullWidth
											id="filled-multiline-static"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											value={engNameEdit}
											onChange={(e) => setEngNameEdit(e.target.value)}
											placeholder="ชื่อสมุนไพรภาษาอังกฤษ ?"
										/>
									</div>
									<div style={{ padding: "10px 0 10px 0" }}>
										<Typography className={classes.titleEdit}>
											ชื่อทางวิทยาศาสตร์:
										</Typography>
										<TextField
											fullWidth
											id="filled-multiline-static"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											value={sciNameEdit}
											onChange={(e) => setSciNameEdit(e.target.value)}
											placeholder="ชื่อทางวิทยาศาสตร์ของสมุนไพร ?"
										/>
									</div>
									<div style={{ padding: "10px 0 10px 0" }}>
										<Typography className={classes.titleEdit}>
											ชื่อวงศ์:
										</Typography>
										<TextField
											fullWidth
											id="filled-multiline-static"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											value={familyNameEdit}
											onChange={(e) => setFamilyNameEdit(e.target.value)}
											placeholder="ชื่อวงศ์ของสมุนไพร ?"
										/>
									</div>
									<div style={{ padding: "10px 0 10px 0" }}>
										<Typography className={classes.titleEdit}>
											ข้อมูลสมุนไพร:
										</Typography>
										<TextField
											fullWidth
											id="filled-multiline-static"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											multiline
											rowsmin={10}
											value={infoEdit}
											onChange={(e) => setInfoEdit(e.target.value)}
											placeholder="ข้อมูลสมุนไพร ?"
										/>
									</div>
									<div style={{ padding: "10px 0 10px 0" }}>
										<Typography className={classes.titleEdit}>
											สรรพคุณของสมุนไพร:
										</Typography>
										<TextField
											fullWidth
											id="filled-multiline-static"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											multiline
											rowsmin={10}
											value={attributeEdit}
											onChange={(e) => setAttributeEdit(e.target.value)}
											placeholder="สรรพคุณของสมุนไพร ?"
										/>
									</div>
									<br />
									<div>{uploadNoti !== null && <div>{uploadNoti}</div>}</div>
									<br />
									<div>
										<Typography className={classes.titleEdit}>
											รูปสมุนไพร
										</Typography>
										<div>
											<input
												type="file"
												onChange={(e) => setImage(e.target.files[0])}
											/>
											<br />
											<div
												style={{
													position: "relative",
													top: "5px",
												}}
											>
												<Button
													type="submit"
													position="relative"
													type="secondary"
													variant="outlined"
													color="default"
													className={classes.button}
													startIcon={<CloudUploadIcon />}
													onClick={uploadImg}
												>
													<Typography>อัพโหลด</Typography>
												</Button>
											</div>
										</div>
										<br />
										<Typography className={classes.titleEdit}>
											รูปพันธะเคมี
										</Typography>
										<div>
											<input
												type="file"
												onChange={(e) => setChemBond(e.target.files[0])}
											/>
											<br />
											<div
												style={{
													position: "relative",
													top: "5px",
												}}
											>
												<Button
													type="submit"
													color="secondary"
													variant="outlined"
													color="default"
													className={classes.button}
													startIcon={<CloudUploadIcon />}
													onClick={uploadChemBond}
												>
													<Typography>อัพโหลด</Typography>
												</Button>
											</div>
										</div>
										<br />
										<Typography className={classes.titleEdit}>
											ตาราง NMR
										</Typography>
										<div>
											<input
												type="file"
												onChange={(e) => setNMR(e.target.files[0])}
											/>
											<br />
											<div
												style={{
													position: "relative",
													top: "5px",
												}}
											>
												<Button
													type="submit"
													position="relative"
													type="primary"
													variant="outlined"
													color="default"
													className={classes.button}
													startIcon={<CloudUploadIcon />}
													onClick={uploadNMR}
												>
													<Typography>อัพโหลด</Typography>
												</Button>
											</div>
										</div>
									</div>
								</form>
								<br />
								<br />
								<br />
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
										style={{
											display: "flex",
											flexWrap: "wrap",
											justifyContent: "center",
										}}
									>
										<Button
											startIcon={<SaveIcon />}
											className={classes.savechangeButton}
											onClick={handleUpdate}
											type="submit"
											color="primary"
										>
											<Typography>บันทึกการเปลี่ยนแปลง</Typography>
										</Button>

										<Button
											startIcon={<CancelIcon />}
											className={classes.cancelButton}
											onClick={handleClickOpen}
											type="submit"
											position="relative"
											color="default"
											variant="outlined"
										>
											<Typography style={{ color: "black" }}>ยกเลิก</Typography>
										</Button>
										<ConfirmCancel />
									</Grid>
								</div>
							</div>
						)}
					</div>
				</Box>
			</Container>
		</SnackbarProvider>
	);
};

export default detail;
