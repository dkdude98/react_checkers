/* ----------------------------------------------------------------------------------------------------------------------- */
/*                                                        Main Menu                                                       */
/* ----------------------------------------------------------------------------------------------------------------------- */

// Imports
import { Button, Box, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './MainMenu.css';

// Main Menu
function MainMenu() {

// Material UI Theme
const theme = createTheme({
palette: {
    primary: {
        main: '#fff',
        text: '#555',
    },
    secondary: {
        main: '#fff',
    },
},
});

    // Game Instructions
    var instructions = "Instructions: Checkers is a board game played between two people on an 8x8 checked board. Each player has 12 pieces which" + " are placed on every other dark square, then staggered by rows. Each player has different colored pieces, white or red. " +
    "White moves first, then each player takes their turn by moving a single piece. Pieces are moved diagonally in the forward direction (towards the opponent) to the next dark square. You may capture one of the opponent's pieces if it sits next to you and there is an empty space on the other side (There are not multiple jumps per turn in this version!)." +
    "You win the game when the opponent has no more pieces or can't make a move." +
    " Have Fun!";

    // Render Main Menu (Logo, SubLogo, Game Buttons, etc)
    return ( <>
    <ThemeProvider theme={theme}>
    <Box sx={{ backgroundColor: "rgb(145, 57, 57)", borderRadius: "10px" }} mt={3} pb={"0.5rem"} mb={8}>
        <Grid container direction="row" item xs={12} spacing={1} mt={2} p={1.5}>
            <Grid sx={{ padding: 0, margin: "auto" }} item xs={6}>
                
                <Box disableElevation variant="contained" size="medium" fontFamily="teslaregular" textAlign="center"><div id="logo">CHECKERS</div></Box>
                <Box disableElevation variant="contained" size="medium" fontFamily="teslaregular" textAlign="center"><div id="sub-logo">by TESLA</div></Box>

            </Grid>
            <Grid item xs={4}>
            <Button sx={{ width: "100%", marginBottom: "0.5rem" }} className="main-menu-buttons" variant="contained" size="small" onClick={()=>{window.location.reload(false);}}>Start New Game</Button>
            <Button sx={{ width: "100%" }} className="main-menu-buttons" variant="contained" size="small" onClick={() => {alert(instructions)}}>Instructions</Button>
        </Grid>
        <Grid item xs={1}></Grid>
        </Grid>
    </Box>
    </ThemeProvider>
    </>
    );
}

export default MainMenu;