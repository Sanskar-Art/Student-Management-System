import { createTheme } from "@mui/material/styles";

// Palette — "academic registrar" direction: ink navy + parchment + ledger
// green, with warm amber reserved for grade/status accents.
const inkNavy = "#1C2541";
const parchment = "#FAF7F0";
const ledgerGreen = "#2F6F5E";
const amber = "#C97B2E";
const slate = "#6B7280";
const hairline = "#E4DFD3";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: ledgerGreen, contrastText: "#FFFFFF" },
    secondary: { main: amber, contrastText: "#FFFFFF" },
    background: { default: parchment, paper: "#FFFFFF" },
    text: { primary: inkNavy, secondary: slate },
    divider: hairline,
    error: { main: "#B3432B" },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", serif', fontWeight: 600, letterSpacing: "-0.01em" },
    h5: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h6: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6 },
        contained: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(47, 111, 94, 0.06)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: inkNavy,
          borderBottom: `2px solid ${inkNavy}`,
        },
      },
    },
  },
});

export const tokens = { inkNavy, parchment, ledgerGreen, amber, slate, hairline };
export default theme;
