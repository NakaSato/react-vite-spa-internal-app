import {
  alpha,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

interface CardAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  disabled?: boolean;
}

interface CardTemplateProps {
  /** Card title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Main content */
  children?: React.ReactNode;
  /** Card actions (buttons) */
  actions?: CardAction[];
  /** Header avatar */
  avatar?: React.ReactNode;
  /** Header actions (usually icon buttons) */
  headerActions?: React.ReactNode;
  /** Status chips */
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
  /** Card variant */
  variant?: "outlined" | "elevation";
  /** Elevation level (0-24) */
  elevation?: number;
  /** Clickable card */
  onClick?: () => void;
  /** Loading state */
  loading?: boolean;
  /** Card width */
  maxWidth?: number | string;
  /** Image/media at top of card */
  media?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
}

/**
 * CardTemplate
 *
 * Versatile card component template for displaying structured information.
 * Optimized for solar project management with Thai/English content support.
 *
 * Features:
 * - Flexible header with avatar and actions
 * - Status chips for categorization
 * - Customizable action buttons
 * - Media support for images/charts
 * - Responsive design
 * - Sarabun font integration
 * - MUI + Tailwind hybrid styling
 * - Hover and click interactions
 *
 * @example
 * ```tsx
 * <CardTemplate
 *   title="โครงการโซลาร์ ABC Solar Project ABC"
 *   subtitle="ติดตั้งบนหลังคา Rooftop Installation"
 *   avatar={<Avatar>A</Avatar>}
 *   chips={[
 *     { label: "กำลังดำเนินการ In Progress", color: "primary" },
 *     { label: "ระดับสูง High Priority", color: "warning" }
 *   ]}
 *   actions={[
 *     { label: "ดูรายละเอียด View Details", icon: <Visibility />, onClick: handleView },
 *     { label: "แก้ไข Edit", icon: <Edit />, onClick: handleEdit }
 *   ]}
 * >
 *   <Typography>รายละเอียดโครงการ... Project details...</Typography>
 * </CardTemplate>
 * ```
 */
export const CardTemplate: React.FC<CardTemplateProps> = ({
  title,
  subtitle,
  children,
  actions = [],
  avatar,
  headerActions,
  chips = [],
  variant = "elevation",
  elevation = 2,
  onClick,
  loading = false,
  maxWidth,
  media,
  footer,
}) => {
  const theme = useTheme();

  const cardStyles = {
    maxWidth: maxWidth || "100%",
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.2s ease-in-out",
    "&:hover": onClick
      ? {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[8],
        }
      : {},
  };

  return (
    <Card
      variant={variant}
      elevation={variant === "elevation" ? elevation : 0}
      onClick={onClick}
      className="rounded-xl"
      sx={cardStyles}
    >
      {/* Media */}
      {media && <Box className="relative">{media}</Box>}

      {/* Header */}
      <CardHeader
        avatar={avatar}
        action={headerActions}
        title={
          <Typography
            variant="h6"
            className="font-sarabun-semibold text-gray-800"
            sx={{ fontSize: { xs: "1rem", md: "1.125rem" } }}
          >
            {title}
          </Typography>
        }
        subheader={
          subtitle && (
            <Typography
              variant="body2"
              className="font-sarabun-regular text-gray-600"
            >
              {subtitle}
            </Typography>
          )
        }
        className="pb-2"
      />

      {/* Status Chips */}
      {chips.length > 0 && (
        <Box className="px-4 pb-3">
          <Box className="flex flex-wrap gap-1">
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
          </Box>
        </Box>
      )}

      {/* Content */}
      {children && (
        <CardContent className="pt-0">
          <Box className={loading ? "opacity-50" : ""}>{children}</Box>
        </CardContent>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <>
          <Divider />
          <CardActions className="px-4 py-3">
            <Box className="flex w-full flex-wrap gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "text"}
                  color={action.color || "primary"}
                  size="small"
                  startIcon={action.icon}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  disabled={action.disabled || loading}
                  className="font-sarabun-medium"
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          </CardActions>
        </>
      )}

      {/* Footer */}
      {footer && (
        <>
          <Divider />
          <Box className="p-4">{footer}</Box>
        </>
      )}
    </Card>
  );
};

/**
 * InfoCard Component
 *
 * Specialized card for displaying key information with icon
 */
interface InfoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  onClick?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={2}
      className="cursor-pointer rounded-xl transition-shadow hover:shadow-lg"
      onClick={onClick}
      sx={{
        borderLeft: `4px solid ${theme.palette[color].main}`,
      }}
    >
      <CardContent className="p-4">
        <Box className="flex items-center justify-between">
          <Box className="flex-1">
            <Typography
              variant="body2"
              className="font-sarabun-medium mb-1 text-gray-600"
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              className="font-sarabun-bold mb-1"
              sx={{
                color: theme.palette[color].main,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                className="font-sarabun-regular text-gray-500"
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            className="rounded-lg p-3"
            sx={{
              backgroundColor: alpha(theme.palette[color].main, 0.1),
              color: theme.palette[color].main,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * ActionCard Component
 *
 * Card with prominent call-to-action button
 */
interface ActionCardProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outlined";
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  variant = "primary",
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={2}
      className="rounded-xl p-6 text-center transition-shadow hover:shadow-lg"
    >
      <CardContent>
        {icon && (
          <Box className="mb-4 flex justify-center">
            <Box
              className="rounded-full p-4"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              {icon}
            </Box>
          </Box>
        )}
        <Typography
          variant="h6"
          className="font-sarabun-semibold mb-2 text-gray-800"
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          className="font-sarabun-regular mb-4 text-gray-600"
        >
          {description}
        </Typography>
        <Button
          variant={variant === "outlined" ? "outlined" : "contained"}
          color={variant === "secondary" ? "secondary" : "primary"}
          size="large"
          onClick={onAction}
          className="font-sarabun-medium"
          fullWidth
        >
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardTemplate;
