import React, { useEffect, useState, useRef } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { useHistory, useLocation } from "react-router-dom";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
  AppBar,
  Toolbar,
  Avatar,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import Board from "../components/Board";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: theme.palette.background.default,
    alignItems: "center",
  },
  boardContainer: {
    // marginTop: "50px",
    // border: "5px solid white",
    // borderRadius: "50px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: theme.palette.primary.dark,
  },
  hudContainer: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1.5fr 1fr",
  },
  rightDrawer: {
    position: "absolute",
    right: 0,
    top: 0,
    margin: "100px 10px 0 0",
    width: "350px",
    color: theme.palette.primary.light,
  },
  leftDrawer: {
    position: "absolute",
    left: 0,
    top: 0,
    margin: "100px 0 0 18px",
    width: "350px",
    color: theme.palette.primary.light,
  },
  dividerRight: {
    borderLeft: `6px double ${theme.palette.primary.light}`,
    height: "100vh",
    position: "absolute",
    right: "365px",
    marginRight: "10px",
  },
  dividerLeft: {
    borderRight: `6px double ${theme.palette.primary.light}`,
    height: "100vh",
    position: "absolute",
    left: "365px",
    marginLeft: "10px",
  },
  card: {
    height: "300px",
    color: theme.palette.primary.light,
    backgroundColor: theme.palette.primary.dark,
    margin: "20px 18px 0 0",
  },
  leftCard: {
    height: "400px",
    color: theme.palette.primary.light,
    backgroundColor: theme.palette.primary.dark,
    margin: "20px 10px 0 0",
  },
  red: {
    backgroundColor: theme.palette.piece.black,
    width: 60,
    height: 60,
    display: "flex",
    flexDirection: "column",
    margin: "0 15px 10px 0",
  },
  grey: {
    backgroundColor: theme.palette.piece.white,
    width: 60,
    height: 60,
    display: "flex",
    flexDirection: "column",
    margin: "0 15px 10px 0",
  },
  capturedContainer: {
    float: "left",
    maxWidth: "100%",
    display: "flex",
    flexWrap: "wrap",
  },
  start: {
    color: theme.palette.piece.black,
  },
  back: {
    flex: 1,
    color: theme.palette.piece.black,
  },
  reset: {
    flex: 1,
    color: theme.palette.piece.black,
  },
  link: { textDecoration: "underline", color: "inherit" },
});

