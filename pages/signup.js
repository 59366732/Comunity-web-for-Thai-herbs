import { useState } from "react";
import Link from "next/link";
import {
  auth,
  // signInWithGoogle,
  generateUserDocument,
} from "../firebase/firebase";

import { UserContext } from "../providers/UserProvider";
import { useContext } from "react";
import { useRouter } from "next/router";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Links from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Links color="inherit" href="">
        Community Website for Thai herbs
      </Links>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(0, 0, 2),
  },
}));

const SignUp = () => {
  // const [firstname, setFirstname] = useState("");
  // const [lastname, setLastname] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);

  const user = useContext(UserContext);
  const router = useRouter();

  const createUserWithEmailAndPasswordHandler = async (e, email, password) => {
    e.preventDefault();
    if (password !== confirm) {
      console.log("pass and conf are not the same!!");
      setError('Password and Confirmpassword are not the same!!')
      setPassword("");
      setConfirm("");
      setTimeout(() => {
        setError(null);
      }, 2000);
      return null;
    }
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      generateUserDocument(user, { displayName });
    } catch (error) {
      setError("Error Signing up with email and password");
    }

    setEmail("");
    setPassword("");
    setDisplayName("");
    setConfirm("");
    router.push("/");
  };


  const classes = useStyles();
  return (
    <div>
      <div>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <PersonAddIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            {error !== null && <div>{error}</div>}
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Display Name"
                    autoFocus
                    type="text"
                    name="displayName"
                    value={displayName}
                    placeholder="Enter your display name"
                    id="displayName"
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Email"
                    autoFocus
                    type="text"
                    name="userEmail"
                    value={email}
                    placeholder="example@email.com"
                    id="userEmail"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Password"
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
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Confirm Password"
                    autoFocus
                    type="password"
                    name="confirmPassword"
                    value={confirm}
                    placeholder="Enter your password again"
                    id="confirmPassword"
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="I want to receive herb's information updated news and approve pending via email."
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={(event) => {
                  createUserWithEmailAndPasswordHandler(
                    event,
                    email,
                    password,
                    displayName
                  );
                }}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <p>
                    Already have an account?{" "}
                    <Link href="/signin">
                      <a>Sign in</a>
                    </Link>
                  </p>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default SignUp;
