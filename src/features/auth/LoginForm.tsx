import {
  AccountCircle,
  Lock,
  Login,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { LoginRequest } from "../../shared/types/auth";
import { showToast } from "../../shared/utils/toast";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  // Test accounts for easy access
  const testAccounts = [
    { username: "admin@example.com", password: "Admin123!", role: "Admin" },
    { username: "test_manager", password: "Manager123!", role: "Manager" },
    { username: "test_user", password: "User123!", role: "User" },
    { username: "test_viewer", password: "Viewer123!", role: "Viewer" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      showToast.error("Please fill in all fields");
      return;
    }

    const loadingToast = showToast.loading("Signing in...");

    try {
      const success = await login(formData);
      showToast.dismiss(loadingToast);

      if (success) {
        showToast.auth.loginSuccess();
        onSuccess?.();
        navigate("/dashboard");
      } else {
        showToast.auth.loginError("Invalid username or password");
      }
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.auth.loginError("Login failed. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fillTestAccount = (account: (typeof testAccounts)[0]) => {
    setFormData({
      username: account.username,
      password: account.password,
    });
    setError("");
    showToast.success(`Filled credentials for ${account.role}`, {
      duration: 2000,
      icon: "🔑",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
        py: { xs: 2, sm: 6 },
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={8}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Login
                sx={{
                  fontSize: 48,
                  color: "primary.main",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                gutterBottom
                color="text.primary"
              >
                Sign in to Solar Projects
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Access your solar project management dashboard
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Stack spacing={3}>
                {/* Username Field */}
                <TextField
                  name="username"
                  label="Username or Email"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  fullWidth
                  autoComplete="username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Password Field */}
                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  fullWidth
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  size="large"
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                    background:
                      "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                    },
                  }}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Login />
                    )
                  }
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </Stack>

              {/* Test Accounts Section */}
              <Box mt={4}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  mb={2}
                >
                  Quick test with demo accounts:
                </Typography>
                <Grid container spacing={1}>
                  {testAccounts.map((account) => (
                    <Grid size={{ xs: 6 }} key={account.username}>
                      <Chip
                        label={account.role}
                        onClick={() => fillTestAccount(account)}
                        disabled={isLoading}
                        variant="outlined"
                        color="primary"
                        sx={{
                          width: "100%",
                          height: 40,
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "primary.50",
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Registration Link */}
              <Box textAlign="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#1976d2",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Create one here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
