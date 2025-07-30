import { useState, ReactNode } from "react";
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

  // Style variants
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-400",
    danger: "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={buttonStyles}
      title="Sign out of your account"
    >
      {isLoggingOut ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Logging out...
        </>
      ) : (
        children || (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </>
        )
      )}
    </button>
  );
}
