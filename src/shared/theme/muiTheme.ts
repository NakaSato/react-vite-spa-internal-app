import { createTheme, ThemeOptions } from "@mui/material/styles";
import { blue, green, orange, red, grey } from "@mui/material/colors";

// Custom color palette based on your solar project theme
const customColors = {
  primary: {
    main: blue[600],
    light: blue[400],
    dark: blue[800],
    contrastText: "#ffffff",
  },
  secondary: {
    main: orange[500],
    light: orange[300],
    dark: orange[700],
    contrastText: "#ffffff",
  },
  success: {
    main: green[600],
    light: green[400],
    dark: green[800],
  },
  error: {
    main: red[600],
    light: red[400],
    dark: red[800],
  },
  warning: {
    main: orange[600],
    light: orange[400],
    dark: orange[800],
  },
  info: {
    main: blue[500],
    light: blue[300],
    dark: blue[700],
  },
  grey: {
    50: grey[50],
    100: grey[100],
    200: grey[200],
    300: grey[300],
    400: grey[400],
    500: grey[500],
    600: grey[600],
    700: grey[700],
    800: grey[800],
    900: grey[900],
  },
};

// Theme configuration
const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    ...customColors,
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: "0.875rem",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
        elevation2: {
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        },
        elevation3: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
};

export const muiTheme = createTheme(themeOptions);

// Dark theme variant
export const darkTheme = createTheme({
  ...themeOptions,
  palette: {
    mode: "dark",
    ...customColors,
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#cbd5e1",
    },
  },
});

export default muiTheme;
