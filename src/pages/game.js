import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { useHistory, useLocation } from "react-router-dom";
import { Typography } from "@material-ui/core";
import theme from "../theme";
import Board from "../components/Board";

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  boardContainer: { marginTop: "50px" },
});

const Game = (props) => {
  const { classes } = props;
  let history = useHistory();
  let location = useLocation();
  let state = location.state;

  const [players] = useState(location.state.players);

  return (
    <div className={classes.root} id="root">
      <div className={classes.boardContainer} id="boardContainer">
        <Board />
        <Typography variant="h2"></Typography>
      </div>
    </div>
  );
};

export default withStyles(styles)(Game);
