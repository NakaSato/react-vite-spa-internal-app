import { ArrowBack, NavigateNext } from "@mui/icons-material";
import {
  alpha,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface DetailAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  disabled?: boolean;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface DetailPageTemplateProps {
  /** Page title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Breadcrumb navigation */
  breadcrumbs?: BreadcrumbItem[];
  /** Status or category chips */
  chips?: Array<{
    label: string;
    color?:
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "warning"
      | "info"
      | "success";
    variant?: "filled" | "outlined";
  }>;
  /** Primary actions (edit, delete, etc.) */
  primaryActions?: DetailAction[];
  /** Secondary actions (share, more options, etc.) */
  secondaryActions?: DetailAction[];
  /** Show back button */
  showBackButton?: boolean;
  /** Main content sections */
  children: React.ReactNode;
  /** Sidebar content */
  sidebar?: React.ReactNode;
  /** Footer actions */
  footerActions?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Custom header content */
  headerContent?: React.ReactNode;
}

/**
 * DetailPageTemplate
 *
 * Standardized detail page layout for displaying single item information.
 * Optimized for solar project management with Thai/English content support.
 *
 * Features:
 * - Responsive grid layout with optional sidebar
 * - Breadcrumb navigation with MUI styling
 * - Action buttons with consistent spacing
 * - Status chips for categorization
 * - Print-friendly layout
 * - Sarabun font integration
 * - MUI + Tailwind hybrid styling
 *
 * @example
 * ```tsx
 * <DetailPageTemplate
 *   title="โครงการโซลาร์ ABC Solar Project ABC"
 *   subtitle="รายละเอียดโครงการ Project Details"
 *   breadcrumbs={[
 *     { label: "หน้าหลัก Home", href: "/" },
 *     { label: "โครงการ Projects", href: "/projects" },
 *     { label: "รายละเอียด Details" }
 *   ]}
 *   chips={[
 *     { label: "กำลังดำเนินการ In Progress", color: "primary" },
 *     { label: "ระดับสูง High Priority", color: "warning" }
 *   ]}
 *   primaryActions={[
 *     { label: "แก้ไข Edit", icon: <Edit />, onClick: handleEdit },
 *     { label: "ลบ Delete", icon: <Delete />, onClick: handleDelete, color: "error" }
 *   ]}
 * >
 *   <DetailSection title="ข้อมูลทั่วไป General Information">
 *     // Content here
 *   </DetailSection>
 * </DetailPageTemplate>
 * ```
 */
export const DetailPageTemplate: React.FC<DetailPageTemplateProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  chips = [],
  primaryActions = [],
  secondaryActions = [],
  showBackButton = true,
  children,
  sidebar,
  footerActions,
  loading = false,
  headerContent,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <Box className="min-h-screen bg-gray-50">
      <Container maxWidth="xl" className="py-6">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            className="font-sarabun-regular mb-4"
            aria-label="breadcrumb"
          >
            {breadcrumbs.map((item, index) => (
              <Link
                key={index}
                color={
                  index === breadcrumbs.length - 1 ? "text.primary" : "inherit"
                }
                href={item.href}
                onClick={(e) => {
                  if (item.onClick || !item.href) {
                    e.preventDefault();
                    handleBreadcrumbClick(item);
                  }
                }}
                className="font-sarabun-regular cursor-pointer hover:underline"
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {item.label}
              </Link>
            ))}
          </Breadcrumbs>
        )}

        {/* Header */}
        <Paper elevation={1} className="mb-6 rounded-xl p-6">
          <Box className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Title Section */}
            <Box className="flex-1">
              <Box className="mb-2 flex items-center gap-3">
                {showBackButton && (
                  <IconButton
                    onClick={handleBack}
                    size="small"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <ArrowBack />
                  </IconButton>
                )}
                <Typography
                  variant="h4"
                  className="font-sarabun-semibold text-gray-800"
                  sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
                >
                  {title}
                </Typography>
              </Box>

              {subtitle && (
                <Typography
                  variant="subtitle1"
                  className="font-sarabun-regular mb-3 text-gray-600"
                >
                  {subtitle}
                </Typography>
              )}

              {/* Status Chips */}
              {chips.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  className="mb-3"
                  flexWrap="wrap"
                >
                  {chips.map((chip, index) => (
                    <Chip
                      key={index}
                      label={chip.label}
                      color={chip.color || "default"}
                      variant={chip.variant || "filled"}
                      size="small"
                      className="font-sarabun-medium"
                    />
                  ))}
                </Stack>
              )}

              {/* Custom Header Content */}
              {headerContent && <Box className="mt-3">{headerContent}</Box>}
            </Box>

            {/* Actions */}
            <Box className="flex flex-col gap-2 sm:flex-row">
              {/* Primary Actions */}
              {primaryActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "contained"}
                  color={action.color || "primary"}
                  size="medium"
                  startIcon={action.icon}
                  onClick={action.onClick}
                  disabled={action.disabled || loading}
                  className="font-sarabun-medium"
                  sx={{ minWidth: 120 }}
                >
                  {action.label}
                </Button>
              ))}

              {/* Secondary Actions */}
              {secondaryActions.map((action, index) => (
                <Button
                  key={`secondary-${index}`}
                  variant={action.variant || "outlined"}
                  color={action.color || "primary"}
                  size="medium"
                  startIcon={action.icon}
                  onClick={action.onClick}
                  disabled={action.disabled || loading}
                  className="font-sarabun-medium"
                  sx={{ minWidth: 120 }}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Content */}
        <Box className="flex flex-col gap-6 lg:flex-row">
          {/* Main Content */}
          <Box className={`flex-1 ${sidebar ? "lg:w-2/3" : "w-full"}`}>
            <Stack spacing={3}>{children}</Stack>
          </Box>

          {/* Sidebar */}
          {sidebar && (
            <Box className="w-full lg:w-1/3">
              <Box className="sticky top-6">{sidebar}</Box>
            </Box>
          )}
        </Box>

        {/* Footer Actions */}
        {footerActions && (
          <Paper
            elevation={1}
            className="mt-6 rounded-xl p-4"
            sx={{
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(10px)",
            }}
          >
            {footerActions}
          </Paper>
        )}
      </Container>
    </Box>
  );
};

/**
 * DetailSection Component
 *
 * Reusable section component for organizing content within DetailPageTemplate
 */
interface DetailSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const DetailSection: React.FC<DetailSectionProps> = ({
  title,
  subtitle,
  children,
  actions,
}) => {
  return (
    <Card elevation={1} className="rounded-xl">
      <CardContent className="p-6">
        <Box className="mb-4 flex items-center justify-between">
          <Box>
            <Typography
              variant="h6"
              className="font-sarabun-semibold mb-1 text-gray-800"
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                className="font-sarabun-regular text-gray-600"
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && <Box>{actions}</Box>}
        </Box>
        <Divider className="mb-4" />
        {children}
      </CardContent>
    </Card>
  );
};

export default DetailPageTemplate;
