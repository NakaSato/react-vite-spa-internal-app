/**
 * Enhanced Error Handling Utilities
 *
 * Provides comprehensive error handling, logging, and user-friendly error messages
 * for the Solar Projects application.
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  projectId?: string;
  timestamp?: string;
  userAgent?: string;
  url?: string;
  additional?: Record<string, any>;
}

export interface EnhancedError {
  id: string;
  type: "network" | "api" | "auth" | "validation" | "runtime" | "unknown";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  originalError?: Error | unknown;
  context?: ErrorContext;
  userMessage: string;
  suggestions: string[];
  isRetryable: boolean;
  timestamp: string;
}

export class ErrorHandler {
  private static errorCount = 0;

  /**
   * Generate a unique error ID
   */
  private static generateErrorId(): string {
    this.errorCount++;
    return `ERR_${Date.now()}_${this.errorCount}`;
  }

  /**
   * Categorize error based on message content
   */
  private static categorizeError(error: Error | unknown): {
    type: EnhancedError["type"];
    severity: EnhancedError["severity"];
    isRetryable: boolean;
  } {
    const message =
      error instanceof Error
        ? error.message.toLowerCase()
        : String(error).toLowerCase();

    // Network errors
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("connection") ||
      message.includes("econnrefused") ||
      message.includes("timeout")
    ) {
      return { type: "network", severity: "medium", isRetryable: true };
    }

    // Authentication errors
    if (
      message.includes("401") ||
      message.includes("unauthorized") ||
      message.includes("authentication") ||
      message.includes("token")
    ) {
      return { type: "auth", severity: "high", isRetryable: false };
    }

    // Authorization errors
    if (
      message.includes("403") ||
      message.includes("forbidden") ||
      message.includes("access denied") ||
      message.includes("permission")
    ) {
      return { type: "auth", severity: "high", isRetryable: false };
    }

    // API errors
    if (
      message.includes("404") ||
      message.includes("not found") ||
      message.includes("400") ||
      message.includes("bad request") ||
      message.includes("500") ||
      message.includes("server error") ||
      message.includes("503") ||
      message.includes("service unavailable")
    ) {
      return {
        type: "api",
        severity: "medium",
        isRetryable: message.includes("500") || message.includes("503"),
      };
    }

    // Validation errors
    if (
      message.includes("validation") ||
      message.includes("invalid") ||
      message.includes("required") ||
      message.includes("format")
    ) {
      return { type: "validation", severity: "low", isRetryable: false };
    }

    // Runtime errors
    if (
      message.includes("undefined") ||
      message.includes("null") ||
      message.includes("reference") ||
      message.includes("syntax")
    ) {
      return { type: "runtime", severity: "high", isRetryable: false };
    }

    return { type: "unknown", severity: "medium", isRetryable: true };
  }

  /**
   * Generate user-friendly error message and suggestions
   */
  private static generateUserMessage(
    error: Error | unknown,
    type: EnhancedError["type"]
  ): {
    userMessage: string;
    suggestions: string[];
  } {
    const message = error instanceof Error ? error.message : String(error);

    switch (type) {
      case "network":
        return {
          userMessage:
            "Connection problem detected. Please check your internet connection.",
          suggestions: [
            "Check your internet connection",
            "Try refreshing the page",
            "Verify the API server is running",
            "Contact IT support if the problem persists",
          ],
        };

      case "auth":
        if (message.includes("401") || message.includes("unauthorized")) {
          return {
            userMessage: "Authentication required. Please log in to continue.",
            suggestions: [
              "Log out and log back in",
              "Clear browser cookies and cache",
              "Contact your administrator if the issue persists",
            ],
          };
        } else {
          return {
            userMessage:
              "Access denied. You don't have permission for this action.",
            suggestions: [
              "Contact your manager or administrator",
              "Verify your role has the required permissions",
              "Check if you have access to this specific resource",
            ],
          };
        }

      case "api":
        if (message.includes("404") || message.includes("not found")) {
          return {
            userMessage: "The requested resource could not be found.",
            suggestions: [
              "Verify the resource ID is correct",
              "Check if the resource still exists",
              "Try searching for the resource in the dashboard",
              "Contact support if you believe this is an error",
            ],
          };
        } else if (
          message.includes("500") ||
          message.includes("server error")
        ) {
          return {
            userMessage:
              "Server error encountered. Our team has been notified.",
            suggestions: [
              "Try again in a few minutes",
              "Contact support if the issue persists",
              "Check the status page for known issues",
            ],
          };
        } else {
          return {
            userMessage: "API request failed. Please try again.",
            suggestions: [
              "Verify your input is correct",
              "Try the request again",
              "Contact support if the problem continues",
            ],
          };
        }

      case "validation":
        return {
          userMessage: "Invalid input detected. Please check your data.",
          suggestions: [
            "Review all required fields",
            "Check data format requirements",
            "Ensure all values are within acceptable ranges",
            "Refer to the help documentation",
          ],
        };

      case "runtime":
        return {
          userMessage: "An unexpected application error occurred.",
          suggestions: [
            "Refresh the page and try again",
            "Clear your browser cache",
            "Try using a different browser",
            "Contact technical support",
          ],
        };

      default:
        return {
          userMessage: "An unexpected error occurred. Please try again.",
          suggestions: [
            "Refresh the page",
            "Try the action again",
            "Contact support if the issue persists",
          ],
        };
    }
  }

  /**
   * Enhanced error processing with categorization and user guidance
   */
  static processError(
    error: Error | unknown,
    context?: ErrorContext
  ): EnhancedError {
    const { type, severity, isRetryable } = this.categorizeError(error);
    const { userMessage, suggestions } = this.generateUserMessage(error, type);

    const enhancedError: EnhancedError = {
      id: this.generateErrorId(),
      type,
      severity,
      message: error instanceof Error ? error.message : String(error),
      originalError: error,
      context: {
        timestamp: new Date().toISOString(),
        userAgent:
          typeof window !== "undefined"
            ? window.navigator.userAgent
            : "unknown",
        url: typeof window !== "undefined" ? window.location.href : "unknown",
        ...context,
      },
      userMessage,
      suggestions,
      isRetryable,
      timestamp: new Date().toISOString(),
    };

    // Log the error with enhanced context
    this.logError(enhancedError);

    return enhancedError;
  }

  /**
   * Comprehensive error logging
   */
  private static logError(enhancedError: EnhancedError): void {
    const logLevel =
      enhancedError.severity === "critical"
        ? "error"
        : enhancedError.severity === "high"
          ? "error"
          : enhancedError.severity === "medium"
            ? "warn"
            : "info";

    console.group(
      `🚨 Enhanced Error [${
        enhancedError.id
      }] - ${enhancedError.type.toUpperCase()}`
    );
    console[logLevel]("Error Details:", {
      id: enhancedError.id,
      type: enhancedError.type,
      severity: enhancedError.severity,
      message: enhancedError.message,
      userMessage: enhancedError.userMessage,
      isRetryable: enhancedError.isRetryable,
      timestamp: enhancedError.timestamp,
    });

    if (enhancedError.context) {
      console[logLevel]("Context:", enhancedError.context);
    }

    if (
      enhancedError.originalError instanceof Error &&
      enhancedError.originalError.stack
    ) {
      console[logLevel]("Stack Trace:", enhancedError.originalError.stack);
    }

    console[logLevel]("Suggestions:", enhancedError.suggestions);
    console.groupEnd();

    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD && enhancedError.severity === "critical") {
      // Send to error reporting service
      this.reportError(enhancedError);
    }
  }

  /**
   * Report critical errors to monitoring service
   */
  private static reportError(enhancedError: EnhancedError): void {
    // Implementation for error reporting service (e.g., Sentry, LogRocket, etc.)
    console.info(
      "📡 Reporting critical error to monitoring service:",
      enhancedError.id
    );

    // Example implementation:
    // errorReportingService.report({
    //   errorId: enhancedError.id,
    //   message: enhancedError.message,
    //   context: enhancedError.context,
    //   severity: enhancedError.severity
    // });
  }

  /**
   * Create a retry mechanism for retryable errors
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
    context?: ErrorContext
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        const enhancedError = this.processError(error, {
          ...context,
          additional: { attempt, maxRetries },
        });

        if (!enhancedError.isRetryable || attempt === maxRetries) {
          throw lastError;
        }

        console.warn(
          `🔄 Retry attempt ${attempt}/${maxRetries} after ${delay}ms delay`
        );
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  }
}

/**
 * Hook for using enhanced error handling in React components
 */
export const useErrorHandler = () => {
  const handleError = (error: Error | unknown, context?: ErrorContext) => {
    return ErrorHandler.processError(error, context);
  };

  const handleErrorWithRetry = async <T>(
    operation: () => Promise<T>,
    maxRetries?: number,
    delay?: number,
    context?: ErrorContext
  ): Promise<T> => {
    return ErrorHandler.withRetry(operation, maxRetries, delay, context);
  };

  return {
    handleError,
    handleErrorWithRetry,
  };
};

export default ErrorHandler;
