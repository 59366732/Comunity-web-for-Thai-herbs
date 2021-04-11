import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import db, { auth, generateUserDocument } from "../database/firebase.js";
import { green } from "@material-ui/core/colors";
import { loadCSS } from "fg-loadcss";
import { makeStyles, StylesProvider, useTheme } from "@material-ui/core/styles";
import styled, { ThemeProvider } from "styled-components";
import { Refresh } from "@material-ui/icons";
import {
	Avatar,
	Badge,
	Divider,
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
} from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	boxes: {
		left: "50%",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
	paper: {
		padding: theme.spacing(1),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
	title: {
		paddingRight: "5px",
		fontWeight: "bold",
		lineHeight: "12px",
		variant: "h3",
	},
	content: {
		paddingLeft: "5px",
		display: "inline",
		fontWeight: "normal",
		lineHeight: "12px",
	},
	gridRoot: {
		width: "fit-content",
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: theme.shape.borderRadius,
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.text.black,
		"& svg": {
			margin: theme.spacing(1.5),
		},
		"& hr": {
			margin: theme.spacing(0, 0.5),
		},
	},
	// card: {
	// 	backgroundColor: "#fafad2",
	// },
	largeAvatar: {
		width: theme.spacing(25),
		height: theme.spacing(25),
	},
}));
function Profile_demo() {
	const classes = useStyles();
	const { user, setUser } = useContext(UserContext);
	const [activateEdit, setActiveEdit] = useState(false);
	const [displayName, setDisplayName] = useState(user.displayName);

	const toggleEdit = (e) => {
		e.preventDefault();
		setActiveEdit(true);
	};

	const getNewUser = async (u) => {
		const newData = await generateUserDocument(u);
		setUser(newData);
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		db.collection("users")
			.doc(user.uid)
			.update({ ...user, displayName })
			.then(setActiveEdit(false), getNewUser(user));
	};

	const handleCancel = (e) => {
		e.preventDefault();

		setDisplayName(user.displayName);
		setActiveEdit(false);
	};

	const Info = () => {
		return (
			<span>
				<div className="profile-card__cnt js-profile-cnt">
					<div className="profile-card__name">{user.displayName}</div>
					<div className="profile-card__txt">
						อีเมล: <strong>{user.email}</strong>
					</div>
					<div className="profile-card-inf">
						<div className="profile-card-inf__item">
							<div className="profile-card-inf__title">{user.level}</div>
							<div className="profile-card-inf__txt">ระดับ</div>
						</div>
						<div className="profile-card-inf__item">
							<div className="profile-card-inf__title">{user.score}</div>
							<div className="profile-card-inf__txt">คะแนน</div>
						</div>
					</div>
					<div className="profile-card-ctr">
						<Button>
							<Typography>แก้ไข</Typography>
						</Button>
					</div>
				</div>
			</span>
		);
	};
	return (
		<div
			style={{
				padding: "50px 0 0 0",
			}}
		>
			<div className="profile-card js-profile-card">
				{!activateEdit ? (
					<React.Fragment>
						<div className="profile-card__img">
							<img
								src={
									user.photoURL ||
									"https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
								}
								alt=""
							/>
						</div>
						<Grid container spacing={3}>
							<Grid
								item
								xs={12}
								container
								alignItems="center"
								className={classes.gridRoot}
							>
								<Grid item xs={12} sm={6}>
									<Box
										display="flex"
										flexDirection="row"
										justifyContent="flex-end"
									>
										<Typography
											variant="h5"
											className={classes.title}
											htmlFor="displayName"
										>
											ชื่อ&emsp;&emsp;:
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box
										display="flex"
										flexDirection="row"
										justifyContent="flex-start"
									>
										<Typography className={classes.content}>
											{user.displayName}
										</Typography>
									</Box>
								</Grid>
							</Grid>
							<Grid
								item
								xs={12}
								container
								alignItems="center"
								className={classes.gridRoot}
							>
								<Grid item xs={12} sm={6}>
									<Box
										display="flex"
										flexDirection="row"
										justifyContent="flex-end"
									>
										<Typography
											variant="h5"
											className={classes.title}
											htmlFor="userEmail"
										>
											อีเมล&ensp;&ensp;:
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box
										display="flex"
										flexDirection="row"
										justifyContent="flex-start"
									>
										<Typography className={classes.content}>
											{user.email}
										</Typography>
									</Box>
								</Grid>
							</Grid>
							<Grid
								item
								xs={12}
								container
								alignItems="center"
								className={classes.gridRoot}
							>
								<Grid item xs={12} sm={6}>
									<Box
										display="flex"
										flexDirection="row"
										justifyContent="flex-end"
									>
										<Typography
											variant="h5"
											className={classes.title}
											htmlFor="score"
										>
											คะแนน&nbsp;:
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box
										display="flex"
										flexDirection="row"
										justifyContent="flex-start"
									>
										<Typography className={classes.content}>
											{user.score}
										</Typography>
									</Box>
								</Grid>
							</Grid>
							<Grid
								item
								xs={12}
								container
								alignItems="center"
								className={classes.gridRoot}
							>
								<Grid item xs={12} sm={6}>
									<Box
										display="flex"
										flexDirection="row"
										justifyContent="flex-end"
									>
										<Typography
											variant="h5"
											className={classes.title}
											htmlFor="level"
										>
											ระดับ&ensp;&ensp;:
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box
										display="flex"
										flexDirection="row"
										justifyContent="flex-start"
									>
										<Typography className={classes.content}>
											{user.level}
										</Typography>
									</Box>
								</Grid>
							</Grid>
							<Grid
								item
								xs={12}
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "center",
								}}
							>
								<Button style={{ marginTop: "120px" }} onClick={toggleEdit}>
									<Typography>แก้ไข</Typography>
								</Button>
							</Grid>
						</Grid>
					</React.Fragment>
				) : (
					<React.Fragment>
						<div className="profile-card__img">
							<img
								src={
									user.photoURL ||
									"https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
								}
								alt=""
							/>
						</div>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6}>
								<Box
									display="flex"
									flexDirection="row"
									alignItems="center"
									justifyContent="flex-end"
								>
									<Typography
										variant="h5"
										className={classes.title}
										htmlFor="displayName"
									>
										ชื่อ&emsp;&emsp;:
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Box
									display="flex"
									flexDirection="row"
									justifyContent="flex-start"
								>
									<TextField
										label="Editable"
										variant="outlined"
										defaultValue={displayName}
										onChange={(e) => setDisplayName(e.target.value)}
										placeholder={displayName}
									/>
								</Box>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Box
									display="flex"
									flexDirection="row"
									justifyContent="flex-end"
								>
									<Typography
										variant="h5"
										className={classes.title}
										htmlFor="userEmail"
									>
										อีเมล&ensp;&ensp;:
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Box
									display="flex"
									flexDirection="row"
									justifyContent="flex-start"
								>
									<TextField
										id="outlined-read-only-input"
										label="Read Only"
										InputProps={{
											readOnly: true,
										}}
										variant="outlined"
										value={user.email}
									/>
								</Box>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Box
									display="flex"
									flexDirection="row"
									justifyContent="flex-end"
								>
									<Typography
										variant="h5"
										className={classes.title}
										htmlFor="userEmail"
									>
										คะแนน&nbsp;:
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Box
									display="flex"
									flexDirection="row"
									justifyContent="flex-start"
								>
									<TextField
										id="outlined-read-only-input"
										label="Read Only"
										InputProps={{
											readOnly: true,
										}}
										variant="outlined"
										value={user.score}
									/>
								</Box>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Box
									display="flex"
									flexDirection="row"
									justifyContent="flex-end"
								>
									<Typography
										variant="h5"
										className={classes.title}
										htmlFor="userEmail"
									>
										ระดับ&ensp;&ensp;:
									</Typography>
								</Box>
							</Grid>
							<Grid container alignItems="center" item xs={12} sm={6}>
								<Box
									display="flex"
									flexDirection="row"
									justifyContent="flex-start"
								>
									<TextField
										className={classes.content}
										id="outlined-read-only-input"
										label="Read Only"
										InputProps={{
											readOnly: true,
										}}
										variant="outlined"
										value={user.level}
									/>
								</Box>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Box
									display="flex"
									flexDirection="row"
									justifyContent="flex-end"
								>
									<Button
										onClick={handleUpdate}
										type="submit"
										color="primary"
										variant="contained"
									>
										<Typography>บันทึกการเปลี่ยนแปลง</Typography>
									</Button>
								</Box>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Box
									display="flex"
									flexDirection="row"
									justifyContent="flex-start"
								>
									<Button
										onClick={handleCancel}
										type="submit"
										variant="outlined"
										color="default"
									>
										<Typography style={{ color: "black" }}>ยกเลิก</Typography>
									</Button>
								</Box>
							</Grid>
						</Grid>
					</React.Fragment>
				)}
			</div>
		</div>
	);
}
export default Profile_demo;
