import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  MenuItem,
  Stack,
  Fade,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  AccountCircle,
  Email,
  Lock,
  Badge,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useAuth } from "../../shared/hooks/useAuth";
import { RegisterRequest } from "../../shared/types/auth";

// Define UserRole enum based on the documentation
enum UserRole {
  ADMIN = 1,
  MANAGER = 2,
  USER = 3,
  VIEWER = 4,
}

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

interface FormErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<
    RegisterRequest & { confirmPassword: string }
  >({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: UserRole.USER,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must meet all requirements";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const success = await register(registerData);

      if (success) {
        onSuccess?.();
        navigate("/dashboard");
      } else {
        setServerError("Registration failed. Please try again.");
      }
    } catch (error: any) {
      if (error.message?.includes("Username already exists")) {
        setErrors({ username: "Username is already taken" });
      } else if (error.message?.includes("Email already exists")) {
        setErrors({ email: "Email is already registered" });
      } else {
        setServerError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: name === "roleId" ? parseInt(value) : value,
    }));

    // Clear field-specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const getPasswordStrength = (
    password: string
  ): { strength: number; color: string; label: string } => {
    if (!password) return { strength: 0, color: "grey", label: "" };

    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/\d/.test(password)) score += 12.5;
    if (/[@$!%*?&]/.test(password)) score += 12.5;

    if (score < 50) return { strength: score, color: "error", label: "Weak" };
    if (score < 75) return { strength: score, color: "warning", label: "Fair" };
    if (score < 100) return { strength: score, color: "info", label: "Good" };
    return { strength: score, color: "success", label: "Strong" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: "At least 8 characters long" },
    {
      met: /[a-z]/.test(formData.password),
      text: "Contains lowercase letters",
    },
    {
      met: /[A-Z]/.test(formData.password),
      text: "Contains uppercase letters",
    },
    { met: /\d/.test(formData.password), text: "Contains at least one number" },
    {
      met: /[@$!%*?&]/.test(formData.password),
      text: "Contains special character (@$!%*?&)",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="md">
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
              <PersonAdd
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
                Create Your Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join the Solar Projects management platform
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {serverError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {serverError}
                </Alert>
              )}

              <Stack spacing={3}>
                {/* Full Name */}
                <TextField
                  name="fullName"
                  label="Full Name"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  fullWidth
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Username */}
                <TextField
                  name="username"
                  label="Username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Email */}
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Role Selection */}
                <TextField
                  name="roleId"
                  label="Account Type"
                  select
                  value={formData.roleId}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  fullWidth
                  helperText="Admin and Manager accounts require approval"
                >
                  <MenuItem value={UserRole.USER}>
                    User - Standard access
                  </MenuItem>
                  <MenuItem value={UserRole.VIEWER}>
                    Viewer - Read-only access
                  </MenuItem>
                </TextField>

                {/* Password */}
                <Box>
                  <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password}
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
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <Box mt={1}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Password Strength:
                        </Typography>
                        <Typography
                          variant="caption"
                          color={passwordStrength.color + ".main"}
                          fontWeight="bold"
                        >
                          {passwordStrength.label}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength.strength}
                        color={passwordStrength.color as any}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Confirm Password */}
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
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
                      "linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)",
                    },
                  }}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <PersonAdd />
                    )
                  }
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </Stack>

              {/* Login Link */}
              <Box textAlign="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Button
                    variant="text"
                    onClick={onSwitchToLogin}
                    sx={{
                      p: 0,
                      textTransform: "none",
                      fontWeight: 600,
                      minWidth: "auto",
                    }}
                  >
                    Sign in here
                  </Button>
                </Typography>
              </Box>

              {/* Password Requirements */}
              {formData.password && (
                <Card sx={{ mt: 3, bgcolor: "grey.50" }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Password Requirements:
                    </Typography>
                    <List dense sx={{ py: 0 }}>
                      {passwordRequirements.map((req, index) => (
                        <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {req.met ? (
                              <CheckCircle color="success" fontSize="small" />
                            ) : (
                              <Cancel color="error" fontSize="small" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={req.text}
                            primaryTypographyProps={{
                              variant: "body2",
                              color: req.met ? "success.main" : "error.main",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
