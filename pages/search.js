import React, { Component, useState } from "react";
import AsyncSelect from "react-select/async";
import db from "../database/firebase";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import {
	TextField,
	CssBaseline,
	Container,
	CardHeader,
	Card,
	CardActionArea,
	CardActions,
	CardMedia,
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
import SearchOption from "../component/searchoption";
const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(1),
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

function Search() {
	const classes = useStyles();
	const [selectedTag, setSelectedTag] = useState([]);
	const [fullWidth, setFullWidth] = React.useState("true");
	const [herbs, setHerbs] = useState([]);
	const [searchName, setSearchName] = useState([]);
	const [error, setError] = useState(null);

	const please_type_before = (
		<span>
			<Alert severity="warning">
				<Typography>กรุณาพิมพ์ข้อความเพื่อทำการค้นหา!!!</Typography>
			</Alert>
		</span>
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (searchName) {
			db.collection("herbs")
				.where("thaiName", "==", searchName)
				.orderBy("timestamp", "desc")
				.onSnapshot((snapshot) =>
					setHerbs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
				);
		} else {
			setError(please_type_before);
			setTimeout(() => {
				setError(null);
			}, 2000);
		}

		setSearchName("");
	};

	// const loadOptions = async (inputValue) => {
	//   inputValue = inputValue.toLowerCase().replace(/\W/g, "");
	//   return new Promise((resolve) => {
	//     db.collection("herbs")
	//       .orderBy("timestamp")
	//       .startAt(inputValue)
	//       .endAt(inputValue + "\uf8ff")
	//       .get()
	//       .then((docs) => {
	//         if (!docs.empty) {
	//           let recommendedTags = [];
	//           docs.forEach(function (doc) {
	//             const tag = {
	//               value: doc.id,
	//               label: doc.data().thaiName,
	//             };
	//             recommendedTags.push(tag);
	//           });
	//           return resolve(recommendedTags);
	//         } else {
	//           return resolve([]);
	//         }
	//       });
	//   });
	// };

	// handleOnChange = (tags) => {
	//   this.setState({
	//     selectedTag: [tags],
	//   });
	// };

	// return (
	// 	<div>
	// 		<AsyncSelect
	// 			value={selectedTag}
	// 			loadOptions={loadOptions}
	// 			onChange={(e) => setSelectedTag(e.target.value)}
	// 		/>
	// 		<p>Selected Tag:</p>
	// 		{this.state.selectedTag.map((e) => {
	// 			return <li key={e.value}>{e.label}</li>;
	// 		})}
	// 	</div>
	// );

	return (
		<div style={{ textAlign: "center" }} className={classes.root}>
			<CssBaseline />
			<Container maxWidth="sm">
				<form>
					<div style={{ display: "inline" }}>
						<List>
							<ListItem>
								<TextField
									fullWidth
									variant="outlined"
									value={searchName}
									onChange={(e) => setSearchName(e.target.value)}
									placeholder="ค้นหา"
								/>
							</ListItem>
							<ListItem>{error !== null && <div>{error}</div>}</ListItem>
							<ListItem>
								<div className={classes.formControl}>
									<SearchOption />
								</div>
							</ListItem>
							<ListItem>
								<Button
									className={classes.button}
									fullWidth
									onClick={handleSubmit}
									color="primary"
									type="submit"
								>
									<SearchIcon />
									ค้นหา
								</Button>
							</ListItem>
						</List>
					</div>
				</form>
				<div>
					{herbs ? (
						herbs.map((herb) => (
							<li key={herb.id}>
								<Link href="/herb/[id]" as={"/herb/" + herb.id}>
									<a itemProp="hello">{herb.herbname}</a>
								</Link>
							</li>
						))
					) : (
						<h1>No matching documents</h1>
					)}
				</div>
				<div style={{ paddingTop: "5px" }}>
					<Grid container spacing={2} direction="row">
						{herbs.map((herb) => (
							<Grid item xs={12} sm={6} md={3} key={herbs.indexOf(herb)}>
								<Card>
									<CardActionArea>
										<CardMedia
											className={classes.media}
											image={herb.imgUrl}
											title="Herb Image"
										/>
										<CardContent className={classes.title}>
											<Link href="/herb/[id]" as={"/herb/" + herb.id}>
												<Typography
													gutterBottom
													variant="h5"
													component="h2"
													itemProp="hello"
												>
													{herb.thaiName}
												</Typography>
											</Link>
										</CardContent>
									</CardActionArea>
									<CardActions>
										<Typography
											variant="caption"
											style={{ fontWeight: "bold", float: "left" }}
										>
											โดย:
										</Typography>
										<Typography
											variant="caption"
											style={{ color: "#007FFF", textTransform: "capitalize" }}
										>
											{herb.userDisplayName}
										</Typography>
										<Typography
											variant="caption"
											style={{ fontWeight: "bold", display: "inline" }}
										>
											เมื่อ:
										</Typography>
										<Typography
											variant="caption"
											style={{ color: "#007FFF", textTransform: "capitalize" }}
										>
											{new Date(herb.timestamp.seconds * 1000).toDateString()}
										</Typography>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				</div>
			</Container>
		</div>
	);
}

export default Search;
