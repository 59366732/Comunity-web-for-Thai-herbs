import React from "react";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import {
	InputLabel,
	MenuItem,
	FormControl,
	Select,
	NativeSelect,
	InputBase,
	Typography,
} from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
	margin: {
		margin: theme.spacing(1),
	},
	select: {
		width: "100%",
		minwidth: 200,
	},
}));

export default function CustomizedSelects() {
	const classes = useStyles();
	const [searchOption, setSearchOption] = React.useState("");
	const handleChange = (event) => {
		setSearchOption(event.target.value);
	};
	return (
		<div>
			<FormControl variant="outlined" className={classes.select}>
				<InputLabel id="demo-simple-select-outlined-label">
					ตัวเลือกการค้นหา
				</InputLabel>
				<Select
					fullWidth
					labelId="demo-simple-select-outlined-label"
					id="demo-simple-select-outlined"
					value={searchOption}
					onChange={handleChange}
					label="ตัวเลือกการค้นหา"
				>
					<MenuItem value="">
						<Typography>เลือก</Typography>
					</MenuItem>
					<MenuItem value={"ค้นหาด้วยชื่อภาษาไทย"}>
						ค้นหาด้วยชื่อภาษาไทย
					</MenuItem>
					<MenuItem value={"ค้นหาด้วยชื่อภาษาอังกฤษ"}>
						ค้นหาด้วยชื่อภาษาอังกฤษ
					</MenuItem>
					<MenuItem value={"ค้นหาด้วยชื่อวิทยาศาสตร์"}>
						ค้นหาด้วยชื่อวิทยาศาสตร์
					</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
}
