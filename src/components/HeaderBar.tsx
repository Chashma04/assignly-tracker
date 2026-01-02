import {
  AdminPanelSettings,
  ArrowBack,
  Brightness4,
  Brightness7
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "../type";

interface Props {
  user: User | null;
  setUser: (u: User | null) => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}

export default function HeaderBar({ user, setUser, theme, setTheme }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const backLabel = user?.role === "teacher" ? "Teacher" : user?.role === "student" ? "Student" : "Home";
  const backTarget = user?.role === "teacher" ? "/teacher" : user?.role === "student" ? "/student" : "/";

  const getInitials = (name?: string, role?: string) => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(/\s+/);
      const first = parts[0]?.[0] || "";
      const last =
        parts.length > 1
          ? parts[parts.length - 1]?.[0] || ""
          : parts[0]?.[1] || "";
      const initials = `${first}${last}`.toUpperCase();
      return initials || (role === "teacher" ? "T" : "S");
    }
    return role === "teacher" ? "T" : "S";
  };

  const formatRole = (role?: string) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  useEffect(() => {
    try {
      setAdminAuthed(localStorage.getItem("assignly_admin_authed") === "1");
    } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === "assignly_admin_authed") {
        setAdminAuthed(e.newValue === "1");
      }
    };
    const onCustom = (e: Event) => {
      const ev = e as CustomEvent;
      if (ev && ev.detail && typeof ev.detail.authed === "boolean") {
        setAdminAuthed(!!ev.detail.authed);
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("assignly:admin-auth", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("assignly:admin-auth", onCustom as EventListener);
    };
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (adminAuthed) {
      try {
        localStorage.removeItem("assignly_admin_authed");
      } catch {}
      try {
        window.dispatchEvent(new CustomEvent("assignly:admin-auth", { detail: { authed: false } }));
      } catch {}
      if (isAdmin) navigate("/admin", { replace: true });
    } else {
      setUser(null);
    }
    handleClose();
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {/* Logo and Brand */}
        <Box display="flex" alignItems="center" sx={{ flexGrow: 0 }}>
          <img
            src="/logo.svg"
            alt="Assignly"
            style={{ height: 32, marginRight: 12 }}
            onError={(e) => {
              // Fallback if logo doesn't exist
              e.currentTarget.style.display = 'none';
            }}
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Assignly
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Actions */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Theme Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={theme === "dark"}
                onChange={handleThemeToggle}
                icon={<Brightness7 />}
                checkedIcon={<Brightness4 />}
              />
            }
            label=""
          />

          {/* Admin/Back Navigation */}
          {!adminAuthed && (
            isAdmin ? (
              <Button
                color="inherit"
                startIcon={<ArrowBack />}
                onClick={() => navigate(backTarget)}
              >
                {backLabel}
              </Button>
            ) : !user ? (
              <Button
                color="inherit"
                startIcon={<AdminPanelSettings />}
                onClick={() => navigate("/admin")}
              >
                Admin
              </Button>
            ) : null
          )}

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
              >
                <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                  {adminAuthed ? "A" : getInitials(user?.name, user?.role)}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
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
                      User: {user?.name
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
