import React, { useState, ReactNode } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  Assessment,
  Settings,
  Home,
} from "@mui/icons-material";
import { useAuth } from "@hooks/useAuth";
import { NavbarApiStatus } from "@widgets";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  breadcrumbs = [],
  actions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const navigationItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Projects", icon: <Assignment />, path: "/projects" },
    { text: "Reports", icon: <Assessment />, path: "/reports" },
    { text: "Settings", icon: <Settings />, path: "/settings" },
  ];

  const drawer = (
    <Box className="h-full">
      <Toolbar className="border-b border-gray-200">
        <Typography
          variant="h6"
          noWrap
          component="div"
          color="primary"
          className="font-semibold"
        >
          Solar ICMS
        </Typography>
      </Toolbar>
      <Divider />
      <List className="pt-2">
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding className="px-2">
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              className="mb-1 rounded-lg transition-all duration-200"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main + "20",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main + "30",
                  },
                },
              }}
            >
              <ListItemIcon
                className={`transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                className={`transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "font-semibold text-blue-600"
                    : "text-gray-700"
                }`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (!isAuthenticated) {
    return <Box>{children}</Box>;
  }

  return (
    <Box className="flex min-h-screen bg-gray-50">
      {/* App Bar */}
      <AppBar
        position="fixed"
        className="shadow-md"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar className="bg-white text-gray-800 shadow-sm">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="mr-4 text-gray-700 md:hidden"
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            className="flex-grow font-semibold text-gray-800"
          >
            {title || "Dashboard"}
          </Typography>

          <div className="flex items-center space-x-4">
            <NavbarApiStatus compact />

            <IconButton
              size="large"
              edge="end"
              aria-label="account menu"
              onClick={handleProfileMenuOpen}
              className="ml-2"
            >
              <Avatar className="h-8 w-8 bg-blue-600 font-medium text-white">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
              </Avatar>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box component="nav" className="w-70 flex-shrink-0 md:w-70">
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          className="drawer-container"
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundColor: "white",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        className="min-h-screen flex-grow bg-gray-50 p-6"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumbs className="mb-4 text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <Link
                key={index}
                color={
                  index === breadcrumbs.length - 1 ? "text.primary" : "inherit"
                }
                href={crumb.href}
                underline="hover"
                className={`transition-colors duration-200 ${
                  crumb.href
                    ? "cursor-pointer hover:text-blue-600"
                    : "cursor-default"
                } ${
                  index === breadcrumbs.length - 1
                    ? "font-medium text-gray-900"
                    : "text-gray-600"
                }`}
              >
                {crumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        )}

        {/* Page Actions */}
        {actions && <Box className="mb-4 flex justify-end">{actions}</Box>}

        <div className="rounded-lg bg-white p-6 shadow-sm">{children}</div>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        className="mt-2"
        PaperProps={{
          className: "shadow-lg border border-gray-200 rounded-lg min-w-48",
        }}
      >
        <MenuItem
          onClick={handleProfileMenuClose}
          className="border-b border-gray-100"
        >
          <Typography variant="body2" className="font-medium text-gray-600">
            {user?.fullName || user?.username}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate("/profile");
          }}
          className="transition-colors duration-200 hover:bg-gray-50"
        >
          <span className="text-gray-700">Profile</span>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate("/settings");
          }}
          className="transition-colors duration-200 hover:bg-gray-50"
        >
          <span className="text-gray-700">Settings</span>
        </MenuItem>
        <Divider className="my-1" />
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            logout();
          }}
          className="text-red-600 transition-colors duration-200 hover:bg-red-50"
        >
          <span className="font-medium">Logout</span>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardLayout;