const Game = (props) => {
  const { classes } = props;
  const [whiteMove, setWhiteMove] = useState(true);
  const [captured, setCaptured] = useState([0, 0]);
  const [timer, setTimer] = useState(0);
  const [whiteTimer, setWhiteTimer] = useState(-1);
  const [resetAsked, setResetAsked] = useState(0);
  const [blackTimer, setBlackTimer] = useState(0);
  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const increment = useRef(null);
  const [gameOngoing, setGameOngoing] = useState(false);
  let history = useHistory();
  let location = useLocation();
  let state = location.state;
  const [players] = useState(location.state.players);

  const handleStartGame = () => {
    setGameOngoing(true);
    handleStart();
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(true);
    increment.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };
  const handlePause = () => {
    clearInterval(increment.current);
    setIsPaused(false);
  };

  useEffect(() => {
    whiteMove
      ? setWhiteTimer((timer) => timer + 1)
      : setBlackTimer((timer) => timer + 1);
  }, [timer]);

  const handleResume = () => {
    setIsPaused(true);
    increment.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const handleTimeReset = () => {
    clearInterval(increment.current);
    setIsActive(false);
    setIsPaused(false);
    setTimer(0);
  };

  const formatTime = (timer) => {
    const getSeconds = `0${timer % 60}`.slice(-2);
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);
    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  const handleBack = () => {
    history.push({
      pathname: "/",
      state: state,
    });
  };

  const handleReset = () => {
    handleTimeReset();
    setWhiteTimer(-1);
    setBlackTimer(0);
    setResetAsked(true);
    setWhiteMove(true);
    setOpen(false);
    setCaptured([0, 0]);
    setGameOngoing(false);
  };

  useEffect(() => {
    if (captured[0] === 12 || captured[1] === 12) {
      handlePause();
    }
    setOpen(captured[0] === 12 || captured[1] === 12);
  }, [captured]);

  return (
    <div className={classes.root} id="root">
      <AppBar position="absolute">
        <Toolbar className={classes.toolbar}>
          <div>
            {gameOngoing ? (
              <div className={classes.hudContainer}>
                <div>
                  <Typography>
                    {"Grey's time: " + formatTime(whiteTimer)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="h4">{formatTime(timer)}</Typography>
                </div>
                <div>
                  <Typography>
                    {"Red's time: " + formatTime(blackTimer)}
                  </Typography>
                </div>
              </div>
            ) : (
              <Button className={classes.start} onClick={handleStartGame}>
                <Typography variant="h4">Click to Start</Typography>
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.boardContainer} id="boardContainer">
        <Board
          whiteMove={whiteMove}
          setWhiteMove={setWhiteMove}
          players={players}
          captured={captured}
          setCaptured={setCaptured}
          gameOngoing={gameOngoing}
          resetAsked={resetAsked}
          setResetAsked={setResetAsked}
        />
      </div>
      <div className={classes.dividerLeft}></div>
      <div className={classes.leftDrawer}>
        <Typography variant="h4">Tutorial</Typography>
        <Card className={classes.leftCard}>
          <CardHeader title={"If you need a refresher on checkers,"}>
            <Typography variant="h4"></Typography>
          </CardHeader>
          <CardContent className={classes.capturedContainer}>
            <Typography style={{ fontWeight: "900" }}>
              You can find the official rules{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
                href="https://www.officialgamerules.org/checkers"
              >
                here
              </a>
              .
            </Typography>
            <br />
            <br />
            <Typography style={{ fontWeight: "900" }}>
              For this version, all you need to do is click the top to start,
              hover over the pieces, and drag the piece to a possible move,
              which will be shown as a smaller white indicator.
            </Typography>
            <Typography style={{ fontWeight: "900" }}>
              You may also go back to the menu or reset the game.
            </Typography>
            <br />
            <br />
            <br />
            <Button
              style={{ fontWeight: "900" }}
              onClick={handleBack}
              className={classes.back}
            >
              Back
            </Button>
            <Button
              style={{ fontWeight: "900" }}
              onClick={handleReset}
              className={classes.reset}
            >
              Reset
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className={classes.dividerRight}></div>
      <div className={classes.rightDrawer}>
        <Typography style={{ fontWeight: "900" }} variant="h4">
          {whiteMove ? "It's grey's move" : "It's red's move"}
        </Typography>
        <Card className={classes.card}>
          <CardHeader title={"Grey has taken: " + captured[0]}>
            <Typography variant="h4"></Typography>
          </CardHeader>
          <CardContent className={classes.capturedContainer}>
            {[...Array(captured[0])].map((e, i) => (
              <Avatar key={i} className={classes.red} variant="circular">
                <Typography variant="h5">{""}</Typography>
              </Avatar>
            ))}
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardHeader title={"Red has taken: " + captured[1]}>
            <Typography variant="h4"></Typography>
          </CardHeader>
          <CardContent className={classes.capturedContainer}>
            {[...Array(captured[1])].map((e, i) => (
              <Avatar key={i} className={classes.grey} variant="circular">
                <Typography variant="h5">{""}</Typography>
              </Avatar>
            ))}
          </CardContent>
        </Card>
        <Dialog open={open} TransitionComponent={Transition} keepMounted>
          <DialogTitle>
            {captured[0] === 12 ? (
              <div>Grey wins!!!🎉🎉🎉</div>
            ) : captured[1] === 12 ? (
              <div>Red wins!!!🎉🎉🎉</div>
            ) : null}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Yay!!! You can now choose to go back to menu or reset the board
              and play again!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBack} className={classes.back}>
              Back
            </Button>
            <Button onClick={handleReset} className={classes.reset}>
              Reset
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default withStyles(styles)(Game);
