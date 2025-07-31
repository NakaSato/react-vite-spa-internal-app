import {
  AppBar,
  Avatar,
  Box,
  Button,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { LogoutButton } from "../features/auth";
import { useAuth } from "../shared/hooks/useAuth";

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme.palette.primary.main,
        fontFamily: "Sarabun, sans-serif",
        boxShadow: "none",
        borderRadius: 0,
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "none",
          px: { xs: 2, sm: 3, lg: 4, xl: 6, "2xl": 8 },
          justifyContent: "space-between",
        }}
      >
        {/* Left Section - Logo and Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              fontFamily: "Sarabun, sans-serif",
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              "&:hover": {
                color: theme.palette.primary.light,
              },
            }}
          >
            INTERNAL CONSTRUCTION
          </Typography>

          {/* Navigation Links */}
          {isAuthenticated && isMdUp && (
            <Stack direction="row" spacing={1} sx={{ ml: 4 }}>
              <Button
                component={Link}
                to="/dashboard"
                variant={
                  location.pathname === "/dashboard" ? "contained" : "text"
                }
                sx={{
                  fontFamily: "Sarabun, sans-serif",
                  fontWeight: 500,
                  color:
                    location.pathname === "/dashboard"
                      ? "white"
                      : theme.palette.primary.light,
                  backgroundColor:
                    location.pathname === "/dashboard"
                      ? theme.palette.primary.dark
                      : "transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    color: "white",
                  },
                }}
              >
                Dashboard
              </Button>
              <Button
                component={Link}
                to="/projects/realtime"
                variant={
                  location.pathname === "/projects/realtime"
                    ? "contained"
                    : "text"
                }
                sx={{
                  fontFamily: "Sarabun, sans-serif",
                  fontWeight: 500,
                  color:
                    location.pathname === "/projects/realtime"
                      ? "white"
                      : theme.palette.primary.light,
                  backgroundColor:
                    location.pathname === "/projects/realtime"
                      ? theme.palette.primary.dark
                      : "transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    color: "white",
                  },
                }}
              >
                Live Projects
              </Button>
              <Button
                component={Link}
                to="/daily-reports"
                variant={
                  location.pathname === "/daily-reports" ? "contained" : "text"
                }
                sx={{
                  fontFamily: "Sarabun, sans-serif",
                  fontWeight: 500,
                  color:
                    location.pathname === "/daily-reports"
                      ? "white"
                      : theme.palette.primary.light,
                  backgroundColor:
                    location.pathname === "/daily-reports"
                      ? theme.palette.primary.dark
                      : "transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    color: "white",
                  },
                }}
              >
                Daily Reports
              </Button>

              {/* Debug links for development */}
              {import.meta.env.DEV && (
                <Button
                  component={Link}
                  to="/debug/projects"
                  variant={
                    location.pathname === "/debug/projects"
                      ? "contained"
                      : "text"
                  }
                  sx={{
                    fontFamily: "Sarabun, sans-serif",
                    fontWeight: 500,
                    color:
                      location.pathname === "/debug/projects"
                        ? "white"
                        : theme.palette.error.light,
                    backgroundColor:
                      location.pathname === "/debug/projects"
                        ? theme.palette.error.dark
                        : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.error.dark,
                      color: "white",
                    },
                  }}
                >
                  Debug
                </Button>
              )}
            </Stack>
          )}
        </Box>

        {/* Right Section - User Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isAuthenticated && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.dark,
                    width: 32,
                    height: 32,
                    fontSize: "0.875rem",
                  }}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Sarabun, sans-serif",
                      fontWeight: 500,
                      color: "white",
                    }}
                  >
                    {user?.fullName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "Sarabun, sans-serif",
                      color: theme.palette.primary.light,
                    }}
                  >
                    {user?.roleName}
                  </Typography>
                </Box>
              </Stack>
              <LogoutButton
                variant="secondary"
                size="sm"
                redirectTo="/"
                className="!bg-blue-800 hover:!bg-blue-900"
              />
            </Stack>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
