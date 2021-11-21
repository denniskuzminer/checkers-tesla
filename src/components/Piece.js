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
  } = props;
  const [showMoves, setShowMoves] = useState(false);
  const [{ isDragging }, drag, preview] = useDrag({
    type: "piece",
    item: { id: `${i}_${j}_${color}`, type: "piece" },
    collect: (monitor) => {
      return { isDragging: !!monitor.isDragging() };
    },
  });

  const availableMoves = () => {
    let newBoard = Array.from(board);
    // Capturing
    if (whiteMove && color === "W") {
      if (i - 1 >= 0 && j + 1 <= 7 && board[i - 1][j + 1] === "B") {
        if (i - 2 >= 0 && j + 2 <= 7 && board[i - 2][j + 2] === "E") {
          newBoard[i - 2][j + 2] = "M";
          setBoard(newBoard);
          return;
        }
      }
      if (i - 1 >= 0 && j - 1 <= 7 && board[i - 1][j - 1] === "B") {
        if (i - 2 >= 0 && j - 2 <= 7 && board[i - 2][j - 2] === "E") {
          newBoard[i - 2][j - 2] = "M";
          setBoard(newBoard);
          return;
        }
      }
    }
    if (!whiteMove && color === "B") {
      if (i + 1 >= 0 && j + 1 <= 7 && board[i + 1][j + 1] === "W") {
        if (i + 2 >= 0 && j + 2 <= 7 && board[i + 2][j + 2] === "E") {
          newBoard[i + 2][j + 2] = "M";
          setBoard(newBoard);
          return;
        }
      }
      if (i + 1 >= 0 && j - 1 <= 7 && board[i + 1][j - 1] === "W") {
        if (i + 2 >= 0 && j - 2 <= 7 && board[i + 2][j - 2] === "E") {
          newBoard[i + 2][j - 2] = "M";
          setBoard(newBoard);
          return;
        }
      }
    }
    // Basic Moves
    if (whiteMove && color === "W") {
      if (i - 1 >= 0 && j + 1 <= 7 && board[i - 1][j + 1] === "E") {
        newBoard[i - 1][j + 1] = "M";
      }
      if (i - 1 >= 0 && j - 1 <= 7 && board[i - 1][j - 1] === "E") {
        newBoard[i - 1][j - 1] = "M";
      }
    }
    if (!whiteMove && color === "B") {
      if (i + 1 >= 0 && j + 1 <= 7 && board[i + 1][j + 1] === "E") {
        newBoard[i + 1][j + 1] = "M";
      }
      if (i + 1 >= 0 && j - 1 <= 7 && board[i + 1][j - 1] === "E") {
        newBoard[i + 1][j - 1] = "M";
      }
    }
    setBoard(newBoard);
  };

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
  if (color === "W" || color === "B") {
    return (
      <div
        className={
          (color === "W" && whiteMove) || (color === "B" && !whiteMove)
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
              color === "W"
                ? classes.white
                : color === "B"
                ? classes.black
                : null
            }
            variant="circular"
          >
            {""}
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
