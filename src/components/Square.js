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
  const { classes, i, j, board, setBoard } = props;

  const move = (fromItem, toi, toj) => {
    let [fromi, fromj, color] = fromItem.id.split("_");
    fromItem.id = `${toi}_${toj}_${color}`;
    let newBoard = Array.from(board);
    newBoard[fromi][fromj] = "E";
    newBoard[toi][toj] = color;
    setBoard(newBoard);
    console.log(toi + " " + toj);
    console.log(fromi + " " + fromj);
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
          />
        </div>
      </Box>
    </td>
  );
};

export default withStyles(styles)(Square);
