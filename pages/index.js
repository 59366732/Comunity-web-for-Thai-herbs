import React, { useState, useEffect } from "react";
import db from "../database/firebase.js";
import Addherb from "./addherb";
import Link from "next/link";
import { auth } from "../database/firebase";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { storage } from "../database/firebase";
import PropTypes from "prop-types";
import Skeleton from "@material-ui/lab/Skeleton";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import {
	Box,
	Card,
	CardHeader,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Button,
	Typography,
	Paper,
	Grid,
} from "@material-ui/core/";
import {
	createMuiTheme,
	withStyles,
	makeStyles,
	ThemeProvider,
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		...theme.typography.button,
		flexGrow: 1,
		// padding: theme.spacing(2),
		backgroundColor: "none",
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
	addHerbButton: {
		margin: theme.spacing(1),
	},
	media: {
		height: 160,
	},
	content: {
		textAlign: "center",
	},
	description: {
		alignItems: "center",
	},
	title: {
		fontWeight: "bold",
	},
}));

function limitContent(string, limit) {
	var dots = "...";
	if (string != null && string.length > limit) {
		string = string.substring(0, limit) + dots;
	} else {
		string = string;
	}
	return string;
}
function Home(props) {
	const [herbs, setHerbs] = useState([]);
	const [loggedIn, setLoggedIn] = useState(false);
	const { loading = false } = props;

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	useEffect(() => {
		db.collection("herbs")
			.orderBy("timestamp", "desc")
			.onSnapshot((snap) => {
				const herbsData = snap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setHerbs([]);
				{
					herbsData.map((herb) => {
						if (herb.user_id) {
							db.collection("users")
								.doc(herb.user_id)
								.get()
								.then((result) => {
									const newObject = Object.assign(herb, result.data());
									setHerbs((herbs) => [...herbs, newObject]);
								});
						}
					});
				}
			});
	}, []);

	const classes = useStyles();
	return (
		<div className={classes.root} style={{ position: "relative" }}>
			<div style={{ textAlign: "center" }}>
				{loggedIn && (
					<div style={{ marginBottom: "5px" }}>
						{loading ? (
							<Skeleton variant="rect" width={100} height={30} />
						) : (
							<Link href="/addherb">
								<Button
									width="200px"
									color="primary"
									className={classes.addHerbButton}
								>
									<AddCircleOutlineIcon />
									<Typography>เพิ่มข้อมูลสมุนไพร</Typography>
								</Button>
							</Link>
						)}
					</div>
				)}
				<div style={{ paddingTop: "5px" }}>
					<Grid container spacing={2} direction="row">
						{herbs.map((herb) => (
							<Grid
								key={herb.id}
								item
								xs={12}
								sm={6}
								md={3}
								key={herbs.indexOf(herb)}
							>
								<Card>
									<Link href="/herb/[id]" as={"/herb/" + herb.id}>
										<CardActionArea>
											{loading ? (
												<Skeleton variant="rect" height={160} />
											) : (
												<CardMedia
													component="img"
													alt=""
													className={classes.media}
													image={
														herb.imgUrl ||
														"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.ouOFcEHOYh7Dj3JCmDUfhwAAAA%26pid%3DApi&f=1"
													}
													title="Herb Image"
												/>
											)}
											<CardContent className={classes.title}>
												<Typography
													gutterBottom
													variant="h5"
													component="h2"
													itemProp="hello"
												>
													{herb.thaiName}
												</Typography>
											</CardContent>
										</CardActionArea>
									</Link>
									<CardActions>
										<Typography
											variant="caption"
											style={{ fontWeight: "bold", float: "left" }}
										>
											{loading ? <Skeleton variant="text" /> : "โดย:"}
										</Typography>
										{loading ? (
											<Typography variant="caption">
												<Skeleton variant="text" />
											</Typography>
										) : (
											<Typography
												variant="caption"
												style={{
													color: "#007FFF",
													textTransform: "capitalize",
													margin: "0 0 0 2px",
												}}
											>
												{limitContent(herb.displayName, 6)}
											</Typography>
										)}
										<Typography
											variant="caption"
											style={{
												fontWeight: "bold",
												display: "inline",
												margin: "0 0 0 3px",
											}}
										>
											{loading ? <Skeleton variant="text" /> : "เมื่อ:"}
										</Typography>
										{loading ? (
											<Typography variant="caption">
												<Skeleton variant="text" />
											</Typography>
										) : (
											<Typography
												variant="caption"
												style={{
													display: "inline",
													color: "#007FFF",
													textTransform: "capitalize",
													margin: "0 0 0 2px",
												}}
											>
												{limitContent(
													new Date(
														herb.timestamp.seconds * 1000
													).toDateString(),
													15
												)}
											</Typography>
										)}
										<Typography
											style={{
												display: "inline",
												fontWeight: "bold",
												margin: "0 0 0 0",
											}}
										>
											{loading ? <skeleton /> : <>,&ensp;</>}
										</Typography>
										{loading ? (
											<skeleton variant="text" />
										) : (
											<Typography
												variant="caption"
												style={{
													color: "#007FFF",
													display: "inline",
													textTransform: "lowercase",
													margin: "0 0 0 0px",
												}}
											>
												{new Date(
													herb.timestamp.seconds * 1000
												).toLocaleTimeString()}
											</Typography>
										)}
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				</div>
			</div>
		</div>
	);
}

export default Home;
