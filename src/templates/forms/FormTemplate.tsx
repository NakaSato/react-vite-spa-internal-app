import { Cancel, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

interface FormAction {
  label: string;
  onClick: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

interface FormTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: FormAction[];
  isLoading?: boolean;
  progress?: number;
  onCancel?: () => void;
  onSave?: () => void;
  className?: string;
  elevation?: number;
  maxWidth?: number | string;
  showDivider?: boolean;
}

/**
 * FormTemplate Component
 *
 * Provides a consistent structure for forms throughout the application
 * Features:
 * - Material Design card layout
 * - Flexible action buttons
 * - Loading states with progress indicators
 * - Responsive design with Tailwind utilities
 * - Sarabun font integration
 * - Consistent spacing and typography
 */
export const FormTemplate: React.FC<FormTemplateProps> = ({
  title,
  subtitle,
  children,
  actions = [],
  isLoading = false,
  progress,
  onCancel,
  onSave,
  className = "",
  elevation = 2,
  maxWidth = "100%",
  showDivider = true,
}) => {
  // Default actions if none provided
  const defaultActions: FormAction[] = [
    ...(onCancel
      ? [
          {
            label: "Cancel",
            onClick: onCancel,
            variant: "outlined" as const,
            color: "secondary" as const,
            icon: <Cancel />,
          },
        ]
      : []),
    ...(onSave
      ? [
          {
            label: "Save",
            onClick: onSave,
            variant: "contained" as const,
            color: "primary" as const,
            icon: <Save />,
            loading: isLoading,
          },
        ]
      : []),
  ];

  const finalActions = actions.length > 0 ? actions : defaultActions;

  return (
    <Card
      elevation={elevation}
      className={`w-full ${className}`}
      sx={{ maxWidth }}
    >
      {/* Progress Indicator */}
      {isLoading && (
        <LinearProgress
          variant={progress !== undefined ? "determinate" : "indeterminate"}
          value={progress}
          className="rounded-t-lg"
        />
      )}

      {/* Header */}
      <CardContent className="pb-4">
        <Box className="mb-4">
          <Typography
            variant="h5"
            component="h2"
            className="font-sarabun-semibold mb-2 text-gray-800"
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

        {showDivider && <Divider className="mb-6" />}

        {/* Form Content */}
        <Box className="space-y-4">{children}</Box>
      </CardContent>

      {/* Actions */}
      {finalActions.length > 0 && (
        <>
          <Divider />
          <CardActions className="px-6 py-4">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              className="w-full"
              justifyContent="flex-end"
            >
              {finalActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "contained"}
                  color={action.color || "primary"}
                  onClick={action.onClick}
                  disabled={action.disabled || isLoading}
                  startIcon={action.loading ? undefined : action.icon}
                  className={`font-sarabun-medium ${action.loading ? "min-w-[120px]" : ""}`}
                  size="medium"
                >
                  {action.loading ? (
                    <Box className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {action.label}
                    </Box>
                  ) : (
                    action.label
                  )}
                </Button>
              ))}
            </Stack>
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default FormTemplate;
