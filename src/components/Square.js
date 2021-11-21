import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import theme from "../theme";
import { Typography, Box, LinearProgress } from "@material-ui/core";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Piece from "./Piece";
import { useDrop } from "react-dnd";

const styles = (theme) => ({
  square: { width: 100, height: 100 },
  text: { color: "#fff" },
});

const Square = (props) => {
  const [sqNum] = useState(8);
  const [, drop] = useDrop({
    accept: "piece",
    drop: (item) => {
      console.log(item);
      console.log(i * 8 + j);
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

  const move = (fromItem, toi, toj) => {
    let newBoard = Array.from(board);
    if (newBoard[toi][toj] === "M") {
      let [fromi, fromj, color] = fromItem.id.split("_");
      fromItem.id = `${toi}_${toj}_${color}`;
      newBoard[fromi][fromj] = "E";
      newBoard[toi][toj] = color;
      if (Math.abs(fromi - toi) === 2) {
        newBoard[(Number(fromi) + Number(toi)) / 2][
          (Number(fromj) + Number(toj)) / 2
        ] = "E";
        setCaptured((prev) =>
          whiteMove ? [captured[0] + 1, prev[1]] : [prev[0], captured[1] + 1]
        );
      }
      newBoard.forEach((a) => {
        for (let i = 0; i < a.length; i++) {
          a[i] = a[i] === "M" ? "E" : a[i]; // cleanUp
        }
      });
      setBoard(newBoard);
      setWhiteMove(!whiteMove);
    }
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
            whiteMove={whiteMove}
            setWhiteMove={setWhiteMove}
          />
        </div>
      </Box>
    </td>
  );
};

export default withStyles(styles)(Square);
