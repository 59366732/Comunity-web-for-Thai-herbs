import React from "react";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import { fade, makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import Draggable, { DraggableCore } from "react-draggable";
import Slide from "@material-ui/core/Slide";
import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import {
	Grid,
	AppBar,
	Toolbar,
	Container,
	CssBaseline,
	Box,
	IconButton,
	TexField,
	Typography,
	TextField,
	List,
	ListItem,
} from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
	backButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
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

export default function ConfirmCancel() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const handleClickOpenDialog = () => {
		setOpen(true);
	};

	const handleCloseDialog = () => {
		setOpen(false);
	};
	return (
		<div>
			<Button
				className={classes.backButton}
				onClick={handleClickOpenDialog}
				color="default"
				variant="outlined"
				startIcon={<CancelIcon />}
			>
				<Typography style={{ color: "black" }}>ยกเลิก</Typography>
			</Button>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseDialog}
				PaperComponent={PaperComponent}
				aria-labelledby="draggable-dialog-title"
			>
				<DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
					<Typography>ยืนยันการยกเลิกการแก้ไข</Typography>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<Typography>
							คุณต้องการยกเลิกการตั้งกระทู้ถามใช่หรือไม่?
							คลิก(ใช่)เพื่อยกเลิกการตั้งกระทู้ถาม
							หรือคลิก(ไม่ใช่)เพื่อดำเนินการตั้งกระทู้ถามต่อ.
						</Typography>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={handleCloseDialog} color="default">
						<Typography>ไม่ใช่</Typography>
					</Button>
					<Button autoFocus onClick={handleClose} color="primary">
						<Typography>ใช่</Typography>
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
