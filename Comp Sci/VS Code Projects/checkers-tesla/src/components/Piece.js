import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import theme from "../theme";
import { Typography, Box, Avatar } from "@material-ui/core";
import { useDrag, DragPreviewImage } from "react-dnd";

// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const styles = (theme) => ({
  white: { backgroundColor: "white" },
  black: { backgroundColor: "pink" },
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
  const { classes, i, j, board, setBoard, color } = props;
  const [{ isDragging }, drag, preview] = useDrag({
    type: "piece",
    item: { id: `${i}_${j}_${color}` },
    collect: (monitor) => {
      return { isDragging: !!monitor.isDragging() };
    },
  });

  useEffect(() => {}, []);
  if (color !== "E") {
    return (
      <>
        <div
          className={classes.pieceContainer}
          ref={drag}
          style={{
            opacity: isDragging ? 0 : 1,
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
      </>
    );
  } else return null;
};

export default withStyles(styles)(Piece);
