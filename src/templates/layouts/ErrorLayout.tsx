import { ArrowBack, Home, Refresh, SupportAgent } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ErrorLayoutProps {
  /** Error code (404, 500, 403, etc.) */
  errorCode: string;
  /** Main error title */
  title: string;
  /** Detailed error message */
  message: string;
  /** Optional emoji or icon to display */
  icon?: string | React.ReactNode;
  /** Show refresh button */
  showRefresh?: boolean;
  /** Show back button */
  showBack?: boolean;
  /** Show home button */
  showHome?: boolean;
  /** Show support button */
  showSupport?: boolean;
  /** Custom actions */
  customActions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "contained" | "outlined" | "text";
    color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
    icon?: React.ReactNode;
  }>;
  /** Additional content */
  children?: React.ReactNode;
}

/**
 * ErrorLayout Template
 *
 * Standardized error page layout with Sarabun font and MUI + Tailwind styling.
 * Provides consistent error handling UI across the solar project management application.
 *
 * Features:
 * - Responsive design for mobile and desktop
 * - Consistent branding with project theme
 * - Multiple action buttons with icons
 * - Thai/English content support
 * - Accessible design patterns
 *
 * @example
 * ```tsx
 * <ErrorLayout
 *   errorCode="404"
 *   title="หน้าไม่พบ Page Not Found"
 *   message="ไม่พบหน้าที่คุณกำลังมองหา The page you're looking for doesn't exist."
 *   icon="🔍"
 *   showHome
 *   showBack
 * />
 * ```
 */
export const ErrorLayout: React.FC<ErrorLayoutProps> = ({
  errorCode,
  title,
  message,
  icon = "⚠️",
  showRefresh = false,
  showBack = true,
  showHome = true,
  showSupport = false,
  customActions = [],
  children,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleSupport = () => {
    // In a real app, this could open a support modal or navigate to help
    console.log("Contact support requested");
  };

  return (
    <Box
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 50%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          className="rounded-2xl p-8 text-center"
          sx={{
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          {/* Error Code */}
          <Typography
            variant="h2"
            className="font-sarabun-bold mb-2 text-gray-400"
            sx={{ fontSize: { xs: "4rem", md: "6rem" } }}
          >
            {errorCode}
          </Typography>

          {/* Icon */}
          <Box className="mb-6">
            {typeof icon === "string" ? (
              <Typography
                variant="h1"
                className="mb-4 text-6xl"
                sx={{ fontSize: { xs: "4rem", md: "5rem" } }}
              >
                {icon}
              </Typography>
            ) : (
              <Box className="mb-4 text-gray-400" sx={{ fontSize: "5rem" }}>
                {icon}
              </Box>
            )}
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            className="font-sarabun-semibold mb-4 text-gray-800"
            sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
          >
            {title}
          </Typography>

          {/* Message */}
          <Typography
            variant="body1"
            className="font-sarabun-regular mx-auto mb-8 max-w-2xl text-gray-600"
            sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
          >
            {message}
          </Typography>

          {/* Action Buttons */}
          <Box className="mb-6 flex flex-wrap justify-center gap-3">
            {showHome && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Home />}
                onClick={handleHome}
                className="font-sarabun-medium"
                sx={{ minWidth: 120 }}
              >
                หน้าหลัก Home
              </Button>
            )}

            {showBack && (
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<ArrowBack />}
                onClick={handleBack}
                className="font-sarabun-medium"
                sx={{ minWidth: 120 }}
              >
                ย้อนกลับ Back
              </Button>
            )}

            {showRefresh && (
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                className="font-sarabun-medium"
                sx={{ minWidth: 120 }}
              >
                รีเฟรช Refresh
              </Button>
            )}

            {showSupport && (
              <Button
                variant="text"
                color="info"
                size="large"
                startIcon={<SupportAgent />}
                onClick={handleSupport}
                className="font-sarabun-medium"
                sx={{ minWidth: 120 }}
              >
                ติดต่อ Support
              </Button>
            )}

            {/* Custom Actions */}
            {customActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outlined"}
                color={action.color || "primary"}
                size="large"
                startIcon={action.icon}
                onClick={action.onClick}
                className="font-sarabun-medium"
                sx={{ minWidth: 120 }}
              >
                {action.label}
              </Button>
            ))}
          </Box>

          {/* Additional Content */}
          {children && (
            <Box className="mt-8 border-t border-gray-200 pt-6">{children}</Box>
          )}

          {/* Footer Info */}
          <Typography
            variant="caption"
            className="font-sarabun-light mt-8 block text-gray-500"
          >
            ระบบจัดการโครงการโซลาร์ PEA & PWA | Solar Project Management System
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ErrorLayout;
