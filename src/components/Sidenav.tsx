import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Dashboard, Assignment } from "@mui/icons-material";
import type { Role } from "../type";

interface Props {
  role: Role;
  selected: "dashboard" | "form";
  onSelect: (tab: "dashboard" | "form") => void;
}

export default function Sidenav({ role, selected, onSelect }: Props) {
  const isTeacher = role === "teacher";

  const menuItems: Array<{
    key: "dashboard" | "form";
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <Dashboard />,
    },
    ...(isTeacher
      ? [
          {
            key: "form" as const,
            label: "Post Homework",
            icon: <Assignment />,
          },
        ]
      : []),
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: { xs: 60, sm: 200 },
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: { xs: 60, sm: 200 },
          boxSizing: "border-box",
          position: "fixed",
          top: { xs: "56px", sm: "64px" },
          height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1a2332" : "#ffffff",
          borderRight: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "#2d3748" : "#e0e0e0",
          transition: (theme) =>
            theme.transitions.create(["background-color", "border-color"], {
              duration: theme.transitions.duration.standard,
            }),
        },
      }}
    >
      <List sx={{ pt: 2, overflow: "hidden" }}>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={selected === item.key}
              onClick={() => onSelect(item.key)}
              sx={{
                minHeight: { xs: 48, sm: 56 },
                justifyContent: { xs: "center", sm: "flex-start" },
                px: { xs: 1, sm: 2 },
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.text.primary
                    : theme.palette.text.primary,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  transform: "translateX(4px)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 2px 8px rgba(92, 107, 192, 0.3)"
                      : "0 2px 8px rgba(57, 73, 171, 0.2)",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                    transform: "scale(1.1)",
                  },
                },
                "&:hover": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                  transform: "translateX(2px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: { xs: "auto", sm: 40 },
                  color: "inherit",
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ display: { xs: "none", sm: "block" } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
