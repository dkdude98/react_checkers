/* ----------------------------------------------------------------------------------------------------------------------- */
/*                                                          Board                                                          */
/* ----------------------------------------------------------------------------------------------------------------------- */

// Imports
import React from "react";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import './CheckBoard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle } from '@fortawesome/free-regular-svg-icons';
import { } from '@fortawesome/fontawesome-svg-core';
import './GamePiece.css';
import './Game';

// Global variable for player points
const playerPoints = {
  redPoints: 0,
  whitePoints: 0
};
export { playerPoints };

// Board Class
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.ParentCallback = this.ParentCallback.bind(this);
  }

  // Allows us to rerender the Board
  ParentCallback() {
    this.forceUpdate();
  }

  // PropTypes
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool,
  };

  // Render Board as a table. Each space alternates colors appropriately. We can separate a grid into Row components
  render() {
    let tbody = [];
    for (var i = 0; i < 8; i++) {
      let cells = [];
      for (var j = 0; j < 8; j++) {
        var id = 63 - (8 * i + j);
        const altPlaceColor = i % 2 != 0 ? (j % 2 == 0 ? "black" : "#C39B77") : (j % 2 == 0 ? "#C39B77" : "black");
        cells.push(
          <td key={id} style={{ "backgroundColor": altPlaceColor }}>
            <Row details={{ i: i, j: j, id: id, isKing: false, color: altPlaceColor }} ParentCallback={this.ParentCallback} bgio={this.props} />
          </td>
        );
      }
      tbody.push(<tr key={i}>{cells}</tr>);
    }

    // Get winner from Game.js and display here when available
    let winner = null;
    if (this.props.ctx.gameover) {
      winner = this.props.ctx.gameover.winner !== undefined ?
        (<div id="winner">{this.props.ctx.gameover.winner}</div>) : (<div id="winner">Draw!</div>);
    }

    // Render Board, Turn Counter, and Scores
    return (
      <>
        <Box pt={5}>
          <Grid pb={2} container>
            <Grid item xs={8}>
              {winner == null ? <><h2>{this.props.ctx.playOrderPos == 1 ? "Red's" : "White's"} Turn</h2>
                <h3>Total Moves: {this.props.ctx.turn - 1} </h3></> : <h1>{winner}</h1>}
            </Grid>
            <Grid item xs={2}>
              <span style={{ display: "inline-flex" }}><FontAwesomeIcon style={{ fontSize: "2.75ch", color: "rgb(214, 80, 80)" }} icon={faDotCircle}></FontAwesomeIcon><h2>&nbsp;&nbsp;{playerPoints.redPoints}</h2></span>
            </Grid>
            <Grid item xs={2}>
              <span style={{ display: "inline-flex" }}><FontAwesomeIcon style={{ fontSize: "2.75ch", color: "#FFF" }} icon={faDotCircle}></FontAwesomeIcon><h2>&nbsp;&nbsp;{playerPoints.whitePoints}</h2></span>
            </Grid>
          </Grid>

          <table id="board">
            <tbody>{tbody}</tbody>
          </table>

        </Box>
      </>
    );
  }
}

export default Board;

/* ----------------------------------------------------------------------------------------------------------------------- */
/*                                                           Row                                                           */
/* ----------------------------------------------------------------------------------------------------------------------- */

