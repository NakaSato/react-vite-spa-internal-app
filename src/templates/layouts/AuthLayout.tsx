import {
  alpha,
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const AuthLayoutContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 50%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
  padding: theme.spacing(2),
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 480,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: "blur(10px)",
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  "& img": {
    height: 64,
    marginBottom: theme.spacing(2),
  },
}));

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  logoSrc?: string;
  maxWidth?: number;
}

/**
 * AuthLayout Template
 *
 * Provides a consistent layout for authentication pages (login, register, forgot password)
 * Features:
 * - Responsive design with MUI breakpoints
 * - Gradient background with glass morphism effect
 * - Centered form container with proper spacing
 * - Logo and branding integration
 * - Sarabun font typography
 * - Tailwind utility classes for fine-tuning
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showLogo = true,
  logoSrc = "/images/pea_logo.png",
  maxWidth = 480,
}) => {
  const theme = useTheme();

  return (
    <AuthLayoutContainer>
      <Container maxWidth="sm" className="flex justify-center">
        <AuthPaper elevation={8} sx={{ maxWidth }} className="w-full">
          {showLogo && (
            <LogoContainer>
              <img src={logoSrc} alt="PEA Logo" className="mx-auto mb-4 h-16" />
              <Typography
                variant="h4"
                component="h1"
                className="font-sarabun-bold mb-2 text-gray-800"
                align="center"
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body1"
                  className="font-sarabun-regular text-gray-600"
                  align="center"
                >
                  {subtitle}
                </Typography>
              )}
            </LogoContainer>
          )}

          {!showLogo && (
            <Box className="mb-6 text-center">
              <Typography
                variant="h4"
                component="h1"
                className="font-sarabun-bold mb-2 text-gray-800"
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body1"
                  className="font-sarabun-regular text-gray-600"
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}

          <Box className="w-full">{children}</Box>

          {/* Footer */}
          <Box className="mt-8 border-t border-gray-200 pt-4">
            <Typography
              variant="caption"
              className="font-sarabun-light block text-center text-gray-500"
            >
              ICMS - ระบบจัดการโครงการก่อสร้างภายในองค์กร
            </Typography>
            <Typography
              variant="caption"
              className="font-sarabun-light block text-center text-gray-500"
            >
              โครงการโซลาร์ PEA & PWA
            </Typography>
          </Box>
        </AuthPaper>
      </Container>
    </AuthLayoutContainer>
  );
};

export default AuthLayout;
