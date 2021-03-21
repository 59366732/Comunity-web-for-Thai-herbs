import * as React from "react";
import { makeStyles, Slide, Zoom, useScrollTrigger } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	wrapper: {
		width: 100 + theme.spacing(2),
	},
}));

const style = {
	backgroundColor: "primary",
	position: `fixed`,
	bottom: `10px`,
	right: `10px`,
	zIndex: `99`,
};

const BackToTop = ({ children }) => {
    const classes = useStyles();
	const trigger = useScrollTrigger();

	const handleClick = (event) => {
		const anchor = (event.target.ownerDocument || document).querySelector(
			"#back-to-top-anchor"
		);
		if (anchor) {
			anchor.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	return (
		<div className={classes.wrapper}>
			<Slide direction="up" in={trigger} mountOnEnter unmountOnExit>
				<Zoom in={trigger}>
					<div onClick={handleClick} role="presentation" style={style}>
						{children}
					</div>
				</Zoom>
			</Slide>
		</div>
	);
};

export default BackToTop;
