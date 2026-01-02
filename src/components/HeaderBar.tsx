import {
  AdminPanelSettings,
  ArrowBack,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "../type";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { ROLE_LABELS, ROLE_ROUTES, ROLE_INITIALS } from "../config/constants";

interface Props {
  user: User | null;
  setUser: (u: User | null) => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}

export default function HeaderBar({ user, setUser, theme, setTheme }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { adminAuthed, logout: adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith(ROLE_ROUTES.ADMIN);
  const backLabel =
    user?.role === "teacher"
      ? ROLE_LABELS.TEACHER
      : user?.role === "student"
        ? ROLE_LABELS.STUDENT
        : ROLE_LABELS.HOME;
  const backTarget =
    user?.role === "teacher"
      ? ROLE_ROUTES.TEACHER
      : user?.role === "student"
        ? ROLE_ROUTES.STUDENT
        : ROLE_ROUTES.HOME;

  const getInitials = (name?: string, role?: string) => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(/\s+/);
      const first = parts[0]?.[0] || "";
      const last =
        parts.length > 1
          ? parts[parts.length - 1]?.[0] || ""
          : parts[0]?.[1] || "";
      const initials = `${first}${last}`.toUpperCase();
      return (
        initials ||
        (role === "teacher" ? ROLE_INITIALS.TEACHER : ROLE_INITIALS.STUDENT)
      );
    }
    return role === "teacher" ? ROLE_INITIALS.TEACHER : ROLE_INITIALS.STUDENT;
  };

  const formatRole = (role?: string) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (adminAuthed) {
      adminLogout();
      if (isAdmin) navigate(ROLE_ROUTES.ADMIN, { replace: true });
    } else {
      setUser(null);
    }
    handleClose();
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <AppBar
      position="fixed"
      color="primary"
      elevation={2}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "primary.main",
        color: "#ffffff",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: "56px", sm: "64px" } }}>
        {/* Logo and Brand */}
        <Box display="flex" alignItems="center" sx={{ flexGrow: 0 }}>
          <img
            src="/logo.svg"
            alt="Assignly"
            style={{ height: 32, marginRight: 12 }}
            onError={(e) => {
              // Fallback if logo doesn't exist
              e.currentTarget.style.display = "none";
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", display: { xs: "none", sm: "block" } }}
          >
            Assignly
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Actions */}
        <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }}>
          {/* Theme Toggle */}
          <IconButton
            onClick={handleThemeToggle}
            color="inherit"
            size="small"
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transform: "rotate(20deg)",
              },
            }}
          >
            {theme === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Admin/Back Navigation */}
          {!adminAuthed &&
            (isAdmin ? (
              <Button
                color="inherit"
                startIcon={<ArrowBack />}
                onClick={() => navigate(backTarget)}
                size="small"
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                {backLabel}
              </Button>
            ) : !user ? (
              <Button
                color="inherit"
                startIcon={<AdminPanelSettings />}
                onClick={() => navigate("/admin")}
                size="small"
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                Admin
              </Button>
            ) : null)}

          {/* User Menu */}
          {(user || adminAuthed) && (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Badge
                  badgeContent={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "20px",
                        height: "20px",
                        borderRadius: "25%",
                        backgroundColor: "secondary.main",
                        color: "secondary.contrastText",
                        fontWeight: "bold",
                        fontSize: "0.7rem",
                        border: "2px solid white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      {adminAuthed ? "A" : user?.role === "teacher" ? "T" : "S"}
                    </Box>
                  }
                  overlap="circular"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {adminAuthed ? "A" : getInitials(user?.name, user?.role)}
                  </Avatar>
                </Badge>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="textSecondary">
                    Role: {adminAuthed ? "Admin" : formatRole(user?.role)}
                  </Typography>
                </MenuItem>
                {!adminAuthed && (
                  <MenuItem disabled>
                    <Typography variant="body2" color="textSecondary">
                      User:{" "}
                      {user?.name
                        ? user.name
                        : user?.rollNumber
                          ? `Roll #${user.rollNumber}`
                          : "User"}
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <Typography>Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
