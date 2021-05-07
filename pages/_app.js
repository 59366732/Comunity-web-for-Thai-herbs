import "../styles/globals.css";
import "../styles/profile_demo.css";
import { useContext } from "react";
import UserProvider from "../providers/UserProvider";
import ActivityProvider from "../providers/ActivityProvider";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import themeFile from "../utils/theme";
//Mui stuff
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

import "./index";
import Navbar from "../component/Appbar";
import Header from "../component/customs/components/header";

const theme = createMuiTheme(themeFile);

function MyApp({ Component, pageProps }) {
	// React.useEffect(() => {
	// 	// Remove the server-side injected CSS.
	// 	const jssStyles = document.querySelector("#jss-server-side");
	// 	if (jssStyles) {
	// 		jssStyles.parentElement.removeChild(jssStyles);
	// 	}
	// }, []);
	return (
		<React.Fragment>
			{/* <Header /> */}
			<CssBaseline />
			<MuiThemeProvider theme={theme}>
				<UserProvider>
					<ActivityProvider>
						<div className="App">
							<Navbar />
							{/* maxwidth="xl" minwidth="xl" */}
							<Container >
								<div className="container">
									<Component {...pageProps} />
								</div>
							</Container>
						</div>
					</ActivityProvider>
				</UserProvider>
			</MuiThemeProvider>
		</React.Fragment>
	);
}

export default MyApp;
