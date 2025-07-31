import toast from "react-hot-toast";

// Custom toast utility with predefined styles and messages
export const showToast = {
  success: (message: string, options?: any) => {
    return toast.success(message, {
      duration: 3000,
      ...options,
    });
  },

  error: (message: string, options?: any) => {
    return toast.error(message, {
      duration: 5000,
      ...options,
    });
  },

  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      ...options,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: any
  ) => {
    return toast.promise(promise, messages, {
      ...options,
    });
  },

  dismiss: (toastId?: string) => {
    return toast.dismiss(toastId);
  },

  // Auth specific toasts
  auth: {
    loginSuccess: (userName?: string) =>
      toast.success(
        userName ? `Welcome back, ${userName}!` : "Login successful!",
        {
          duration: 3000,
          icon: "👋",
        }
      ),

    loginError: (message?: string) =>
      toast.error(message || "Login failed. Please try again.", {
        duration: 5000,
        icon: "❌",
      }),

    logoutSuccess: () =>
      toast.success("Logged out successfully", {
        duration: 2000,
        icon: "👋",
      }),

    registrationSuccess: () =>
      toast.success("Account created successfully!", {
        duration: 4000,
        icon: "🎉",
      }),

    registrationError: (message?: string) =>
      toast.error(message || "Registration failed. Please try again.", {
        duration: 5000,
        icon: "❌",
      }),
  },

  // Project specific toasts
  project: {
    created: (projectName?: string) =>
      toast.success(
        projectName
          ? `Project "${projectName}" created successfully!`
          : "Project created successfully!",
        {
          duration: 4000,
          icon: "🚀",
        }
      ),

    updated: (projectName?: string) =>
      toast.success(
        projectName
          ? `Project "${projectName}" updated successfully!`
          : "Project updated successfully!",
        {
          duration: 3000,
          icon: "✅",
        }
      ),

    deleted: (projectName?: string) =>
      toast.success(
        projectName
          ? `Project "${projectName}" deleted successfully!`
          : "Project deleted successfully!",
        {
          duration: 3000,
          icon: "🗑️",
        }
      ),

    error: (message?: string) =>
      toast.error(message || "Project operation failed. Please try again.", {
        duration: 5000,
        icon: "❌",
      }),
  },

  // Report specific toasts
  report: {
    generated: (reportType?: string) =>
      toast.success(
        reportType
          ? `${reportType} report generated successfully!`
          : "Report generated successfully!",
        {
          duration: 4000,
          icon: "📊",
        }
      ),

    saved: () =>
      toast.success("Report saved successfully!", {
        duration: 3000,
        icon: "💾",
      }),

    exported: (format?: string) =>
      toast.success(
        format
          ? `Report exported as ${format.toUpperCase()} successfully!`
          : "Report exported successfully!",
        {
          duration: 3000,
          icon: "📄",
        }
      ),

    error: (message?: string) =>
      toast.error(message || "Report operation failed. Please try again.", {
        duration: 5000,
        icon: "❌",
      }),
  },

  // Generic operations
  operation: {
    saveSuccess: () =>
      toast.success("Changes saved successfully!", {
        duration: 3000,
        icon: "💾",
      }),

    deleteSuccess: (itemName?: string) =>
      toast.success(
        itemName
          ? `${itemName} deleted successfully!`
          : "Item deleted successfully!",
        {
          duration: 3000,
          icon: "🗑️",
        }
      ),

    updateSuccess: (itemName?: string) =>
      toast.success(
        itemName
          ? `${itemName} updated successfully!`
          : "Updated successfully!",
        {
          duration: 3000,
          icon: "✅",
        }
      ),

    copySuccess: () =>
      toast.success("Copied to clipboard!", {
        duration: 2000,
        icon: "📋",
      }),

    uploadSuccess: (fileName?: string) =>
      toast.success(
        fileName
          ? `File "${fileName}" uploaded successfully!`
          : "File uploaded successfully!",
        {
          duration: 3000,
          icon: "📁",
        }
      ),

    networkError: () =>
      toast.error("Network error. Please check your connection.", {
        duration: 5000,
        icon: "🌐",
      }),

    permissionError: () =>
      toast.error("You do not have permission to perform this action.", {
        duration: 5000,
        icon: "🔒",
      }),
  },
};

export default showToast;
