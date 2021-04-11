// @ts-nocheck
import React, { useState, useContext } from "react";
import db, { auth, storage } from "../database/firebase.js";
import firebase from "firebase";
import { useRouter } from "next/router";
import { UserContext } from "../providers/UserProvider";

import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab/";
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
} from "@material-ui/core/";

import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

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
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: "25ch",
	},
	button: {
		margin: theme.spacing(1, "auto"),
	},
	grid: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
	title: {
		fontWeight: "bold",
	},
	snackbar: {
		width: "100%",
	},
}));


function Addherb() {
	const classes = useStyles();
	const [openBack, setOpenBack] = React.useState(false);
	const [openSnackbar, setOpenSnackbar] = React.useState(false);

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnackbar(false);
	};

	const handleClickOpenBack = () => {
		setOpenBack(true);
	};

	const handleCloseBack = () => {
		setOpenBack(false);
	};

	const [error, setError] = useState(null);
	const [uploadNoti, setUploadNoti] = useState(null);

	const router = useRouter();
	const { user, setUser } = useContext(UserContext);

	//herb form
	const [thaiName, setThaiName] = useState("");
	const [engName, setEngName] = useState("");
	const [sciName, setSciName] = useState("");
	const [familyName, setFamilyName] = useState("");
	const [info, setInfo] = useState("");
	const [attribute, setAttribute] = useState("");

	//img
	const [image, setImage] = useState(null);
	const [imgUrl, setImgUrl] = useState("");

	//NMR
	const [NMR, setNMR] = useState(null);
	const [NMRUrl, setNMRUrl] = useState("");

	//Chem bond
	const [chemBond, setChemBond] = useState(null);
	const [chemBondUrl, setChemBondUrl] = useState("");

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

	const info_alert = (
		<span>
			<Alert severity="error">
				<Typography>
					ในการเพิ่มข้อมูลสมุนไพรเข้าสู่ระบบ
					จำเป็นต้องมีชื่อสมุนไพรและข้อมูลพื้นฐานของสมุนไพร!!!
				</Typography>
			</Alert>
		</span>
	);

	const pushToHistory = async (herb_id) => {
		const data = await db.collection("herbs").doc(herb_id).get();

		db.collection("herbs").doc(herb_id).collection("historys").add({
			herb_id: data.id,
			userDisplayName: data.data().userDisplayName,
			thaiName: data.data().thaiName,
			engName: data.data().engName,
			sciName: data.data().sciName,
			familyName: data.data().familyName,
			info: data.data().info,
			attribute: data.data().attribute,
			timestamp: data.data().timestamp,
			imgUrl: data.data().imgUrl,
			NMRUrl: data.data().NMRUrl,
			chemBondUrl: data.data().chemBondUrl,
			status: data.data().status,
			voteCount: data.data().voteCount,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (thaiName && info && attribute) {
			db.collection("herbs")
				.add({
					userDisplayName: user.displayName,
					thaiName: thaiName,
					engName: engName,
					sciName: sciName,
					familyName: familyName,
					info: info,
					attribute: attribute,
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
					imgUrl: imgUrl,
					NMRUrl: NMRUrl,
					chemBondUrl: chemBondUrl,
					status: "ยังไม่ได้ยืนยัน",
					voteCount: 0,
				})
				.then((result) => {
					pushToHistory(result.id);
				});
		} else {
			setError(info_alert);
			setOpenSnackbar(true);
			setTimeout(() => {
				setError(null);
			}, 3000);
			return null;
		}

		setThaiName("");
		setEngName("");
		setSciName("");
		setFamilyName("");
		setInfo("");
		setAttribute("");
		setImage(null);
		setImgUrl("");
		setNMR(null);
		setNMRUrl("");
		setChemBond(null);
		setChemBondUrl("");
		router.push("/");
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
							setImgUrl(imgUrl);
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
							setNMRUrl(NMRUrl);
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
							setChemBondUrl(chemBondUrl);
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

	function SnackbarAlert(props) {
		return <MuiAlert className={classes.snackbar} elevation={6} variant="filled" {...props} />;
	}
	const ConfirmBack = () => {
		return (
			<span>
				<Dialog
					open={openBack}
					TransitionComponent={Transition}
					keepMounted
					onClose={handleCloseBack}
					PaperComponent={PaperComponent}
					aria-labelledby="draggable-dialog-title"
				>
					<DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
						<Typography>ยืนยันการยกเลิกการแก้ไข</Typography>
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							คุณต้องการยกเลิกการเพิ่มข้อมูลสมุนไพรนี้ใช่หรือไม่?
							คลิก(ใช่)เพื่อกลับสู่หน้าข้อมูลสมุนไพร
							หรือคลิก(ไม่ใช่)เพื่อดำเนินการเพิ่มข้อมูลสมุนไพรต่อ.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button autoFocus onClick={handleCloseBack} color="default">
							<Typography>ไม่ใช่</Typography>
						</Button>
						<Button
							onClick={handleCloseBack}
							onClick={() => router.back()}
							color="primary"
						>
							<Typography>ใช่</Typography>
						</Button>
					</DialogActions>
				</Dialog>
			</span>
		);
	};

	return (
		<div>
			<Container className="main">
				<CssBaseline />
				<Box style={frameStyles}>
					<div>
						<Typography
							variant="h3"
							style={{
								margin: "0 0 0 30px",
								padding: "0 0 10px 0",
								position: "relative",
							}}
						>
							เพิ่มข้อมูลสมุนไพรไทย
						</Typography>
						{error !== null && <div>{error}</div>}
						<form>
							<div>
								<Typography className={classes.title}>ชื่อภาษาไทย:</Typography>
								<TextField
									fullWidth
									id="filled-multiline-static"
									variant="filled"
									fontFamily="sans-serif"
									value={thaiName}
									onChange={(e) => setThaiName(e.target.value)}
									placeholder="ชื่อสมุนไพรภาษาไทย ?"
								/>
							</div>
							<br />
							<br />
							<div>
								<Typography className={classes.title}>
									ชื่อภาษาอังกฤษ:
								</Typography>
								<TextField
									fullWidth
									id="filled-multiline-static"
									variant="filled"
									fontFamily="sans-serif"
									value={engName}
									onChange={(e) => setEngName(e.target.value)}
									placeholder="ชื่อสมุนไพรภาษาอังกฤษ ?"
								/>
							</div>
							<br />
							<br />
							<div>
								<Typography className={classes.title}>
									ชื่อทางวิทยาศาสตร์:
								</Typography>
								<TextField
									fullWidth
									id="filled-multiline-static"
									variant="filled"
									fontFamily="sans-serif"
									value={sciName}
									onChange={(e) => setSciName(e.target.value)}
									placeholder="ชื่อทางวิทยาศาสตร์ของสมุนไพร ?"
								/>
							</div>
							<br />
							<br />
							<div>
								<Typography className={classes.title}>ชื่อวงศ์:</Typography>
								<TextField
									fullWidth
									id="filled-multiline-static"
									variant="filled"
									fontFamily="sans-serif"
									value={familyName}
									onChange={(e) => setFamilyName(e.target.value)}
									placeholder="ชื่อวงศ์ของสมุนไพร ?"
								/>
							</div>
							<br />
							<br />
							<div>
								<Typography className={classes.title}>
									ข้อมูลสมุนไพร:
								</Typography>
								<TextField
									fullWidth
									multiline
									id="filled-multiline-static"
									variant="filled"
									fontFamily="sans-serif"
									rows={7}
									value={info}
									onChange={(e) => setInfo(e.target.value)}
									placeholder="ข้อมูลสมุนไพร ?"
								/>
							</div>
							<br />
							<br />
							<div>
								<Typography className={classes.title}>
									สรรพคุณของสมุนไพร:
								</Typography>
								<TextField
									fullWidth
									multiline
									id="filled-multiline-static"
									variant="filled"
									fontFamily="sans-serif"
									rows={7}
									value={attribute}
									onChange={(e) => setAttribute(e.target.value)}
									placeholder="สรรพคุณของสมุนไพร ?"
								/>
								<br />
								<br />
							</div>
							<br />
							<div>{uploadNoti !== null && <div>{uploadNoti}</div>}</div>
							<Typography className={classes.title}>รูปสมุนไพร</Typography>
							<div>
								<input
									type="file"
									onChange={(e) => setImage(e.target.files[0])}
								/>
								<br />
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
									Upload
								</Button>
							</div>
							<br />
							<Typography className={classes.title}>รูปพันธะเคมี</Typography>
							<div>
								<input
									type="file"
									onChange={(e) => setChemBond(e.target.files[0])}
								/>
								<br />
								<Button
									type="submit"
									position="relative"
									type="secondary"
									variant="outlined"
									color="default"
									className={classes.button}
									startIcon={<CloudUploadIcon />}
									onClick={uploadChemBond}
								>
									Upload
								</Button>
							</div>
							<br />
							<Typography className={classes.title}>ตาราง NMR</Typography>
							<div>
								<input
									type="file"
									onChange={(e) => setNMR(e.target.files[0])}
								/>
								<br />
								<Button
									type="submit"
									position="relative"
									type="secondary"
									variant="outlined"
									color="default"
									className={classes.button}
									startIcon={<CloudUploadIcon />}
									onClick={uploadNMR}
								>
									Upload
								</Button>
							</div>
						</form>
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
								style={{ display: "flex", justifyContent: "center" }}
							>
								<Grid
									item
									xs={3}
									container
									spacing={1}
									style={{ display: "flex", justifyContent: "center" }}
								>
									<Button
										variant="contained"
										color="primary"
										onClick={handleSubmit}
										type="submit"
										startIcon={<SaveIcon />}
									>
										<Typography>บันทึก</Typography>
									</Button>
									<Snackbar
										open={openSnackbar}
										autoHideDuration={6000}
										onClose={handleCloseSnackbar}
									>
										<SnackbarAlert
											onClose={handleCloseSnackbar}
											severity="warning"
										>
											<Typography>
												ในการเพิ่มข้อมูลสมุนไพรเข้าสู่ระบบ
												จำเป็นต้องเพิ่มชื่อสมุนไพรและข้อมูลพื้นฐานของสมุนไพร!!!
											</Typography>
										</SnackbarAlert>
									</Snackbar>
								</Grid>
								<Grid
									item
									xs={3}
									container
									spacing={1}
									style={{ display: "flex", justifyContent: "center" }}
								>
									<Button
										position="relative"
										color="default"
										variant="outlined"
										startIcon={<ArrowBackIcon />}
										type="secondary"
										onClick={handleClickOpenBack}
									>
										<Typography>กลับ</Typography>
									</Button>
									<ConfirmBack />
								</Grid>
							</Grid>
						</div>
					</div>
				</Box>
			</Container>
		</div>
	);
}

export default Addherb;
