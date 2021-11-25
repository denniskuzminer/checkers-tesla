import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { useHistory } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";
import "../styles/Landing.css";

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: theme.palette.background.default,
    alignItems: "center",
    overflow: "hidden",
  },
  title: { margin: "0 auto", color: theme.palette.piece.black },
  subtitle: {
    margin: "0 auto",
    color: theme.palette.piece.black,
    fontSize: "17px",
  },
  square: { width: 100, height: 100 },
  buttons: {
    display: "flex",
    color: theme.palette.piece.black,
  },
  dividerLeft: {
    borderRight: `6px double ${theme.palette.primary.light}`,
    height: "100vh",
    position: "absolute",
    left: "365px",
    top: "-400px",
  },
});

const Landing = (props) => {
  const { classes } = props;
  let history = useHistory();

  const handleButtonClick = (players) => {
    history.push({
      pathname: "/game",
      state: { players: players === 1 ? 1 : 2 },
    });
  };

  return (
    <div className={classes.root} id="landingContainer">
      <div id="diag1" className={classes.dividerLeft}></div>
      <table>
        <tbody>
          <tr>
            <div id="titleContainer">
              <div id="titleInner">
                <Typography id="title" variant="h1" className={classes.title}>
                  Checkers
                </Typography>
                <Typography
                  id="subtitle"
                  variant="h1"
                  className={classes.subtitle}
                >
                  For Tesla
                </Typography>
              </div>
            </div>
          </tr>
          <tr>
            <div id="buttonContainer">
              <div id="buttonInner">
                <td>
                  <Button
                    id="button1"
                    className={classes.buttons}
                    onClick={() => handleButtonClick(1)}
                    variant="outlined"
                  >
                    <Typography>1 player</Typography>
                  </Button>
                </td>
                <td>
                  <Button
                    id="button2"
                    className={classes.buttons}
                    onClick={() => handleButtonClick(2)}
                  >
                    <Typography>2 player</Typography>
                  </Button>
                </td>
              </div>
            </div>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default withStyles(styles)(Landing);
