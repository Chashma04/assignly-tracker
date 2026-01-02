import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export function useMuiTheme(isDarkMode: boolean) {
  return useMemo(() => {
    return createTheme({
      palette: {
        mode: isDarkMode ? "dark" : "light",
        primary: {
          main: isDarkMode ? "#5c6bc0" : "#3949ab",
          light: isDarkMode ? "#8e99f3" : "#5e7ce2",
          dark: isDarkMode ? "#3f51b5" : "#1a237e",
        },
        secondary: {
          main: "#f57c00",
          light: "#ffb74d",
          dark: "#e65100",
        },
        background: {
          default: isDarkMode ? "#0f172a" : "#f8f9fa",
          paper: isDarkMode ? "#1a2332" : "#ffffff",
        },
        text: {
          primary: isDarkMode ? "#e5e7eb" : "#333333",
          secondary: isDarkMode ? "#cbd5e1" : "#666666",
        },
        divider: isDarkMode ? "#2d3748" : "#e0e0e0",
        action: {
          hover: isDarkMode
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.04)",
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
          fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
          fontWeight: 700,
          lineHeight: 1.2,
        },
        h2: {
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          fontWeight: 700,
          lineHeight: 1.3,
        },
        h3: {
          fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
          fontWeight: 600,
          lineHeight: 1.4,
        },
        h4: {
          fontSize: "clamp(1.1rem, 2.5vw, 1.25rem)",
          fontWeight: 600,
        },
        h5: {
          fontSize: "clamp(1rem, 2vw, 1.1rem)",
          fontWeight: 600,
        },
        body1: {
          fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
          lineHeight: 1.6,
        },
        body2: {
          fontSize: "clamp(0.85rem, 1.2vw, 0.875rem)",
          lineHeight: 1.5,
        },
        button: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              padding: "8px 16px",
              transition: "all 0.3s ease",
            },
            sizeSmall: {
              padding: "4px 12px",
            },
            sizeMedium: {
              padding: "8px 20px",
            },
            sizeLarge: {
              padding: "12px 24px",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: isDarkMode
                ? "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))"
                : "none",
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            colorPrimary: {
              backgroundColor: isDarkMode ? "#5c6bc0" : "#3949ab",
              color: "#ffffff",
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-root": {
                transition: "all 0.3s ease",
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 6,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: isDarkMode
                ? "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))"
                : "none",
            },
          },
        },
      },
    });
  }, [isDarkMode]);
}
