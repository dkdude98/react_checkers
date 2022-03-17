/* ----------------------------------------------------------------------------------------------------------------------- */
/*                                                           Game                                                          */
/* ----------------------------------------------------------------------------------------------------------------------- */

// Imports
import { playerPoints } from './CheckBoard';

/* Condition must be met to declare a winner
    Actively looking for number of total pieces captured: 12 captured wins the game
    No possible moves by new player consequently leads to their loss
*/
function IsVictory() {
  if (playerPoints.redPoints == 12) {
    console.log("Red wins");
    return "Red Wins!"
  } else if (playerPoints.whitePoints == 12) {
    return "White Wins!"
  }
  return false;
}

function IsDraw() {
  return false;
}

const Checkers = {

  name: "checkers",

  setup: () => ({
    cells: Array(64).fill(null),
    redPoints: 0,
    whitePoints: 0,
  }),

  moves: {
    clickCell(G, ctx, id) {
      if (G.cells[id] === null) {
        G.cells[id] = ctx.currentPlayer;
      }
    }
  },

  turn: { moveLimit: 1 },

  endIf: (G, ctx) => {
    var isWinner = IsVictory();
    if (isWinner != false) {
      return { winner: isWinner };
    }
  },

  ai: {
    enumerate: G => {
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          moves.push({ move: "clickCell", args: [i] });
        }
      }
      return moves;
    }
  },
};

export default Checkers;