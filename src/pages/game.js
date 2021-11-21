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
  const [whiteMove, setWhiteMove] = useState(true);
  const [captured, setCaptured] = useState([0, 0]);
  let history = useHistory();
  let location = useLocation();
  let state = location.state;

  const [players] = useState(location.state.players);

  return (
    <div className={classes.root} id="root">
      <div className={classes.boardContainer} id="boardContainer">
        <Board
          whiteMove={whiteMove}
          setWhiteMove={setWhiteMove}
          captured={captured}
          setCaptured={setCaptured}
        />
        <Typography variant="h2">
          {whiteMove ? "It's white's move" : "It's black's move"}
        </Typography>
        <Typography variant="h2">
          {"White has taken: " + captured[0]}
        </Typography>
        <Typography variant="h2">
          {"Black has taken: " + captured[1]}
        </Typography>
      </div>
    </div>
  );
};

export default withStyles(styles)(Game);
