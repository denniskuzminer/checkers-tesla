import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import theme from "../theme";
import { Typography, Box, Avatar } from "@material-ui/core";
import { useDrag, DragPreviewImage } from "react-dnd";
import "../styles/Piece.css";

const styles = (theme) => ({
  white: { backgroundColor: "white", width: 65, height: 65 },
  black: { backgroundColor: "pink", width: 65, height: 65 },
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
    captured,
    setCaptured,
    capturability,
    setCapturability,
  } = props;

  const [showMoves, setShowMoves] = useState(false);
  const [capture, setCapture] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag({
    type: "piece",
    item: { id: `${i}_${j}_${color}`, type: "piece" },
    collect: (monitor) => {
      return { isDragging: !!monitor.isDragging() };
    },
  });

  const isInRange = (num) => {
    return num >= 0 && num <= 7;
  };

  const checkSpace = (iOffSet, jOffSet, color) => {
    return (
      isInRange(i + iOffSet) &&
      isInRange(j + jOffSet) &&
      board[i + jOffSet][j + jOffSet].includes(color)
    );
  };

  const availableMoves = () => {
    let newBoard = Array.from(board);
    let capturability = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (newBoard[i][j].includes("C")) {
          capturability.push(`${i}_${j}_${board[i][j]}`);
        }
      }
    }
    console.log(capturability + " " + `${i}_${j}_${board[i][j]}`);
    // console.log(capturability.includes("B"));
    // Capturing
    if (
      capturability.includes(`${i}_${j}_${board[i][j]}`) ||
      capturability.length === 0 ||
      (capturability.toString().includes("B") &&
        `${i}_${j}_${board[i][j]}`.includes("W")) ||
      (capturability.toString().includes("W") &&
        `${i}_${j}_${board[i][j]}`.includes("B"))
    ) {
      console.log(
        "entered " + capturability + " " + `${i}_${j}_${board[i][j]}`
      );
      setCapture(false);
      if (
        whiteMove &&
        color.includes("WC") &&
        capturability.toString().includes("WC")
      ) {
        // console.log("white can capture");
        if (
          isInRange(i - 1) &&
          isInRange(j + 1) &&
          board[i - 1][j + 1].includes("B")
          // checkSpace(-1,1,"B")
        ) {
          if (
            isInRange(i - 2) &&
            isInRange(j + 2) &&
            board[i - 2][j + 2] === "E"
          ) {
            newBoard[i - 2][j + 2] = "M";
            setBoard(newBoard);
            console.log("white can capture");
            setCapture(true);
            return;
          }
        }
        if (
          isInRange(i - 1) &&
          isInRange(j - 1) &&
          board[i - 1][j - 1].includes("B")
        ) {
          if (
            isInRange(i - 2) &&
            isInRange(j - 2) &&
            board[i - 2][j - 2] === "E"
          ) {
            newBoard[i - 2][j - 2] = "M";
            setBoard(newBoard);
            console.log("white can capture");
            setCapture(true);
            return;
          }
        }
      }
      if (
        whiteMove &&
        color.includes("WKC") &&
        capturability.toString().includes("WKC")
      ) {
        if (
          isInRange(i + 1) &&
          isInRange(j + 1) &&
          board[i + 1][j + 1].includes("B")
        ) {
          if (
            isInRange(i + 2) &&
            isInRange(j + 2) &&
            board[i + 2][j + 2] === "E"
          ) {
            newBoard[i + 2][j + 2] = "M";
            setBoard(newBoard);
            if (
              isInRange(i + 1) &&
              isInRange(j - 1) &&
              board[i + 1][j - 1].includes("B")
            ) {
              if (
                isInRange(i + 2) &&
                isInRange(j - 2) &&
                board[i + 2][j - 2] === "E"
              ) {
                newBoard[i + 2][j - 2] = "M";
                setBoard(newBoard);
                setCapture(true);
              }
            }
          }
        }
        if (
          isInRange(i + 1) &&
          isInRange(j - 1) &&
          board[i + 1][j - 1].includes("B")
        ) {
          if (
            isInRange(i + 2) &&
            isInRange(j - 2) &&
            board[i + 2][j - 2] === "E"
          ) {
            newBoard[i + 2][j + 2] = "M";
            setBoard(newBoard);
            if (
              isInRange(i + 1) &&
              isInRange(j + 1) &&
              board[i + 1][j + 1].includes("B")
            ) {
              if (
                isInRange(i + 2) &&
                isInRange(j + 2) &&
                board[i + 2][j + 2] === "E"
              ) {
                newBoard[i + 2][j - 2] = "M";
                setBoard(newBoard);
                setCapture(true);
              }
            }
          }
        }
        if (capture) {
          console.log("hi");
          return;
        }
      }
      if (
        !whiteMove &&
        color.includes("BC") &&
        capturability.toString().includes("BC")
      ) {
        // console.log("black can capture");
        if (
          isInRange(i + 1) &&
          isInRange(j + 1) &&
          board[i + 1][j + 1].includes("W")
        ) {
          if (
            isInRange(i + 2) &&
            isInRange(j + 2) &&
            board[i + 2][j + 2] === "E"
          ) {
            newBoard[i + 2][j + 2] = "M";
            setBoard(newBoard);
            console.log("black can capture");
            setCapture(true);
            return;
          }
        }
        if (
          isInRange(i + 1) &&
          isInRange(j - 1) &&
          board[i + 1][j - 1].includes("W")
        ) {
          if (
            isInRange(i + 2) &&
            isInRange(j - 2) &&
            board[i + 2][j - 2] === "E"
          ) {
            newBoard[i + 2][j - 2] = "M";
            setBoard(newBoard);
            console.log("black can capture");
            setCapture(true);
            return;
          }
        }
      }
      if (
        whiteMove &&
        color.includes("BKC") &&
        capturability.toString().includes("BKC")
      ) {
        if (
          isInRange(i + 1) &&
          isInRange(j + 1) &&
          board[i + 1][j + 1].includes("W")
        ) {
          if (
            isInRange(i + 2) &&
            isInRange(j + 2) &&
            board[i + 2][j + 2] === "E"
          ) {
            newBoard[i + 2][j + 2] = "M";
            setBoard(newBoard);
            if (
              isInRange(i + 1) &&
              isInRange(j - 1) &&
              board[i + 1][j - 1].includes("W")
            ) {
              if (
                isInRange(i + 2) &&
                isInRange(j - 2) &&
                board[i + 2][j - 2] === "E"
              ) {
                newBoard[i + 2][j - 2] = "M";
                setBoard(newBoard);
                setCapture(true);
                return;
              }
            }
          }
        }
      }
      console.log(capture);
      if (capture) {
        console.log("hi");
        return;
      }
      // Basic Moves
      // console.log("Other moves");
      if (
        whiteMove &&
        color.includes("W") &&
        !capturability.toString().includes("WC")
      ) {
        if (
          isInRange(i - 1) &&
          isInRange(j + 1) &&
          board[i - 1][j + 1] === "E"
        ) {
          newBoard[i - 1][j + 1] = "M";
        }
        if (
          isInRange(i - 1) &&
          isInRange(j - 1) &&
          board[i - 1][j - 1] === "E"
        ) {
          newBoard[i - 1][j - 1] = "M";
        }
      }
      if (
        !whiteMove &&
        color.includes("B") &&
        !capturability.toString().includes("BC")
      ) {
        if (
          isInRange(i + 1) &&
          isInRange(j + 1) &&
          board[i + 1][j + 1] === "E"
        ) {
          newBoard[i + 1][j + 1] = "M";
        }
        if (
          isInRange(i + 1) &&
          isInRange(j - 1) &&
          board[i + 1][j - 1] === "E"
        ) {
          newBoard[i + 1][j - 1] = "M";
        }
      }
      if (
        whiteMove &&
        color.includes("WK") &&
        !capturability.toString().includes("WKC")
      ) {
        if (
          isInRange(i + 1) &&
          isInRange(j + 1) &&
          board[i + 1][j + 1] === "E"
        ) {
          newBoard[i + 1][j + 1] = "M";
        }
        if (
          isInRange(i + 1) &&
          isInRange(j - 1) &&
          board[i + 1][j - 1] === "E"
        ) {
          newBoard[i + 1][j - 1] = "M";
        }
      }
      if (
        !whiteMove &&
        color.includes("BK") &&
        !capturability.toString().includes("BKC")
      ) {
        if (
          isInRange(i - 1) &&
          isInRange(j + 1) &&
          board[i - 1][j + 1] === "E"
        ) {
          newBoard[i - 1][j + 1] = "M";
        }
        if (
          isInRange(i - 1) &&
          isInRange(j - 1) &&
          board[i - 1][j - 1] === "E"
        ) {
          newBoard[i - 1][j - 1] = "M";
        }
      }
    }
    setBoard(newBoard);
  };

  const cleanUp = () => {
    let newBoard = Array.from(board);
    newBoard.forEach((a) => {
      for (let i = 0; i < a.length; i++) {
        a[i] = a[i] === "M" ? "E" : a[i];
        // a[i] = a[i].replace("C", "");
      }
    });
    setBoard(newBoard);
  };

  useEffect(() => {}, []);
  if (color.includes("W") || color.includes("B")) {
    return (
      <div
        className={
          (color.includes("W") && whiteMove) ||
          (color.includes("B") && !whiteMove)
            ? "checker"
            : "doNotMoveChecker"
        }
      >
        <div
          className={classes.pieceContainer}
          ref={drag}
          style={{
            opacity: isDragging ? 0 : 1,
          }}
          onMouseEnter={() => {
            setShowMoves(true);
            availableMoves();
          }}
          onMouseLeave={() => {
            setShowMoves(false);
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
            {color.includes("K") ? "K" : ""}
          </Avatar>
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