// We will use an array to easily keep track of pieces
const pieces =
[[' ', 'x', ' ', 'x', ' ', 'x', ' ', 'x'],
['x', ' ', 'x', ' ', 'x', ' ', 'x', ' '],
[' ', 'x', ' ', 'x', ' ', 'x', ' ', 'x'],
[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
['o', ' ', 'o', ' ', 'o', ' ', 'o', ' '],
[' ', 'o', ' ', 'o', ' ', 'o', ' ', 'o'],
['o', ' ', 'o', ' ', 'o', ' ', 'o', ' ']];

// Keep track of the currently selected coordinates as well as available moves for the current selection
var currSelected = [];
var currMoves = [];

// Converts a set of coordinates to an index (0-63)
function coordinatesToIndex(x, y) {

  // Coordinates begin at top left of array
  const index = 63 - (8 * x + y);

  // Return index
  return index;
}

// Converts an index to a set of coordinates in the 2D array
function indexToCoordinates(index) {

  // Coordinates begin at top left of array
  const y = (index % 8);
  const x = ((index - y) / 8);

  // Return coordinates object
  return { x: 7 - x, y: 7 - y };
}

/* ----------------------------------------------------------------------------------------------------------------------- */

// Row Class - Constructor holds details of all necessary values 
class Row extends React.Component {
  constructor(props) {
    super(props);
    this.x = props.details.i;
    this.y = props.details.j;
    this.index = props.details.id;
    this.isKing = props.details.isKing;
    this.handleClick = this.handleClick.bind(this);
    this.color = props.details.color;
    this.state = { value: 0 };
  }

  // Keep track of state of the active pieces as well as the positions of all pieces
  state = { isActive: false, pieces: pieces };

  // Function to register initial clicks on the board (no jumps yet!)
  handleClick = () => {

    // Initialize Variables
    var player = null;
    var column = this.y;
    var row = this.x;
    var index = this.index
    currSelected = [column, row];

    // Click For Info
    console.log("Initial spot: " + index);
    console.log("X: " + column);
    console.log("Y: " + row);

    // Mark simply as opposite (like a toggle)
    this.setState({ isActive: !this.state.isActive });

    // Clicking same piece within same turn
    if (this.state.isActive == true) {

      // Hide previously highlighted spots
      var highlighted = document.getElementsByTagName("td");
      for (let i = 0; i < highlighted.length; i++) {
        highlighted[i].className = "click";
      }

      // Set the state to false now
      this.setState({ isActive: false });

    } else {

      // Remove available moves highlighted from previous move
      var highlighted = document.getElementsByTagName("td");
      for (let i = 0; i < highlighted.length; i++) {
        highlighted[i].className = "click";
      }

      var highlightedDiv = document.querySelectorAll("td>div");
      for (let i = 0; i < highlightedDiv.length; i++) {
        for (let j = 0; j < currMoves.length; j++) {
          if (i == currMoves[j] && pieces[indexToCoordinates(i).x][indexToCoordinates(i).y] == ' ') {
            highlightedDiv[63 - i].className = "empty";
          }
        }
      }

      // Get player color
      var converted = indexToCoordinates(index);
      (pieces[converted.x][converted.y] == 'x') ? player = "red" : player = "white";

      // Set clicked piece to active while disabling other active pieces
      var activePieceWhite = document.getElementsByClassName("white-piece");
      var activePieceRed = document.getElementsByClassName("red-piece");

      for (let i = 0; i < activePieceWhite.length; i++) { activePieceWhite[i].className = "white-piece"; }
      for (let i = 0; i < activePieceRed.length; i++) { activePieceRed[i].className = "red-piece"; }

      // Highlight current player pieces
      if (this.props.bgio.ctx.currentPlayer == "0") {
        var disable = document.getElementsByClassName("red-piece");
        var enable = document.getElementsByClassName("white-piece");
        var pieceClass = "red-piece";
        var pieceClassOpp = "white-piece";
      } else {
        var disable = document.getElementsByClassName("white-piece");
        var enable = document.getElementsByClassName("red-piece");
        var pieceClass = "white-piece";
        var pieceClassOpp = "red-piece";
      }

      for (let i = 0; i < disable.length; i++) { disable[i].className = pieceClass + " disable"; }
      for (let i = 0; i < enable.length; i++) { enable[i].className = pieceClassOpp; }

      // Is a King?
      /*if (this.isKing == true) {
        
        // Find appropriate moves
          this.moves = [index - 9, index - 7, index + 9, index + 7];

        // Set all available moves to currMoves variable
        currMoves = this.moves;

      } else {*/

        // Not a King (yet)

        // Red goes opposite direction to black
        var direction = (player == "red") ? -1 : 1;

        // Find appropriate moves
        if (column == 0) {
          this.moves = (player == "red") ? [index + 9 * (direction), null, null, null] : [null, index + 7 * (direction), null, null];
        } else if (column == 7) {
          this.moves = (player == "red") ? [null, index + 7 * (direction), null, null] : [index + 9 * (direction), null, null, null];
        } else { this.moves = [index + 9 * (direction), index + 7 * (direction), null, null]; }

        // Set all available moves to currMoves variable
        currMoves = this.moves;

      // }

      // Highlight available moves
      var elems = document.getElementsByTagName("td");
      for (let i = 0; i < elems.length; i++) {
        for (let j = 0; j < this.moves.length; j++) {
          if (i == this.moves[j]) {
            var converted = indexToCoordinates(this.moves[j]);
            console.log({ x: converted.x, y: converted.y });
            if (pieces[converted.x][converted.y] == ' ') {
              if (player == "red") {
                elems[63 - i].className = "highlight red";
                var elem = elems[63 - i].querySelector("td>*");
                elem.className = "";
              } else {
                elems[63 - i].className = "highlight white";
                var elem = elems[63 - i].querySelector("td>*");
                elem.className = "";
              }

            } else if (pieces[converted.x][converted.y] == 'o') {

              if (player == "red") {
                if (j == 1) {

                  var convertedJump = indexToCoordinates(this.moves[j] - 7);
                  if (pieces[convertedJump.x][convertedJump.y] == ' ') {

                    var capture = document.getElementsByTagName("td");

                    for (let k = 0; k < capture.length; k++) {
                      if (k == (this.moves[j] - 7) && column >= 2) {
                        console.log("Potential jump, RED LEFT: " + j);
                        console.log("Capture 1");
                        capture[63 - k].className = "capture";
                        var elem = capture[63 - k].querySelector("td>*");
                        console.log(elem);
                        elem.className = "";
                        console.log("DONE");
                      }
                    }

                  }

                } else if (j == 0) {
                  var convertedJump = indexToCoordinates(this.moves[j] - 9);
                  if (pieces[convertedJump.x][convertedJump.y] == ' ') {

                    var capture = document.getElementsByTagName("td");
                    console.log(row + " " + column);
                    for (let k = 0; k < capture.length; k++) {
                      if ((k == this.moves[j] - 9) && column <= 5) {
                        console.log("Potential jump, RED RIGHT: " + j);
                        console.log("Capture 2");
                        capture[63 - k].className = "capture";
                        var elem = capture[63 - k].querySelector("td>*");
                        console.log(elem);
                        elem.className = "";
                        console.log("DONE");
                      }
                    }

                  }

                }

              }
          } else if (pieces[converted.x][converted.y] == 'x') {
            if (player == "white") {
                if (j == 1) {
                              try{        
                    var convertedJump = indexToCoordinates(this.moves[j] + 7);
                    if (pieces[convertedJump.x][convertedJump.y] == ' ') {
                    var capture = document.getElementsByTagName("td");

                      for (let k = 0; k < capture.length; k++) {
                        if (k == (this.moves[j] + 7) && column <= 5) {
                          console.log("Potential jump, WHITE RIGHT: " + j);
                          console.log("Capture 1");
                          capture[63 - k].className = "capture";
                          var elem = capture[63 - k].querySelector("td>*");
                          console.log(elem);
                          elem.className = "";
                          console.log("DONE");
                        }
                      }
                    }
                  } catch (e) {
                    console.log("uh oh");
                  }
                
                  } else {
                    var convertedJump = indexToCoordinates(this.moves[j] + 9);
                  if (pieces[convertedJump.x][convertedJump.y] == ' ') {
                      
                      var capture = document.getElementsByTagName("td");

                        for (let k = 0; k < capture.length; k++) {
                          if (k == (this.moves[j] + 9) && column >= 2) {
                            console.log("*************WERE INNNNNNNN*************")
                            console.log("Potential jump, WHITE LEFT: " + j);
                            console.log("Capture 2");
                            capture[63 - k].className = "capture";
                            var elem = capture[63 - k].querySelector("td>*");
                            console.log(elem);
                            elem.className = "";
                            console.log("DONE");
                          }
                        }

                      }
                    }
                  }
            }
          }
        }

        this.setState(pieces);
        this.setState({ value: this.state.value + 1 });
      }
    }
  }

  /* ----------------------------------------------------------------------------------------------------------------------- */

  // Function to register single and multiple space jumps
  jump = () => {

    // Initialize Variables
    var player = null;
    var column = this.y;
    var row = this.x;
    var index = this.index
    var direction = "";

    // Click For Info
    console.log("Initial spot: " + index);
    console.log("X: " + column);
    console.log("Y: " + row);

    // Get player color
    if (pieces[currSelected[1]][currSelected[0]] == 'o') { player = "white"; }
    else { player = "red"; }

    // Move piece in array
    pieces[currSelected[1]][currSelected[0]] = ' ';             // Clear starting position with no piece
    pieces[row][column] = (player == "white") ? 'o' : 'x';      // Add piece to ending position (can be a capture or simple move)

    // Determine if a jump was performed (green "capture" landing spot), we can do this by calculating distance
    var starting = coordinatesToIndex(row, column);
    var ending = coordinatesToIndex(currSelected[1], currSelected[0]);

    // Find whether move was toward left or right side of the board
    if (column < currSelected[0]) { direction = "left" }
    else { direction = "right"; }

    // If the difference in index values is greater than or equal to 14, we jumped a piece

    // Red piece
    if (Math.abs(ending - starting) >= 14 && player == "red") {
      // Left moves
      if (direction == "left") {
        // Add 1 to red points
        playerPoints.redPoints++;
        // Captured piece is found 7 spots after
        var capturedPiece = index + 7;
      }

      // Right moves
      else {
        // Add 1 to red points
        playerPoints.redPoints++;
        // Captured piece is found 9 spots after
        var capturedPiece = index + 9;
      }
    }

    // White piece
    if (Math.abs(ending - starting) >= 14 && player == "white") {
      // Left moves
      if (direction == "left") {
        // Add 1 to white points
        playerPoints.whitePoints++;
        // Captured piece is found 9 spots before
        var capturedPiece = index - 9;
      }

      // Right moves
      else {
        // Add 1 to white points
        playerPoints.whitePoints++;
        // Captured piece is found 7 spots before
        var capturedPiece = index - 7;
      }
    }

    // Remove the piece from the array
    var removePiece = document.getElementsByTagName("td");

    for (let i = 0; i < removePiece.length; i++) {
      if (i == capturedPiece) {
        var capturedPiece = indexToCoordinates(i);
        pieces[capturedPiece.x][capturedPiece.y] = ' ';
      }
    }

    // Remove available moves highlighted from previous move
    var highlighted = document.getElementsByTagName("td");
    for (let i = 0; i < highlighted.length; i++) {
      highlighted[i].className = "click";
    }

    // Set states of pieces and value (this is how we rerender from the child)
    this.setState(pieces);
    this.setState({ value: this.state.value + 1 });
    this.props.bgio.moves.clickCell(index);
    this.props.ParentCallback();

    // Highlight current player pieces
    if (this.props.bgio.ctx.currentPlayer == "1") {
      var disable = document.getElementsByClassName("red-piece");
      var enable = document.getElementsByClassName("white-piece");
      var pieceClass = "red-piece";
      var pieceClassOpp = "white-piece";
    } else {
      var disable = document.getElementsByClassName("white-piece");
      var enable = document.getElementsByClassName("red-piece");
      var pieceClass = "white-piece";
      var pieceClassOpp = "red-piece";
    }

    for (let i = 0; i < disable.length; i++) { disable[i].className = pieceClass + " disable"; }
    for (let i = 0; i < enable.length; i++) { enable[i].className = pieceClassOpp; }

    // Set state to false of initial active piece (we are done using it now)
    this.setState({ isActive: false });

  }

  /* ----------------------------------------------------------------------------------------------------------------------- */

  render() {

    // Use states to render each piece (pieces are colored, disabled, and/or selected)
    // All are disabled by default which helps in switching player turns
    // Spots with no pieces are also rendered appropriately
    // All elements can and will be clicked, need to use onClick handler to appropriately carry out correct functions

    const isActive = this.state.isActive;
    const move = this.props.bgio.ctx.currentPlayer;
    if (pieces[this.x][this.y] == 'x') {
      if (move == "0") {
        return (<div className={isActive ? "red-piece selected" : "red-piece disable"} key={this.index} ><span className="fa-layers fa-fw"><FontAwesomeIcon icon={faDotCircle} onClick={() => this.handleClick()} /></span></div>);
      } else {
        return (<div className={isActive ? "red-piece selected" : "red-piece"} key={this.index} ><span className="fa-layers fa-fw"><FontAwesomeIcon icon={faDotCircle} onClick={() => this.handleClick()} /></span></div>);
      }

    } else if (pieces[this.x][this.y] == 'o') {
      if (move == "1") {
        return (<div className={isActive ? "white-piece selected" : "white-piece disable"} key={this.index} ><span className="fa-layers fa-fw"><FontAwesomeIcon icon={faDotCircle} onClick={() => this.handleClick()} /></span></div>);
      } else {
        return (<div className={isActive ? "white-piece selected" : "white-piece"} key={this.index} ><span className="fa-layers fa-fw"><FontAwesomeIcon icon={faDotCircle} onClick={() => this.handleClick()} /></span></div>);
      }
    } else {
      return (<div className="empty" key={this.index} onClick={() => this.jump(currSelected, currMoves)}>&nbsp;</div>);
    }
  };
}