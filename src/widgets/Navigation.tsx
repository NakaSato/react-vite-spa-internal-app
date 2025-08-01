import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Timeline as LiveIcon,
  Menu as MenuIcon,
  Assignment as ReportsIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogoutButton } from "../components/auth";
import { useAuth } from "../shared/hooks/useAuth";

// Navigation configuration
const NAVIGATION_ITEMS = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    color: "primary" as const,
  },
  {
    path: "/projects/realtime",
    label: "Live Projects",
    icon: LiveIcon,
    color: "primary" as const,
  },
  {
    path: "/daily-reports",
    label: "Daily Reports",
    icon: ReportsIcon,
    color: "primary" as const,
  },
] as const;

// Reusable button styles
const getNavigationButtonStyles = (
  theme: any,
  isActive: boolean,
  colorScheme: "primary" | "error" = "primary"
) => ({
  fontFamily: "Sarabun, sans-serif",
  fontWeight: 500,
  minWidth: { xs: "auto", md: 120 },
  px: { xs: 1, md: 2 },
  color: isActive ? "white" : theme.palette[colorScheme].light,
  backgroundColor: isActive ? theme.palette[colorScheme].dark : "transparent",
  "&:hover": {
    backgroundColor: theme.palette[colorScheme].dark,
    color: "white",
    transform: "translateY(-1px)",
  },
  transition: "all 0.2s ease-in-out",
});

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Memoized active path check
  const isActivePath = useMemo(
    () => (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Handler functions
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280, height: "100%" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Sarabun, sans-serif",
            fontWeight: 700,
            color: theme.palette.primary.main,
          }}
        >
          INTERNAL CONSTRUCTION
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ pt: 2 }}>
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isActive}
                onClick={handleDrawerToggle}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "inherit" : theme.palette.primary.main,
                    minWidth: 40,
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontFamily: "Sarabun, sans-serif",
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {/* Mobile Logout Button */}
        <ListItem disablePadding sx={{ mt: 2, mx: 1 }}>
          <Box sx={{ width: "100%" }}>
            <LogoutButton
              variant="secondary"
              size="sm"
              redirectTo="/"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 600,
                bgcolor: theme.palette.error.main,
                color: "white",
                border: "none",
                py: 1.5,
                width: "100%",
                "&:hover": {
                  bgcolor: theme.palette.error.dark,
                },
                transition: "all 0.2s ease-in-out",
              }}
            />
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.primary.main,
          fontFamily: "Sarabun, sans-serif",
          borderBottom: `1px solid ${theme.palette.primary.dark}`,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "none",
            px: { xs: 2, sm: 3, lg: 4, xl: 6 },
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {/* Mobile Menu Button */}
          {isAuthenticated && !isMdUp && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Left Section - Logo and Navigation Links */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              justifyContent: { xs: "center", md: "flex-start" },
              position: "relative",
            }}
          >
            {/* Mobile Menu Button Spacer */}
            {isAuthenticated && !isMdUp && (
              <Box sx={{ width: 48, flexShrink: 0 }} />
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: { xs: 1, md: "none" },
                position: { xs: "absolute", md: "static" },
                left: { xs: "50%", md: "auto" },
                transform: { xs: "translateX(-50%)", md: "none" },
              }}
            >
              <Typography
                component={Link}
                to="/"
                variant="h6"
                sx={{
                  fontFamily: "Sarabun, sans-serif",
                  fontWeight: 700,
                  color: "white",
                  textDecoration: "none",
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  whiteSpace: "nowrap",
                  "&:hover": {
                    color: theme.palette.primary.light,
                    transform: "scale(1.02)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                INTERNAL CONSTRUCTION
              </Typography>
            </Box>

            {/* Desktop Navigation Links */}
            {isAuthenticated && isMdUp && (
              <Stack direction="row" spacing={1} sx={{ ml: 4 }}>
                {NAVIGATION_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  return (
                    <Button
                      key={item.path}
                      component={Link}
                      to={item.path}
                      startIcon={<Icon />}
                      variant={isActive ? "contained" : "text"}
                      sx={getNavigationButtonStyles(
                        theme,
                        isActive,
                        item.color
                      )}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            )}
          </Box>

          {/* Right Section - User Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isAuthenticated && (
              <Stack direction="row" spacing={1} alignItems="center">
                {/* User Avatar (no click) */}
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.dark,
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    fontSize: "1rem",
                    fontWeight: 600,
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>

                {/* User Name and Role (Desktop only) */}
                <Box sx={{ display: { xs: "none", md: "block" }, ml: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Sarabun, sans-serif",
                      fontWeight: 600,
                      color: "white",
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.fullName}
                  </Typography>
                  <Chip
                    label={user?.roleName}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: "0.75rem",
                      fontFamily: "Sarabun, sans-serif",
                      color: theme.palette.primary.light,
                      borderColor: theme.palette.primary.light,
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                </Box>

                {/* Desktop Logout Button (Hidden on mobile) */}
                <Box
                  sx={{
                    ml: 2,
                    display: { xs: "none", md: "block" },
                  }}
                >
                  <LogoutButton
                    variant="secondary"
                    size="sm"
                    redirectTo="/"
                    sx={{
                      fontFamily: "Sarabun, sans-serif",
                      fontWeight: 600,
                      bgcolor: "rgba(255,255,255,0.1) !important",
                      color: "white !important",
                      border: "1px solid rgba(255,255,255,0.2)",
                      px: 2,
                      py: 0.75,
                      minWidth: 90,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.2) !important",
                        borderColor: "rgba(255,255,255,0.4)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                </Box>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {isAuthenticated && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
}

export default Navigation;
