import "../styles/globals.css";
import { useContext } from "react";
import UserProvider from "../providers/UserProvider";
import ActivityProvider from "../providers/ActivityProvider";

import themeFile from "../util/theme";
//Mui stuff
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

import "./index";
import Navbar from "../component/navbar";

const theme = createMuiTheme(themeFile);

function MyApp({ Component, pageProps }) {
  return (
    <MuiThemeProvider theme={theme}>
      <UserProvider>
        <ActivityProvider>
          <div className="App">
            <Navbar />
            <div className="container">
              <Component {...pageProps} />
            </div>
          </div>
        </ActivityProvider>
      </UserProvider>
    </MuiThemeProvider>
  );
}

export default MyApp;
