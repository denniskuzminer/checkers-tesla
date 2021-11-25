import React, { useEffect, useState, useRef } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import theme from "../theme";
import { Box } from "@material-ui/core";
import Piece from "./Piece";
import { useDrop } from "react-dnd";

const styles = (theme) => ({
  square: { width: 100, height: 100 },
  text: { color: "#fff" },
});

const Square = (props) => {
  const [capture, setCapture] = useState(false);
  const [localWhiteMove, setLocalWhiteMove] = useState(true);
  const inputRef = useRef(null);
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
    players,
    gameOngoing,
  } = props;

  const isInRange = (num) => {
    return num >= 0 && num <= 7;
  };

  const move = (fromItem, toi, toj) => {
    let newBoard = Array.from(board);
    if (newBoard[toi][toj] === "M") {
      let [fromi, fromj, color] = fromItem.id.split("_");
      fromItem.id = `${toi}_${toj}_${color}`;
      newBoard[fromi][fromj] = "E";
      newBoard[toi][toj] = color;
      if (
        (color.includes("W") && toi === 0) ||
        (color.includes("B") && toi === 7)
      ) {
        newBoard[toi][toj] += newBoard[toi][toj].includes("K") ? "" : "K";
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
      setWhiteMove((prev) => (prev === whiteMove ? !prev : prev));
      setLocalWhiteMove((prev) => (prev === whiteMove ? !prev : prev));
      checkCapturability();
    }
  };

  useEffect(() => {
    if (players === 1 && false === whiteMove) {
      let nextMoves = makeNextMove();
      let random = Math.floor(Math.random() * nextMoves.length);
      if (whiteMove === false && nextMoves.length > 0) {
        nextMoves.forEach((e, i) => {
          console.log(e[0].id);
          if (e[0].id && e[0].id.includes("C")) {
            random = i;
          }
        });
        // console.log(nextMoves);

        move(nextMoves[random][0], nextMoves[random][1], nextMoves[random][2]);
      }
      // console.log(lastMoveWasCapture);
      // if (
      //   !whiteMove &&
      //   lastMoveWasCapture &&
      //   checkNextCapturability(
      //     nextMoves[random][1],
      //     nextMoves[random][2],
      //     nextMoves[random][0].id.split("_")[2]
      //   )
      // ) {
      //   setLocalWhiteMove(false);
      //   // setWhiteMove(false);
      //   console.log("in a chain");
      //   let nextMoves = makeNextMove();
      //   let random = Math.floor(Math.random() * nextMoves.length);
      //   if (whiteMove === false && nextMoves.length > 0) {
      //     nextMoves.forEach((e, i) => {
      //       if (e[0].id.includes("C")) {
      //         random = i;
      //       }
      //     });
      //     console.log(nextMoves);

      //     move(
      //       nextMoves[random][0],
      //       nextMoves[random][1],
      //       nextMoves[random][2]
      //     );
      //   }
      // }
    }
  }, [localWhiteMove]);

  const makeNextMove = () => {
    const isInRange = (num) => {
      return num >= 0 && num <= 7;
    };
    let nextMoves = [];
    const checkSpace = (i, j, iOffSet, jOffSet, color) => {
      return (
        isInRange(i + iOffSet) &&
        isInRange(j + jOffSet) &&
        board[i + iOffSet][j + jOffSet].indexOf(`${color}`) !== -1
      );
    };

    if (gameOngoing) {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (board[i][j] !== "E" && board[i][j].includes("B")) {
            let color = board[i][j];
            let newBoard = Array.from(board);
            let capturability = [];
            for (let k = 0; k < 8; k++) {
              for (let l = 0; l < 8; l++) {
                if (newBoard[k][l].includes("C")) {
                  capturability.push(`${k}_${l}_${board[k][l]}`);
                }
              }
            }
            // Capturing
            if (
              capturability.includes(`${i}_${j}_${board[i][j]}`) ||
              capturability.length === 0 ||
              (capturability.toString().includes("B") &&
                `${i}_${j}_${board[i][j]}`.includes("W")) ||
              (capturability.toString().includes("W") &&
                `${i}_${j}_${board[i][j]}`.includes("B"))
            ) {
              setCapture(false);

              if (!whiteMove) {
                if (
                  (color.includes("BC") &&
                    capturability.toString().includes("BC")) ||
                  (color.includes("BKC") &&
                    capturability.toString().includes("BKC"))
                ) {
                  if (checkSpace(i, j, 1, 1, "W")) {
                    if (checkSpace(i, j, 2, 2, "E")) {
                      nextMoves.push([
                        { id: `${i}_${j}_${board[i][j]}` },
                        i + 2,
                        j + 2,
                      ]);
                      newBoard[i + 2][j + 2] = "M";
                      setBoard(newBoard);
                      setCapture(true);
                    }
                  }
                  if (checkSpace(i, j, 1, -1, "W")) {
                    if (checkSpace(i, j, 2, -2, "E")) {
                      nextMoves.push([
                        { id: `${i}_${j}_${board[i][j]}` },
                        i + 2,
                        j - 2,
                      ]);
                      newBoard[i + 2][j - 2] = "M";
                      setBoard(newBoard);
                      setCapture(true);
                    }
                  }
                }
                if (
                  color.includes("BKC") &&
                  capturability.toString().includes("BKC")
                ) {
                  if (checkSpace(i, j, -1, -1, "W")) {
                    if (checkSpace(i, j, -2, -2, "E")) {
                      nextMoves.push([
                        { id: `${i}_${j}_${board[i][j]}` },
                        i - 2,
                        j - 2,
                      ]);
                      newBoard[i - 2][j - 2] = "M";
                      setBoard(newBoard);
                      if (checkSpace(i, j, -1, 1, "W")) {
                        if (checkSpace(i, j, -2, 2, "E")) {
                          nextMoves.push([
                            { id: `${i}_${j}_${board[i][j]}` },
                            i - 2,
                            j + 2,
                          ]);
                          newBoard[i - 2][j + 2] = "M";
                          setBoard(newBoard);
                        }
                      }
                      setCapture(true);
                    }
                  }
                  if (checkSpace(i, j, -1, 1, "W")) {
                    if (checkSpace(i, j, -2, 2, "E")) {
                      nextMoves.push([
                        { id: `${i}_${j}_${board[i][j]}` },
                        i - 2,
                        j + 2,
                      ]);
                      newBoard[i - 2][j + 2] = "M";
                      setBoard(newBoard);

                      if (checkSpace(i, j, -1, -1, "W")) {
                        if (checkSpace(i, j, -2, -2, "E")) {
                          nextMoves.push([
                            { id: `${i}_${j}_${board[i][j]}` },
                            i - 2,
                            j - 2,
                          ]);
                          newBoard[i - 2][j - 2] = "M";
                          setBoard(newBoard);
                        }
                      }
                      setCapture(true);
                    }
                  }
                  if (capture) {
                    return newBoard;
                  }
                }
              }
              if (
                !whiteMove &&
                color.includes("B") &&
                !capturability.toString().includes("BC") &&
                !capturability.toString().includes("BKC")
              ) {
                if (
                  checkSpace(i, j, 1, 1, "E") ||
                  checkSpace(i, j, 1, 1, "M")
                ) {
                  nextMoves.push([
                    { id: `${i}_${j}_${board[i][j]}` },
                    i + 1,
                    j + 1,
                  ]);
                  newBoard[i + 1][j + 1] = "M";
                  setBoard(newBoard);
                }
                if (
                  checkSpace(i, j, 1, -1, "E") ||
                  checkSpace(i, j, 1, -1, "M")
                ) {
                  nextMoves.push([
                    { id: `${i}_${j}_${board[i][j]}` },
                    i + 1,
                    j - 1,
                  ]);
                  newBoard[i + 1][j - 1] = "M";
                  setBoard(newBoard);
                }
              }

              if (
                !whiteMove &&
                color.includes("BK") &&
                !capturability.toString().includes("BKC")
              ) {
                if (
                  checkSpace(i, j, -1, 1, "E") ||
                  checkSpace(i, j, -1, 1, "M")
                ) {
                  nextMoves.push([
                    { id: `${i}_${j}_${board[i][j]}` },
                    i - 1,
                    j + 1,
                  ]);
                  newBoard[i - 1][j + 1] = "M";
                  setBoard(newBoard);
                }
                if (
                  checkSpace(i, j, -1, -1, "E") ||
                  checkSpace(i, j, -1, -1, "M")
                ) {
                  nextMoves.push([
                    { id: `${i}_${j}_${board[i][j]}` },
                    i - 1,
                    j - 1,
                  ]);
                  newBoard[i - 1][j - 1] = "M";
                  setBoard(newBoard);
                }
              }
            }
          }
        }
      }
    }
    return nextMoves;
  };

  const checkNextCapturability = (i, j, color) => {
    const checkSpace = (iOffSet, jOffSet, color) => {
      return (
        isInRange(i + iOffSet) &&
        isInRange(j + jOffSet) &&
        board[i + iOffSet][j + jOffSet].indexOf(`${color}`) !== -1
      );
    };
    if (color.includes("W")) {
      if (checkSpace(-1, 1, "B")) if (checkSpace(-2, 2, "E")) return true;

      if (checkSpace(-1, -1, "B")) if (checkSpace(-2, -2, "E")) return true;

      if (color.includes("K")) {
        if (checkSpace(1, 1, "B")) if (checkSpace(2, 2, "E")) return true;

        if (checkSpace(1, -1, "B")) if (checkSpace(2, -2, "E")) return true;
      }
    }
    if (color.includes("B")) {
      if (checkSpace(1, 1, "W")) if (checkSpace(2, 2, "E")) return true;

      if (checkSpace(1, -1, "W")) if (checkSpace(2, -2, "E")) return true;

      if (color.includes("K")) {
        if (checkSpace(-1, 1, "W")) if (checkSpace(-2, 2, "E")) return true;

        if (checkSpace(-1, -1, "W")) if (checkSpace(-2, -2, "E")) return true;
      }
    }
    return false;
  };

  const checkCapturability = () => {
    const checkSpace = (i, j, iOffSet, jOffSet, color) => {
      return (
        isInRange(i + iOffSet) &&
        isInRange(j + jOffSet) &&
        board[i + iOffSet][j + jOffSet].indexOf(`${color}`) !== -1
      );
    };
    let newBoard = Array.from(board);
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].includes("W")) {
          if (checkSpace(i, j, -1, 1, "B"))
            if (checkSpace(i, j, -2, 2, "E")) newBoard[i][j] += "C";

          if (checkSpace(i, j, -1, -1, "B"))
            if (checkSpace(i, j, -2, -2, "E")) newBoard[i][j] += "C";

          if (board[i][j].includes("K")) {
            if (checkSpace(i, j, 1, 1, "B"))
              if (checkSpace(i, j, 2, 2, "E")) newBoard[i][j] += "C";

            if (checkSpace(i, j, 1, -1, "B"))
              if (checkSpace(i, j, 2, -2, "E")) newBoard[i][j] += "C";
          }
        }
        if (board[i][j].includes("B")) {
          if (checkSpace(i, j, 1, 1, "W"))
            if (checkSpace(i, j, 2, 2, "E")) newBoard[i][j] += "C";

          if (checkSpace(i, j, 1, -1, "W"))
            if (checkSpace(i, j, 2, -2, "E")) newBoard[i][j] += "C";

          if (board[i][j].includes("K")) {
            if (checkSpace(i, j, -1, 1, "W"))
              if (checkSpace(i, j, -2, 2, "E")) newBoard[i][j] += "C";

            if (checkSpace(i, j, -1, -1, "W"))
              if (checkSpace(i, j, -2, -2, "E")) newBoard[i][j] += "C";
          }
        }
      }
    }
    setBoard(newBoard);
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
            inputRef={inputRef}
            captured={captured}
            setCaptured={setCaptured}
            capturability={capturability}
            setCapturability={setCapturability}
            whiteMove={whiteMove}
            gameOngoing={gameOngoing}
            setWhiteMove={setWhiteMove}
          />
        </div>
      </Box>
    </td>
  );
};

export default withStyles(styles)(Square);
