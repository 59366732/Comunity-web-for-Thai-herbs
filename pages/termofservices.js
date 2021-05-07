import React, { Component, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import {
	List,
	ListItem,
	Divider,
	ListItemIcon,
	ListItemText,
	ListItemAvatar,
	makeStyles,
	IconButton,
} from "@material-ui/core/";

const useStyles = makeStyles({
	root: {
		"&:hover": {
			backgroundColor: "transparent",
		},
	},
	icon: {
		borderRadius: 3,
		width: 16,
		height: 16,
		boxShadow:
			"inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
		backgroundColor: "#f5f8fa",
		backgroundImage:
			"linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
		"$root.Mui-focusVisible &": {
			outline: "2px auto rgba(19,124,189,.6)",
			outlineOffset: 2,
		},
		"input:hover ~ &": {
			backgroundColor: "#ebf1f5",
		},
		"input:disabled ~ &": {
			boxShadow: "none",
			background: "rgba(206,217,224,.5)",
		},
	},
	checkedIcon: {
		backgroundColor: "primary",
		backgroundImage:
			"linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
		"&:before": {
			display: "block",
			width: 16,
			height: 16,
			backgroundImage:
				"url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
				" fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
				"1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
			content: '""',
		},
		"input:hover ~ &": {
			backgroundColor: "#106ba3",
		},
	},
});
function StyledCheckbox(props) {
	const classes = useStyles();

	return (
		<Checkbox
			className={classes.root}
			disableRipple
			color="default"
			checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
			icon={<span className={classes.icon} />}
			inputProps={{ "aria-label": "decorative checkbox" }}
			{...props}
		/>
	);
}
function TermOfServices() {
	const classes = useStyles();
	const [black, setBlack] = useState(true);
	const [error, setError] = useState();
	const changeColor = () => {
		setBlack(true);
		setError(null);
	};
	const MyButton = () => {
		return (
			<span>
				{black ? (
					<Button className="blackButton">Click</Button>
				) : (
					<Button className="whiteButton">Clicked</Button>
				)}
			</span>
		);
	};
	return (
		<>
			<div
				style={{
					margin: "auto",
					display: "block",
					width: "fit-content",
				}}
			>
				<Typography variant="h3">
					How to use HeartCheckBox in ReactJS?
				</Typography>
				<Checkbox
					icon={
						<>
							<ThumbUpOutlinedIcon />
							<div>
								<Typography>Like</Typography>
							</div>
						</>
					}
					checkedIcon={
						<>
							<ThumbUpIcon color="primary" />
							<div>
								<Typography color="primary">Liked</Typography>
							</div>
						</>
					}
					name="checkedH"
				/>
				<MyButton />
				<Checkbox />
				<Checkbox
					icon={
						<>
							<FavoriteBorder className={classes.checkbox} />
							<div>
								<Typography className={classes.checkbox}>Like</Typography>
							</div>
						</>
					}
					checkedIcon={
						<>
							<Favorite color="primary" backgroundcolor="transparent" />
							<div>
								<Typography color="primary" backgroundcolor="transparent">
									Liked
								</Typography>
							</div>
						</>
					}
					name="checkedH"
				/>
				<StyledCheckbox/>
			</div>
		</>
	);
}
export default TermOfServices;

// class Test extends React.Component {
// 	constructor() {
// 		super();

// 		this.state = {
// 			black: true, //1
// 			button: true, //2
// 		};
// 		this.handleClick = this.handleClick.bind(this); //2
// 	}

// 	changeColor() {
// 		this.setState({ black: !this.state.black }); //1
// 	}

// 	handleClick() {
// 		this.setState({
// 			button: !this.state.button, //2
// 		});
// 	}

// 	render() {
// 		let btn_class = this.state.black ? "blackButton" : "whiteButton";

// 		return (
// 			<div>
// 				<button className={btn_class} onClick={this.changeColor.bind(this)}>
// 					Button
// 				</button>
// 				<button
// 					className={this.state.button ? "buttonTrue" : "buttonFalse"}
// 					onClick={this.handleClick}
// 				>
// 					Click Me!
// 				</button>
// 			</div>
// 		);
// 	}
// }
// export default Test;
