/* ----------------------------------------------------------------------------------------------------------------------- */
/*                                                           App                                                           */
/* ----------------------------------------------------------------------------------------------------------------------- */

//Imports
import './App.css';
import React from 'react'
import { Grid, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Client } from "boardgame.io/react";
import Checkers from "./Game";
import Board from "./CheckBoard";
import MainMenu from "./MainMenu"

// BoardGame.IO
export default function App() {
  const Config = Client({
    game: Checkers,
    board: Board,
    debug: false,
  });

  // Material UI Theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFF',
        text: '#555',
      },
      secondary: {
        main: '#FFF',
      },
    },
  });


  // Render Game Menu Below Game Board
  return (
    <Container sx={{ backgroundColor: "rgb(101, 33, 33)", borderRadius:"3%"}} id="main-container">
      <Grid direction="column" sx={{ placeContent: "center" }} container>
        <ThemeProvider theme={theme}>
          <Grid sx={{placeSelf: "center"}} item xs>
              <Config />
          </Grid>
          <Grid item xs>
            <MainMenu />
          </Grid>
        </ThemeProvider>
      </Grid>
    </Container>
  )
}

