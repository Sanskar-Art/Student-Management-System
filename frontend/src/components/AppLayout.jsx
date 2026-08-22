import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  AppBar,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { tokens } from "../theme";

const DRAWER_WIDTH = 232;

const navItems = [
  { label: "Students", to: "/students", icon: <PeopleAltIcon fontSize="small" /> },
  { label: "Courses", to: "/courses", icon: <MenuBookIcon fontSize="small" /> },
  { label: "Enrollments", to: "/enrollments", icon: <AssignmentIcon fontSize="small" /> },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: tokens.inkNavy,
            color: "#FFFFFF",
            borderRight: "none",
          },
        }}
      >
        <Toolbar sx={{ px: 3, py: 3 }}>
          <SchoolIcon sx={{ mr: 1.5, color: tokens.amber }} />
          <Box>
            <Typography
              sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, lineHeight: 1.1 }}
              variant="subtitle1"
            >
              e-Registrar
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
              Student Management
            </Typography>
          </Box>
        </Toolbar>

        <List sx={{ px: 1.5, mt: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                color: "rgba(255,255,255,0.75)",
                "&.active": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "#FFFFFF",
                  borderLeft: `3px solid ${tokens.amber}`,
                },
                "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 500 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "#FFFFFF",
            color: tokens.inkNavy,
            borderBottom: `1px solid ${tokens.hairline}`,
          }}
        >
          <Toolbar sx={{ justifyContent: "flex-end", gap: 1.5 }}>
            <Chip
              label={user?.role}
              size="small"
              sx={{
                backgroundColor: user?.role === "Admin" ? tokens.amber : tokens.ledgerGreen,
                color: "#FFFFFF",
                fontWeight: 600,
              }}
            />
            <Typography variant="body2" sx={{ color: tokens.slate }}>
              {user?.username}
            </Typography>
            <Tooltip title="Log out">
              <IconButton size="small" onClick={handleLogout} sx={{ color: tokens.slate }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, backgroundColor: tokens.parchment }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
