import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  Assignment,
} from "@mui/icons-material";
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
    ...(isTeacher ? [{
      key: "form" as const,
      label: "Post Homework",
      icon: <Assignment />,
    }] : []),
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 200,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 200,
          boxSizing: 'border-box',
          top: 64, // Account for header height
          height: 'calc(100vh - 64px)',
        },
      }}
    >
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={selected === item.key}
              onClick={() => onSelect(item.key)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
