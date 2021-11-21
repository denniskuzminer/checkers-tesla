import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import theme from "../theme";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Typography } from "@material-ui/core";

const styles = (theme) => ({ square: { width: 100, height: 100 } });

const Landing = (props) => {
  const { classes } = props;
  let history = useHistory();
  let location = useLocation();
  let state = location.state;

  const [players, setPlayers] = useState(0);

  const handleButtonClick = (players) => {
    setPlayers(players);
    history.push({
      pathname: "/game",
      state: { players: players === 1 ? 1 : 2 },
    });
  };

  return (
    <div id="landingContainer">
      <Button onClick={() => handleButtonClick(1)} variant="outlined">
        <Typography>1 player</Typography>
      </Button>
      <Button onClick={() => handleButtonClick(2)} variant="outlined">
        <Typography>2 player</Typography>
      </Button>
    </div>
  );
};

export default withStyles(styles)(Landing);
