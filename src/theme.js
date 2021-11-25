import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    background: {
      default: "#101420",
    },
    primary: {
      light: "#9e5a63",
      main: "#232163",
      dark: "#314455",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7476",
      main: "#f73c4a",
      dark: "#bd0022",
      contrastText: "#fff",
    },
    piece: {
      white: "#97aabd",
      black: "#c96567",
    },
  },

  typography: {
    fontFamily: ["Montserrat", "regular"].join(","),
  },
});

export default theme;
