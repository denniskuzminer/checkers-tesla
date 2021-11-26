import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { LinearProgress } from "@material-ui/core";
import Square from "./Square";

const styles = (theme) => ({
  square: { width: 100, height: 100 },
  text: { color: "#fff" },
  board: {
    // mozBoxShadow: "0 0 18px #ccc",
    // webkitBoxShadow: "0 0 18px #ccc",
    // boxShadow: "0 0 18px #ccc",
  },
});

const Board = (props) => {
  const [sqNum] = useState(8);
  const [UILoading, setUILoading] = useState(true);
  const [currSquare, setCurrSquare] = useState(
    [...Array(sqNum)].map((x) => [...Array(sqNum)])
  );
  const [board, setBoard] = useState(
    [...Array(sqNum)].map((x) => [...Array(sqNum)])
  );

  const {
    classes,
    whiteMove,
    setWhiteMove,
    captured,
    setCaptured,
    players,
    prevBoards,
    setPrevBoards,
    gameOngoing,
    setResetAsked,
    resetAsked,
  } = props;

  /**
   * useEffect sets up the board on initial render and when a reset is asked
   */
  useEffect(() => {
    let boardIndex = [...Array(sqNum)].map((x) => [...Array(sqNum)]);
    let board = [...Array(sqNum)].map((x) => [...Array(sqNum)]);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        boardIndex[i][j] = i * 8 + j;
        if ((i + j) % 2 === 1 && i * 8 + j <= 23) {
          board[i][j] = "B";
        } else if ((i + j) % 2 === 1 && i * 8 + j >= 40) {
          board[i][j] = "W";
        } else board[i][j] = "E";
      }
    }
    setCurrSquare(boardIndex);
    setBoard(board);
    setUILoading(false);
  }, []);

  useEffect(() => {
    if (resetAsked) {
      let boardIndex = [...Array(sqNum)].map((x) => [...Array(sqNum)]);
      let board = [...Array(sqNum)].map((x) => [...Array(sqNum)]);
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          boardIndex[i][j] = i * 8 + j;
          if ((i + j) % 2 === 1 && i * 8 + j <= 23) {
            board[i][j] = "B";
          } else if ((i + j) % 2 === 1 && i * 8 + j >= 40) {
            board[i][j] = "W";
          } else board[i][j] = "E";
        }
      }
      setCurrSquare(boardIndex);
      setBoard(board);
      setUILoading(false);
      setResetAsked(false);
    }
  }, [resetAsked]);

  if (UILoading) {
    return (
      <div>
        <LinearProgress />
      </div>
    );
  } else {
    return (
      <div id="boardContainer" className={classes.board}>
        <table id="board" border="0" cellSpacing="0" cellPadding="0">
          <tbody>
            {board.map((e, i) => (
              <tr>
                {board.map((e, j) => (
                  <Square
                    i={i}
                    j={j}
                    board={board}
                    setBoard={setBoard}
                    whiteMove={whiteMove}
                    players={players}
                    setWhiteMove={setWhiteMove}
                    captured={captured}
                    setCaptured={setCaptured}
                    prevBoards={prevBoards}
                    gameOngoing={gameOngoing}
                    setPrevBoards={setPrevBoards}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default withStyles(styles)(Board);
