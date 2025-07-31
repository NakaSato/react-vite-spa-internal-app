import { CheckCircle, Close, Error, Info, Warning } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

interface ModalAction {
  label: string;
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
  autoFocus?: boolean;
}

interface ModalTemplateProps {
  /** Modal open state */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Main content */
  children: React.ReactNode;
  /** Action buttons */
  actions?: ModalAction[];
  /** Modal size */
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  /** Full width modal */
  fullWidth?: boolean;
  /** Full screen on mobile */
  fullScreen?: boolean;
  /** Disable close on backdrop click */
  disableBackdropClick?: boolean;
  /** Disable close on escape key */
  disableEscapeKeyDown?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Modal type for styling */
  type?: "default" | "confirmation" | "success" | "warning" | "error" | "info";
  /** Loading state */
  loading?: boolean;
  /** Custom header content */
  headerContent?: React.ReactNode;
  /** Footer content (below actions) */
  footerContent?: React.ReactNode;
}

/**
 * ModalTemplate
 *
 * Comprehensive modal/dialog template for consistent user interactions.
 * Optimized for solar project management with Thai/English content support.
 *
 * Features:
 * - Responsive design with mobile fullscreen option
 * - Multiple modal types with appropriate styling
 * - Customizable actions with loading states
 * - Accessible keyboard navigation
 * - Sarabun font integration
 * - MUI + Tailwind hybrid styling
 * - Consistent spacing and animations
 *
 * @example
 * ```tsx
 * <ModalTemplate
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="ยืนยันการลบ Confirm Deletion"
 *   subtitle="การดำเนินการนี้ไม่สามารถย้อนกลับได้ This action cannot be undone"
 *   type="warning"
 *   maxWidth="sm"
 *   actions={[
 *     { label: "ยกเลิก Cancel", onClick: handleClose, variant: "outlined" },
 *     { label: "ลบ Delete", onClick: handleDelete, variant: "contained", color: "error" }
 *   ]}
 * >
 *   <Typography>คุณแน่ใจหรือไม่ที่จะลบโครงการนี้? Are you sure you want to delete this project?</Typography>
 * </ModalTemplate>
 * ```
 */
export const ModalTemplate: React.FC<ModalTemplateProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions = [],
  maxWidth = "sm",
  fullWidth = true,
  fullScreen = false,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  showCloseButton = true,
  type = "default",
  loading = false,
  headerContent,
  footerContent,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getTypeIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle color="success" />;
      case "warning":
        return <Warning color="warning" />;
      case "error":
        return <Error color="error" />;
      case "info":
        return <Info color="info" />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "success":
        return theme.palette.success.main;
      case "warning":
        return theme.palette.warning.main;
      case "error":
        return theme.palette.error.main;
      case "info":
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const handleClose = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick" && disableBackdropClick) return;
    if (reason === "escapeKeyDown" && disableEscapeKeyDown) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen || (isMobile && fullScreen)}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          background: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: "blur(10px)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle className="p-6 pb-2">
        <Box className="flex items-start justify-between">
          <Box className="flex flex-1 items-start gap-3">
            {getTypeIcon() && <Box className="mt-1">{getTypeIcon()}</Box>}
            <Box className="flex-1">
              <Typography
                variant="h6"
                className="font-sarabun-semibold text-gray-800"
                sx={{ fontSize: { xs: "1.125rem", md: "1.25rem" } }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  className="font-sarabun-regular mt-1 text-gray-600"
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              disabled={loading}
              size="small"
              className="text-gray-400 hover:text-gray-600"
            >
              <Close />
            </IconButton>
          )}
        </Box>
        {headerContent && <Box className="mt-4">{headerContent}</Box>}
      </DialogTitle>

      {/* Content */}
      <DialogContent className="px-6 py-4">
        <Box className={loading ? "pointer-events-none opacity-50" : ""}>
          {children}
        </Box>
      </DialogContent>

      {/* Actions */}
      {actions.length > 0 && (
        <>
          <Divider />
          <DialogActions className="p-6 pt-4">
            <Box className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "text"}
                  color={action.color || "primary"}
                  onClick={action.onClick}
                  disabled={action.disabled || loading}
                  autoFocus={action.autoFocus}
                  className="font-sarabun-medium"
                  fullWidth={isMobile}
                  sx={{ minWidth: { sm: 100 } }}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          </DialogActions>
        </>
      )}

      {/* Footer */}
      {footerContent && (
        <>
          <Divider />
          <Box className="px-6 py-4">{footerContent}</Box>
        </>
      )}
    </Dialog>
  );
};

/**
 * ConfirmModal Component
 *
 * Pre-configured confirmation modal for common actions
 */
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "warning" | "error" | "info";
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
  confirmLabel = "ยืนยัน Confirm",
  cancelLabel = "ยกเลิก Cancel",
  loading = false,
}) => {
  return (
    <ModalTemplate
      open={open}
      onClose={onClose}
      title={title}
      type={type}
      maxWidth="xs"
      loading={loading}
      actions={[
        {
          label: cancelLabel,
          onClick: onClose,
          variant: "outlined",
        },
        {
          label: confirmLabel,
          onClick: onConfirm,
          variant: "contained",
          color: type === "error" ? "error" : "primary",
          autoFocus: true,
        },
      ]}
    >
      <Typography className="font-sarabun-regular text-gray-700">
        {message}
      </Typography>
    </ModalTemplate>
  );
};

/**
 * FormModal Component
 *
 * Modal optimized for form inputs with submit/cancel actions
 */
interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  submitDisabled?: boolean;
}

export const FormModal: React.FC<FormModalProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  subtitle,
  children,
  submitLabel = "บันทึก Save",
  cancelLabel = "ยกเลิก Cancel",
  loading = false,
  submitDisabled = false,
}) => {
  return (
    <ModalTemplate
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth="md"
      loading={loading}
      actions={[
        {
          label: cancelLabel,
          onClick: onClose,
          variant: "outlined",
        },
        {
          label: submitLabel,
          onClick: onSubmit,
          variant: "contained",
          color: "primary",
          disabled: submitDisabled,
          autoFocus: true,
        },
      ]}
    >
      {children}
    </ModalTemplate>
  );
};

export default ModalTemplate;
