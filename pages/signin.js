// @ts-nocheck
import { useState } from "react";
import db, { auth } from "../database/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { UserContext } from "../providers/UserProvider";
import { useContext } from "react";

//import {signInWithGoogle} from "../firebase/firebase"
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { makeStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab/";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

// Firebase.
import firebase from "firebase/app";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(4),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const SignIn = () => {
	const [fullWidth, setFullWidth] = React.useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	// const user = useContext(UserContext);

	auth.onAuthStateChanged((user) => {
		if (user) {
			db.collection("users")
				.doc(user.uid)
				.get()
				.then((result) => {
					if (result.data().score < 10) {
						db.collection("users").doc(user.uid).update({ level: "visitor" });
					} else if (
						result.data().score >= 10 &&
						result.data().score < 60 &&
						result.data().addHerb == true
					) {
						db.collection("users").doc(user.uid).update({ level: "user" });
					} else if (
						result.data().score >= 60 &&
						result.data().score < 100 &&
						result.data().addHerb == true
					) {
						db.collection("users")
							.doc(user.uid)
							.update({ level: "known user" });
					} else if (
						result.data().score >= 300 &&
						result.data().addHerb == true
					) {
						db.collection("users")
							.doc(user.uid)
							.update({ level: "trust user" });
					}
				});
			setTimeout(() => {
				window.location.href = "/";
			}, 800);
		} else {
		}
	});
	const signin_failed_alert = () => {
		return (
			<span>
				<Alert severity="error">
					<AlertTitle>Error</AlertTitle>
					Error signing in with password and email —{" "}
					<strong>check it out!</strong>
				</Alert>
			</span>
		);
	};

	const signin_failed = (
		<span>
			<Alert severity="warning">
				<Typography>อีเมลหรือรหัสผ่านไม่ถูกต้อง!!!</Typography>
			</Alert>
		</span>
	);
	const signInWithEmailAndPasswordHandler = (e, email, password) => {
		e.preventDefault();
		auth.signInWithEmailAndPassword(email, password).catch((error) => {
			setError(signin_failed);
			setTimeout(() => {
				setError(null);
			}, 2000);
			console.error(signin_failed_alert, error);
		});
	};

	const uiConfig = {
		// Popup signin flow rather than redirect flow.
		signInFlow: "popup",
		// We will display Google , Facebook , Etc as auth providers.
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.FacebookAuthProvider.PROVIDER_ID,
		],
		callbacks: {
			// Avoid redirects after sign-in.
			signInSuccess: () => false,
		},
	};

	const classes = useStyles();
	return (
		<div>
			<div className="container">
				<Container component="main" maxWidth="sm">
					<CssBaseline />
					<div className={classes.paper}>
						<Avatar className={classes.avatar}>
							<LockOpenIcon />
						</Avatar>
						<Typography component="h1" variant="h5" align="center">
							เข้าสู่ระบบ
						</Typography>
						{error !== null && <div>{error}</div>}
						<form className={classes.form} noValidate>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										alignitems="center"
										label="อีเมล"
										fullWidth
										autoFocus
										type="text"
										name="userEmail"
										value={email}
										placeholder="Enter your email"
										id="userEmail"
										onChange={(e) => setEmail(e.target.value)}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										alignitems="center"
										label="รหัสผ่าน"
										fullWidth
										autoFocus
										type="password"
										name="userPassword"
										value={password}
										placeholder="Enter your password"
										id="userPassword"
										onChange={(e) => setPassword(e.target.value)}
									/>
								</Grid>
								<Grid item xs={12}>
									<Button
										type="submit"
										fullWidth
										color="primary"
										alignitems="center"
										onClick={(event) => {
											signInWithEmailAndPasswordHandler(event, email, password);
										}}
									>
										<Typography>ลงชื่อ</Typography>
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Typography variant="caption">
										ยังไม่มีบัญชีใช่ไหม? สามารถลงทะเบียนได้&ensp;
										<Link href="/signup">
											<a>
												<Typography
													variant="caption"
													style={{
														color: "#007FFF",
														textDecoration: "underline",
													}}
												>
													ที่นี่!
												</Typography>
											</a>
										</Link>
									</Typography>
								</Grid>
							</Grid>
						</form>
					</div>
					<br />
					<br />
					<Grid
						item
						xs={12}
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItem: "center",
						}}
					>
						<Typography style={{ textAlign: "center", fontWeight: "bold" }}>
							หรือ
						</Typography>
					</Grid>
				</Container>
				<StyledFirebaseAuth
					uiConfig={uiConfig}
					firebaseAuth={firebase.auth()}
				/>
			</div>
		</div>
	);
};

export default SignIn;
