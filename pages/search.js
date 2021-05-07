import React, { Component, useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import db from "../database/firebase";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchComponent from "../component/searchBar";
import Link from "next/link";

import SearchBar from "material-ui-search-bar";
import LinearProgress from "@material-ui/core/LinearProgress";

import {
	TextField,
	CssBaseline,
	Container,
	CardHeader,
	Card,
	CardActionArea,
	CardActions,
	CardMedia,
	CardContent,
	Button,
	Typography,
	Paper,
	Grid,
	InputLabel,
	MenuItem,
	FormControl,
	Select,
	List,
	ListItem,
} from "@material-ui/core/";
import Alert from "@material-ui/lab/Alert";
const useStyles = makeStyles((theme) => ({
	root: {
		...theme.typography.button,
		flexGrow: 1,
		// padding: theme.spacing(2),
		backgroundColor: "none",
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
	button: {
		padding: theme.spacing(1),
	},
	formControl: {
		width: "100%",
		minwidth: 120,
	},
	list: {
		display: "flex",
		justifyContent: `space-between`,
		alignItem: "center",
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

function Search(props) {
	const classes = useStyles();
	const [herbs, setHerbs] = useState([]);
	const { loading = false } = props;

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

	const filterPosts = (herbs, query) => {
		if (!query) {
			return [];
		}

		return herbs.filter((post) => {
			const herbName = post.thaiName.toLowerCase();
			return herbName.includes(query);
		});
	};

	const [searchQuery, setSearchQuery] = useState("");
	const filteredPosts = filterPosts(herbs, searchQuery);

	return (
		<div
			style={{ textAlign: "center", position: "relative" }}
			className={classes.root}
		>
			<CssBaseline />
			<div style={{ paddingBottom: "20px" }}>
				<SearchComponent
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>
			</div>
			<div style={{ paddingTop: "20px" }}>
				<Grid container spacing={2} direction="row">
					{filteredPosts.map((herb) => (
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
												new Date(herb.timestamp.seconds * 1000).toDateString(),
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
	);
}

export default Search;
