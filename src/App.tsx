import { useEffect, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { Box, Button, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import HeaderBar from "./components/HeaderBar";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { useAuth } from "./hooks/useAuth";
import { useHomeworks } from "./hooks/useHomeworks";
import { useTheme } from "./hooks/useTheme";
import { useMuiTheme } from "./hooks/useMuiTheme";
import { createRoutes } from "./routes";

export default function App() {
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { homeworks, setHomeworks } = useHomeworks();
  const [teacherTab, setTeacherTab] = useState<"dashboard" | "form">(
    "dashboard",
  );
  const { adminAuthed } = useAdminAuth();

  // Create MUI theme based on current theme mode
  const muiTheme = useMuiTheme(theme === "dark");

  // Ensure student always sees dashboard tab
  useEffect(() => {
    if (user?.role === "student") {
      setTeacherTab("dashboard");
    }
  }, [user?.role]);

  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");
  const backLabel =
    user?.role === "teacher"
      ? "Teacher"
      : user?.role === "student"
        ? "Student"
        : "Home";
  const backTarget =
    user?.role === "teacher"
      ? "/teacher"
      : user?.role === "student"
        ? "/student"
        : "/";

  const routing = useRoutes(
    createRoutes({
      user,
      setUser,
      homeworks,
      setHomeworks,
      teacherTab,
      setTeacherTab,
    }),
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
          backgroundColor: "background.default",
          transition: "background-color 0.3s ease",
          overflow: "hidden",
        }}
      >
        <HeaderBar
          user={user}
          setUser={setUser}
          theme={theme}
          setTheme={setTheme}
        />

        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            width: "100%",
            mt: { xs: "56px", sm: "64px" },
            overflow: "auto",
          }}
        >
          {isAdmin && !adminAuthed && (
            <Box sx={{ display: "flex", px: { xs: 1, sm: 2 }, pt: 1, pb: 0 }}>
              <Button
                variant="text"
                onClick={() => navigate(backTarget)}
                sx={{
                  color: "primary.main",
                  textTransform: "none",
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  padding: 0,
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                ← Back to {backLabel}
              </Button>
            </Box>
          )}
          <Box>{routing as unknown as React.ReactNode}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
