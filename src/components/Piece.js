import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Typography, Avatar } from "@material-ui/core";
import { useDrag } from "react-dnd";
import "../styles/Piece.css";

const styles = (theme) => ({
  white: {
    backgroundColor: theme.palette.piece.white,
    width: 65,
    height: 65,
  },
  black: { backgroundColor: theme.palette.piece.black, width: 65, height: 65 },
  possibleMove: { backgroundColor: "yellow", width: 30, height: 30 },
  pieceContainer: {
    cursor: "grab",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Piece = (props) => {
  const {
    classes,
    i,
    j,
    board,
    setBoard,
    color,
    whiteMove,
    inputRef,
    gameOngoing,
  } = props;

  const [capture, setCapture] = useState(false);
  // ids of checkers have the indices (i, j) and their color/if they are kings/if they can capture (color)
  const [{ isDragging }, drag] = useDrag({
    type: "piece",
    item: { id: `${i}_${j}_${color}`, type: "piece" },
    collect: (monitor) => {
      return { isDragging: !!monitor.isDragging() };
    },
  });

  /**
   * Helper function to stop index out of bounds
   * @param {Number} num
   */
  const isInRange = (num) => {
    return num >= 0 && num <= 7;
  };

  /**
   * This is to check if a space contains a certain color
   * @param {Number} iOffSet
   * @param {Number} jOffSet
   * @param {String} color
   */
  const checkSpace = (iOffSet, jOffSet, color) => {
    return (
      isInRange(i + iOffSet) &&
      isInRange(j + jOffSet) &&
      board[i + iOffSet][j + jOffSet].indexOf(`${color}`) !== -1
    );
  };

  /**
   * On hover, shows the available moves for a given checker.
   * Then, display it by changing an empty square to have the move marker "M"
   * @param {Number} i
   * @param {Number} j
   * @param {Array} board
   * @param {String} color
   */
  const availableMoves = (
    i = props.i,
    j = props.j,
    board = props.board,
    color = props.color
  ) => {
    if (gameOngoing) {
      let newBoard = Array.from(board);
      let capturability = [];
      // 1. Check which pieces can capture
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (newBoard[i][j].includes("C")) {
            capturability.push(`${i}_${j}_${board[i][j]}`);
          }
        }
      }
      // 2. Block other moves if there exists a piece that can be captured
      if (
        capturability.includes(`${i}_${j}_${board[i][j]}`) ||
        capturability.length === 0 ||
        (capturability.toString().includes("B") &&
          `${i}_${j}_${board[i][j]}`.includes("W")) ||
        (capturability.toString().includes("W") &&
          `${i}_${j}_${board[i][j]}`.includes("B"))
      ) {
        setCapture(false);
        // 3.1. Check if white can capture forward
        if (whiteMove) {
          if (
            (color.includes("WC") && capturability.toString().includes("WC")) ||
            (color.includes("WKC") && capturability.toString().includes("WKC"))
          ) {
            if (checkSpace(-1, 1, "B")) {
              if (checkSpace(-2, 2, "E")) {
                newBoard[i - 2][j + 2] = "M";
                setBoard(newBoard);
                setCapture(true);
              }
            }
            if (checkSpace(-1, -1, "B")) {
              if (checkSpace(-2, -2, "E")) {
                newBoard[i - 2][j - 2] = "M";
                setBoard(newBoard);
                setCapture(true);
              }
            }
          }
          // 3.2. Check if white can capture backward for kings
          if (
            color.includes("WKC") &&
            capturability.toString().includes("WKC")
          ) {
            if (checkSpace(1, 1, "B")) {
              if (checkSpace(2, 2, "E")) {
                newBoard[i + 2][j + 2] = "M";
                if (checkSpace(1, -1, "B")) {
                  if (checkSpace(2, -2, "E")) {
                    newBoard[i + 2][j - 2] = "M";
                  }
                }
                setBoard(newBoard);
                setCapture(true);
              }
            }
            if (checkSpace(1, -1, "B")) {
              if (checkSpace(2, -2, "E")) {
                newBoard[i + 2][j - 2] = "M";
                if (checkSpace(1, 1, "B")) {
                  if (checkSpace(2, 2, "E")) {
                    newBoard[i + 2][j + 2] = "M";
                  }
                }
                setBoard(newBoard);
                setCapture(true);
              }
            }
            // 3.3. Block everything else
            if (capture) {
              return;
            }
          }
        }
        // 4.1. Check if black can capture forward
        if (!whiteMove) {
          if (
            (color.includes("BC") && capturability.toString().includes("BC")) ||
            (color.includes("BKC") && capturability.toString().includes("BKC"))
          ) {
            if (checkSpace(1, 1, "W")) {
              if (checkSpace(2, 2, "E")) {
                newBoard[i + 2][j + 2] = "M";
                setBoard(newBoard);
                setCapture(true);
              }
            }
            if (checkSpace(1, -1, "W")) {
              if (checkSpace(2, -2, "E")) {
                newBoard[i + 2][j - 2] = "M";
                setBoard(newBoard);
                setCapture(true);
              }
            }
          }
          // 4.2. Check if black can capture backward for kings
          if (
            color.includes("BKC") &&
            capturability.toString().includes("BKC")
          ) {
            if (checkSpace(-1, -1, "W")) {
              if (checkSpace(-2, -2, "E")) {
                newBoard[i - 2][j - 2] = "M";
                if (checkSpace(-1, 1, "W")) {
                  if (checkSpace(-2, 2, "E")) {
                    newBoard[i - 2][j + 2] = "M";
                  }
                }
                setBoard(newBoard);
                setCapture(true);
              }
            }
            if (checkSpace(-1, 1, "W")) {
              if (checkSpace(-2, 2, "E")) {
                newBoard[i - 2][j + 2] = "M";
                if (checkSpace(-1, -1, "W")) {
                  if (checkSpace(-2, -2, "E")) {
                    newBoard[i - 2][j - 2] = "M";
                  }
                }
                setBoard(newBoard);
                setCapture(true);
              }
            }
            // 4.3. Block everything else
            if (capture) {
              return;
            }
          }
        }
        // Basic Moves
        if (
          whiteMove &&
          color.includes("W") &&
          !capturability.toString().includes("WC") &&
          !capturability.toString().includes("WKC")
        ) {
          // 5.1. See if white can make a regular forward move
          if (checkSpace(-1, 1, "E")) {
            newBoard[i - 1][j + 1] = "M";
          }
          if (checkSpace(-1, -1, "E")) {
            newBoard[i - 1][j - 1] = "M";
          }
        }
        if (
          !whiteMove &&
          color.includes("B") &&
          !capturability.toString().includes("BC") &&
          !capturability.toString().includes("BKC")
        ) {
          // 5.2. See if black can make a regular forward move
          if (checkSpace(1, 1, "E")) {
            newBoard[i + 1][j + 1] = "M";
          }
          if (checkSpace(1, -1, "E")) {
            newBoard[i + 1][j - 1] = "M";
          }
        }
        if (
          whiteMove &&
          color.includes("WK") &&
          !capturability.toString().includes("WKC")
        ) {
          // 6.1. See if a white king can make a regular backward move
          if (checkSpace(1, 1, "E")) {
            newBoard[i + 1][j + 1] = "M";
          }
          if (checkSpace(1, -1, "E")) {
            newBoard[i + 1][j - 1] = "M";
          }
        }
        if (
          !whiteMove &&
          color.includes("BK") &&
          !capturability.toString().includes("BKC")
        ) {
          // 6.2. See if a black king can make a regular backward move
          if (checkSpace(-1, 1, "E")) {
            newBoard[i - 1][j + 1] = "M";
          }
          if (checkSpace(-1, -1, "E")) {
            newBoard[i - 1][j - 1] = "M";
          }
        }
      }
      setBoard(newBoard);
    }
  };

  /**
   * Get rid of all M's. At the end of the move function in Square, clean up for remaining M's and C's is also run
   */
  const cleanUp = () => {
    let newBoard = Array.from(board);
    newBoard.forEach((a) => {
      for (let i = 0; i < a.length; i++) {
        a[i] = a[i] === "M" ? "E" : a[i];
      }
    });
    setBoard(newBoard);
  };

  useEffect(() => {}, []);
  if (color.includes("W") || color.includes("B")) {
    return (
      <div
        className={
          (color.includes("W") && gameOngoing && whiteMove) ||
          (color.includes("B") && !whiteMove)
            ? "checker"
            : "doNotMoveChecker"
        }
      >
        <div ref={inputRef}>
          <div
            className={classes.pieceContainer}
            ref={drag}
            style={{
              opacity: isDragging ? 0 : 1,
            }}
            onMouseEnter={() => {
              availableMoves();
            }}
            onMouseLeave={() => {
              cleanUp();
            }}
          >
            <Avatar
              className={
                color.includes("W")
                  ? classes.white
                  : color.includes("B")
                  ? classes.black
                  : null
              }
              variant="circular"
            >
              <Typography variant="h5">
                {color.includes("K") ? "K" : ""}
              </Typography>
            </Avatar>
          </div>
        </div>
      </div>
    );
  } else {
    if (color === "M") {
      return <div className="move"></div>;
    } else {
      return null;
    }
  }
};

export default withStyles(styles)(Piece);
