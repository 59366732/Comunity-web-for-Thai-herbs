import Link from "next/link";
import { auth, firestore, generateUserDocument } from "../../database/firebase";

import { UserContext } from "../../providers/UserProvider";
import { useContext, useState, useEffect } from "react";

import { Home, KeyboardArrowUp } from "@material-ui/icons";
import HideOnScroll from "./components/hideonscroll";
import SideDrawer from "./components/sidedrawer";
import BackToTop from "./components/backtotop";

import PropTypes from "prop-types";
import Skeleton from "@material-ui/lab/Skeleton";

import {
	Avatar,
	Divider,
	Button,
	Box,
	Grid,
	Badge,
	AppBar,
	Container,
	Hidden,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	makeStyles,
	withStyles,
	Toolbar,
	Typography,
} from "@material-ui/core";

import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import Fab from "@material-ui/core/Fab";
import Popover from "@material-ui/core/Popover";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import Slide from "@material-ui/core/Slide";

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
	removeHover: {
		"&:hover": {
			backgroundColor: "transparent",
		},
	},
	root: {
		flexGrow: 1,
		minWidth: "500px",
	},
	grid: {
		flexDirection: "row",
		display: "flex",
		padding: theme.spacing(2),
		textAlign: "center",
		justifyContent: "center",
		justifyItems: "space-around",
	},
	logo: {
		textAlign: "center",
		justifyContent: "center",
	},
	button: {
		textAlign: "flex-start",
		alignitems: "flex-start",
	},
	avatar: {
		width: theme.spacing(4),
		height: theme.spacing(4),
	},
	navbarDisplayFlex: {
		padding: "0 1px 0 1px",
		display: `flex`,
		justifyContent: `space-between`,
		alignItem: "center",
	},
	navListDisplayFlex: {
		padding: "0 1px 0 1px",
		margin: "0 10px 0 10px",
		display: `flex`,
		flexDirection: "row",
		justifyContent: `space-between`,
		alignItem: "center",
	},
	linkText: {
		textDecoration: `none`,
		textTransform: `uppercase`,
		color: `white`,
		textOverflow: "ellipsis",
	},
	typography: {
		padding: theme.spacing(2),
	},
	rootNoti: {
		width: "100%",
		maxWidth: "36ch",
		backgroundColor: theme.palette.background.paper,
	},
	inline: {
		display: "inline",
	},
}));

const ProfileStyledBadge = withStyles((theme) => ({
	badge: {
		backgroundColor: "#44b700",
		color: "#44b700",
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		"&::after": {
			position: "absolute",
			top: -1,
			left: 0,
			width: "100%",
			height: "100%",
			borderRadius: "50%",
			animation: "$ripple 1.0s infinite ease-in-out",
			border: "1px solid currentColor",
			content: '""',
		},
	},
	"@keyframes ripple": {
		"0%": {
			transform: "scale(.8)",
			opacity: 1,
		},
		"100%": {
			transform: "scale(3.0)",
			opacity: 0,
		},
	},
}))(Badge);

const NotiStyledBadge = withStyles((theme) => ({
	badge: {
		right: -3,
		top: 7,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: "0 4px",
	},
}))(Badge);

