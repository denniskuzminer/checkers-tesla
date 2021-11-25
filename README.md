# Description and Problem Statement

## This app is allows users to play checkers with 1 and 2 people (locally)

### For the checkers coding challenge, the following requirements were satisfied

- [x] Implemented using React.js.
- [x] Implement basic game mechanics: taking turns, basic moves and jumps over the enemy checkers.
- [x] Players should be able to drag-n-drop checkers using a mouse. Additional ways to control the game are up to you.
- [x] On mouse over checker, please highlight cells where a checker can possibly move to
- [x] If there is an opportunity to capture an enemy checker - it should be the only valid move
- [x] Capture chaining (After a capture, if a piece is able to capture again in the new position, then it must capture again)
- [x] No-brain AI player: could make a move to any random valid cell
- [x] Please draw the board and checkers with DOM/CSS, don’t use images or canvas for that part
- [x] Make sure that the app is stable across major browsers

### The additional recommendations were implemented

- [x] Better game stats UI (game time, number of moves, victory banners etc.)
- [x] King checkers mechanics (when a checker hits the last row and gets an ability to move backwards)

### How to run

- `cd checkers-tesla`
- `npm install`
- `npm start`

### Dependencies

- "react"
- "react-router-dom"
- "react-dnd"
- "react-dnd-html5-backend"
- "@material-ui/core"

### Some notes about the mechanics

- When a piece is kinged, you can only move it on the next turn _even if it can be/is in a capture chain._ (I'm pretty sure that's how checkers works¿?¿?)
- Capture chains do not work for the "AI" in 1 player mode. For the player, it works, but for the "AI," the player actually needs to finish the capture chain by moving for the "AI." The next capture will still be the only possible next move, though.
