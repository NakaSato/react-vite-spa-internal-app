import {
  Close,
  Error,
  Info,
  Login,
  Refresh,
  Warning,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

interface ErrorBannerProps {
  error: string;
  onDismiss: () => void;
}

const ErrorBanner = ({ error, onDismiss }: ErrorBannerProps) => {
  const isWarning = error.includes("Note:");
  const isAuthError =
    error.includes("Authentication required") || error.includes("401");
  const isServerError =
    error.includes("Server Error") ||
    error.includes("Object reference not set");
  const isNotFound = error.includes("not found") || error.includes("404");

  // Determine alert severity based on error type
  const getSeverity = () => {
    if (isWarning) return "warning";
    if (isAuthError) return "error";
    if (isServerError) return "error";
    if (isNotFound) return "info";
    return "error";
  };

  // Get appropriate icon based on error type
  const getIcon = () => {
    if (isWarning) return <Warning />;
    if (isAuthError) return <Error />;
    if (isServerError) return <Error />;
    if (isNotFound) return <Info />;
    return <Error />;
  };

  // Get title based on error type
  const getTitle = () => {
    if (isWarning) return "Limited Data Warning";
    if (isAuthError) return "Authentication Required";
    if (isServerError) return "Server Error";
    if (isNotFound) return "Project Not Found";
    return "API Error";
  };

  // Get action buttons based on error type
  const getActions = () => {
    const actions = [];

    if (isAuthError) {
      actions.push(
        <Button
          key="login"
          startIcon={<Login />}
          variant="outlined"
          size="small"
          onClick={() => (window.location.href = "/login")}
          className="font-sarabun-medium"
        >
          Go to Login
        </Button>
      );
    }

    if (isServerError) {
      actions.push(
        <Button
          key="retry"
          startIcon={<Refresh />}
          variant="outlined"
          size="small"
          onClick={() => window.location.reload()}
          className="font-sarabun-medium mr-2"
        >
          Retry
        </Button>
      );
      actions.push(
        <Button
          key="dashboard"
          variant="outlined"
          size="small"
          onClick={() => (window.location.href = "/dashboard")}
          className="font-sarabun-medium"
        >
          Back to Dashboard
        </Button>
      );
    }

    return actions;
  };

  return (
    <Box className="mb-4">
      <Alert
        severity={getSeverity()}
        icon={getIcon()}
        className="shadow-sm"
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            {getActions()}
            <IconButton
              size="small"
              onClick={onDismiss}
              className="ml-2"
              aria-label="Close alert"
            >
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        }
      >
        <AlertTitle className="font-sarabun-semibold">{getTitle()}</AlertTitle>
        <Typography
          variant="body2"
          className="font-sarabun-regular"
          component="div"
        >
          {error}
        </Typography>
      </Alert>
    </Box>
  );
};

export default ErrorBanner;