export default function Navbar(props) {
	const { user, setUser } = useContext(UserContext);
	const [loggedIn, setLoggedIn] = useState(false);
	const { loading = false } = props;

	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [openLogout, setOpenLogout] = React.useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClickOpenLogout = () => {
		setOpenLogout(true);
	};

	const handleCloseLogout = () => {
		setOpenLogout(false);
	};

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	const handleClickPopover = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
	};

	const openNoti = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	const ConfirmLogout = () => {
		return (
			<span>
				<Dialog
					open={openLogout}
					TransitionComponent={Transition}
					keepMounted
					onClose={handleCloseLogout}
					PaperComponent={PaperComponent}
					aria-labelledby="draggable-dialog-title"
				>
					<DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
						<Typography>????????????????????????????????????????????????</Typography>
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							??????????????????????????????<a style={{ color: "red" }}>??????????????????????????????</a>??????????????????????
							????????????(?????????)?????????????????????????????????????????????????????????????????????(??????????????????)???????????????????????????????????????????????????.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button autoFocus onClick={handleCloseLogout} color="default">
							<Typography>??????????????????</Typography>
						</Button>
						<Link href="/">
							<Button
								onClick={() => {
									auth.signOut();
								}}
								color="primary"
							>
								<Typography>?????????</Typography>
							</Button>
						</Link>
					</DialogActions>
				</Dialog>
			</span>
		);
	};

	return (
		<Box width={1}>
			<HideOnScroll>
				<AppBar position="fixed">
					<Toolbar component="nav">
						<Container
							maxWidth="lg"
							minwidth="370px"
							className={classes.navbarDisplayFlex}
						>
							<IconButton
								edge="start"
								aria-label="home"
								href="/"
								style={{
									margin: "0 0 0 0",
									color: `white`,
									fontSize: "200%",
								}}
								className={classes.removeHover}
							>
								?????????????????????????????????????????????????????????
							</IconButton>

							<Hidden smDown>
								<List
									className="navbar-container"
									component="nav"
									aria-labelledby="main navigation"
									className={classes.navListDisplayFlex}
								>
									<Link href="/">
										<IconButton
											style={{ color: `white` }}
											className={classes.removeHover}
										>
											<Typography>?????????????????????</Typography>
										</IconButton>
									</Link>
									<Link href="/search">
										<IconButton
											style={{ color: `white` }}
											className={classes.removeHover}
										>
											<Typography>???????????????</Typography>
										</IconButton>
									</Link>
									<Link href="/QnA">
										<IconButton
											style={{ color: `white` }}
											className={classes.removeHover}
										>
											<Typography>?????????-?????????</Typography>
										</IconButton>
									</Link>
									{!loggedIn ? (
										<>
											<Link href="/signup">
												<IconButton
													style={{ color: `white` }}
													className={classes.removeHover}
												>
													<Typography>?????????????????????????????????</Typography>
												</IconButton>
											</Link>
											<Link href="/signin">
												<IconButton
													style={{ color: `white` }}
													className={classes.removeHover}
												>
													<Typography>?????????????????????????????????</Typography>
												</IconButton>
											</Link>
										</>
									) : (
										<>
											<Link href="/profilepage">
												<IconButton
													style={{ color: `white` }}
													className={classes.removeHover}
												>
													<ProfileStyledBadge
														overlap="circle"
														anchorOrigin={{
															vertical: "bottom",
															horizontal: "right",
														}}
														variant="dot"
													>
														<Avatar
															className={classes.avatar}
															src={
																user.photoURL ||
																"https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
															}
															alt=""
														/>
													</ProfileStyledBadge>
													{loading ? (
														<Skeleton variant="text" />
													) : (
														<Typography
															style={{
																color: "white",
																textTransform: "capitalize",
																paddingLeft: "5px",
															}}
														>
															{user.displayName}
														</Typography>
													)}
												</IconButton>
											</Link>
											<React.Fragment>
												<IconButton
													aria-label="cart"
													onClick={handleClickPopover}
													className={classes.removeHover}
												>
													<NotiStyledBadge
														badgeContent={
															<Typography
																variant="caption"
																style={{ color: "white" }}
															>
																0
															</Typography>
														}
														color="secondary"
													>
														<NotificationsNoneIcon style={{ color: `white` }} />
													</NotiStyledBadge>
												</IconButton>
												<Popover
													id={id}
													open={openNoti}
													anchorEl={anchorEl}
													onClose={handleClosePopover}
													anchorOrigin={{
														vertical: "bottom",
														horizontal: "left",
													}}
													transformOrigin={{
														vertical: "top",
														horizontal: "right",
													}}
												>
													<List className={classes.root}>
														<ListItem alignItems="flex-start">
															<ListItemAvatar>
																<Avatar alt="Remy Sharp" />
															</ListItemAvatar>
															<ListItemText
																primary="Let's enjoy."
																secondary={
																	<React.Fragment>
																		<Link href="/termofservices">
																			<a>
																				<Typography
																					component="span"
																					variant="body2"
																					className={classes.inline}
																					color="textPrimary"
																				>
																					Term of service
																				</Typography>
																			</a>
																		</Link>
																		{
																			" ??? I'll be take you to our term of service page."
																		}
																	</React.Fragment>
																}
															/>
														</ListItem>
													</List>
												</Popover>
											</React.Fragment>
											<IconButton
												onClick={handleClickOpenLogout}
												style={{ color: `red` }}
												className={classes.removeHover}
											>
												<Typography>??????????????????????????????</Typography>
											</IconButton>
											<ConfirmLogout />
										</>
									)}
								</List>
							</Hidden>
							<Hidden mdUp>
								<SideDrawer />
							</Hidden>
						</Container>
					</Toolbar>
				</AppBar>
			</HideOnScroll>
			<Toolbar id="back-to-top-anchor" />
			<BackToTop>
				<Fab color="secondary" size="large" aria-label="scroll back to top">
					<KeyboardArrowUp />
				</Fab>
			</BackToTop>
		</Box>
	);
}
