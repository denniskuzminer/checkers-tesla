import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import theme from "../theme";
import { Typography, Box, LinearProgress } from "@material-ui/core";
import Piece from "./Piece";
import { useDrop } from "react-dnd";

const styles = (theme) => ({
  square: { width: 100, height: 100 },
  text: { color: "#fff" },
});

const Square = (props) => {
  const [sqNum] = useState(8);
  const [capturability, setCapturability] = useState([]);
  const [, drop] = useDrop({
    accept: "piece",
    drop: (item) => {
      move(item, i, j);
    },
  });
  const {
    classes,
    i,
    j,
    board,
    setBoard,
    whiteMove,
    setWhiteMove,
    captured,
    setCaptured,
  } = props;

  const isInRange = (num) => {
    return num >= 0 && num <= 7;
  };

  const move = (fromItem, toi, toj) => {
    let newBoard = Array.from(board);
    // checkCapturability();
    if (newBoard[toi][toj] === "M") {
      let [fromi, fromj, color] = fromItem.id.split("_");
      fromItem.id = `${toi}_${toj}_${color}`;
      newBoard[fromi][fromj] = "E";
      newBoard[toi][toj] = color;
      if (
        (color.includes("W") && toi === 0) ||
        (color.includes("B") && toi === 7)
      ) {
        newBoard[toi][toj] += "K";
      }
      if (Math.abs(fromi - toi) === 2) {
        newBoard[(Number(fromi) + Number(toi)) / 2][
          (Number(fromj) + Number(toj)) / 2
        ] = "E";
        setCaptured((prev) =>
          whiteMove ? [captured[0] + 1, prev[1]] : [prev[0], captured[1] + 1]
        );
        if (checkNextCapturability(toi, toj, color)) {
          setBoard(newBoard);
          return;
        }
      }
      newBoard.forEach((a) => {
        for (let i = 0; i < a.length; i++) {
          a[i] = a[i] === "M" ? "E" : a[i]; // cleanUp
          a[i] = a[i].replace("C", ""); // cleanUp
        }
      });
      setBoard(newBoard);
      setWhiteMove(!whiteMove);
      checkCapturability();
      // makeNextMove();
    }
  };

  const checkNextCapturability = (i, j, color) => {
    if (color.includes("W")) {
      if (
        isInRange(i - 1) &&
        isInRange(j + 1) &&
        board[i - 1][j + 1].includes("B")
      ) {
        if (
          isInRange(i - 2) &&
          isInRange(j + 2) &&
          board[i - 2][j + 2] === "E"
        ) {
          return true;
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
          return true;
        }
      }
      if (color.includes("K")) {
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
            return true;
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
            return true;
          }
        }
      }
    }
    if (color.includes("B")) {
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
          return true;
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
          return true;
        }
      }
      if (color.includes("K")) {
        if (
          isInRange(i - 1) &&
          isInRange(j + 1) &&
          board[i - 1][j + 1].includes("W")
        ) {
          if (
            isInRange(i - 2) &&
            isInRange(j + 2) &&
            board[i - 2][j + 2] === "E"
          ) {
            return true;
          }
        }
        if (
          isInRange(i - 1) &&
          isInRange(j - 1) &&
          board[i - 1][j - 1].includes("W")
        ) {
          if (
            isInRange(i - 2) &&
            isInRange(j - 2) &&
            board[i - 2][j - 2] === "E"
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const checkCapturability = () => {
    let newBoard = Array.from(board);
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].includes("W")) {
          if (
            isInRange(i - 1) &&
            isInRange(j + 1) &&
            board[i - 1][j + 1].includes("B")
          ) {
            if (
              isInRange(i - 2) &&
              isInRange(j + 2) &&
              board[i - 2][j + 2] === "E"
            ) {
              newBoard[i][j] += "C";
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
              newBoard[i][j] += "C";
            }
          }
          if (board[i][j].includes("K")) {
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
                newBoard[i][j] += "C";
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
                newBoard[i][j] += "C";
              }
            }
          }
        }
        if (board[i][j].includes("B")) {
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
              newBoard[i][j] += "C";
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
              newBoard[i][j] += "C";
            }
          }
          if (board[i][j].includes("K")) {
            if (
              isInRange(i - 1) &&
              isInRange(j + 1) &&
              board[i - 1][j + 1].includes("W")
            ) {
              if (
                isInRange(i - 2) &&
                isInRange(j + 2) &&
                board[i - 2][j + 2] === "E"
              ) {
                newBoard[i][j] += "C";
              }
            }
            if (
              isInRange(i - 1) &&
              isInRange(j - 1) &&
              board[i - 1][j - 1].includes("W")
            ) {
              if (
                isInRange(i - 2) &&
                isInRange(j - 2) &&
                board[i - 2][j - 2] === "E"
              ) {
                newBoard[i][j] += "C";
              }
            }
          }
        }
      }
    }
    setBoard(newBoard);
    console.log(newBoard);
  };

  return (
    <td ref={drop}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor={
          (i + j) % 2 === 0
            ? theme.palette.primary.light
            : theme.palette.primary.dark
        }
        className={classes.square}
      >
        <div>
          <Piece
            board={board}
            setBoard={setBoard}
            color={board[i][j]}
            i={i}
            j={j}
            captured={captured}
            setCaptured={setCaptured}
            capturability={capturability}
            setCapturability={setCapturability}
            whiteMove={whiteMove}
            setWhiteMove={setWhiteMove}
          />
        </div>
      </Box>
    </td>
  );
};

export default withStyles(styles)(Square);
