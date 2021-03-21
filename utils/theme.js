export default {
	palette: {
		primary: {
			light: "#33c9dc",
			main: "#32CD32",
			dark: "#00C000",
			contrastText: "none",
		},
		secondary: {
			light: "#0000",
			main: "#ff0000",
			dark: "#940000",
			contrastText: "none",
		},
	},
	typography: {
		useNextVariants: true,
		// fontFamily: "Comic Sans MS",
		// body2: {
		// 	fontFamily: "Times New Roman",
		// 	fontSize: "1.1rem",
		// },
		fontFamily: [
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(","),
	},
	spreadIt: {
		form: {
			textAlign: "center",
		},
		image: {
			margin: "1px auto 10px auto",
		},
		pageTitle: {
			margin: "1px auto 5px auto",
		},
		textField: {
			margin: "10px auto 10px auto",
		},
		button: {
			margin: "10px auto 10px auto",
			position: "relative",
		},
		customError: {
			color: "red",
			fontSize: "0.8rem",
			margin: "10px auto 10px auto",
		},
		progress: {
			position: "absolute",
		},
	},
	shape: {
		borderRadius: 20,
	},
	spacing: 8,
	overrides: {
		MuiFilledInput: {
			root: {
				// backgroundColor: "none",
			},
		},
		MuiInputLabel: {
			root: {
				// backgroundColor: "none",
			},
		},
		MuiTextField: {
			root: {
				// backgroundColor: "none",
				fullwidth: true,
			},
		},
		MuiButton: {
			root: {
				textTransform: "none",
				width: "fit-content",
				// padding: "1px 10px 1px 10px",
				textAlign: "center",
			},
			fullWidth: {
				maxwidth: "auto",
			},
		},
		MuiSelect: {
			root: {
				backgroundColor: "none",
			},
		},
	},
	props: {
		MuiButton: {
			disableRipple: true,
			variant: "contained",
			color: "primary",
		},
		MuiCheckbox: {
			disableRipple: true,
		},
		MuiTextField: {
			// fullWidth: {
			// 	width: "auto",
			// 	maxWidth: "100%",
			// },
			variant: "filled",
			inputlabelprops: {
				shrink: true,
			},
		},
		MuiSelect: {
			// fullWidth: {
			// 	width: "auto",
			// 	maxWidth: "100%",
			// },
			variant: "outlined",
			inputlabelprops: {
				shrink: true,
			},
		},
		MuiPaper: {
			elevation: 12,
			// variant: "contained",
		},
		MuiCard: {
			elevation: 12,
			// variant: "contained",
		},
	},
};

//ปรับขนาดตัวหนังสือ
//ปรับช่่องห่างระหว่างบรรทัด
//ปรับพื้นหลัง card ให้ฉูดฉาดน้อยลง
//ปรับข้อมูล user ให้ชิดซ้าย
