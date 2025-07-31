import { Logout } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";

interface LogoutButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  redirectTo?: string;
  children?: ReactNode;
}

export default function LogoutButton({
  variant = "primary",
  size = "md",
  className = "",
  redirectTo = "/",
  children,
}: LogoutButtonProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      console.log("LogoutButton: Initiating logout");
      await logout();
      console.log(
        "LogoutButton: Logout successful, redirecting to:",
        redirectTo
      );
      navigate(redirectTo);
    } catch (error) {
      console.error("LogoutButton: Logout failed:", error);
      // Still navigate even if logout fails to prevent user from being stuck
      navigate(redirectTo);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get MUI Button variant based on our variant prop
  const getMUIVariant = () => {
    switch (variant) {
      case "primary":
        return "contained";
      case "secondary":
        return "outlined";
      case "danger":
        return "contained";
      default:
        return "contained";
    }
  };

  // Get MUI Button color based on our variant prop
  const getMUIColor = () => {
    switch (variant) {
      case "danger":
        return "error";
      case "secondary":
        return "secondary";
      default:
        return "primary";
    }
  };

  // Get MUI size
  const getMUISize = () => {
    switch (size) {
      case "sm":
        return "small";
      case "lg":
        return "large";
      default:
        return "medium";
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoggingOut}
      variant={getMUIVariant()}
      color={getMUIColor()}
      size={getMUISize()}
      startIcon={
        isLoggingOut ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <Logout />
        )
      }
      className={`font-sarabun-medium ${className}`}
      title="Sign out of your account"
    >
      {isLoggingOut ? "Logging out..." : children || "Logout"}
    </Button>
  );
}
