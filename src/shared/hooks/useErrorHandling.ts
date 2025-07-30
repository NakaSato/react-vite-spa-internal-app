import { useState, useCallback, createElement } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorHandler } from "../utils/errorHandler";

interface UseErrorHandlingOptions {
  onError?: (error: any) => void;
  redirectOn404?: boolean;
  redirectOnAuth?: boolean;
}

interface ErrorState {
  error: string | null;
  isLoading: boolean;
  hasError: boolean;
  errorType:
    | "network"
    | "auth"
    | "validation"
    | "api"
    | "runtime"
    | "unknown"
    | null;
}

export function useErrorHandling(options: UseErrorHandlingOptions = {}) {
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isLoading: false,
    hasError: false,
    errorType: null,
  });

  const handleError = useCallback(
    (error: any, context?: any) => {
      // Process error through enhanced error handler
      const enhancedError = ErrorHandler.processError(error, context);

      // Update error state
      setErrorState({
        error: enhancedError.userMessage,
        isLoading: false,
        hasError: true,
        errorType: enhancedError.type,
      });

      // Handle specific error types
      if (enhancedError.type === "auth") {
        if (options.redirectOnAuth) {
          navigate("/login");
          return;
        }
      }

      if (
        enhancedError.type === "api" &&
        enhancedError.message.includes("404")
      ) {
        if (options.redirectOn404) {
          navigate("/404");
          return;
        }
      }

      // Call custom error handler if provided
      if (options.onError) {
        options.onError(enhancedError);
      }
    },
    [navigate, options]
  );

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isLoading: false,
      hasError: false,
      errorType: null,
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setErrorState((prev) => ({
      ...prev,
      isLoading: loading,
      hasError: loading ? false : prev.hasError,
      error: loading ? null : prev.error,
    }));
  }, []);

  const executeWithErrorHandling = useCallback(
    async <T>(
      asyncFunction: () => Promise<T>,
      context?: any
    ): Promise<T | null> => {
      try {
        setLoading(true);
        const result = await asyncFunction();
        clearError();
        return result;
      } catch (error) {
        handleError(error, context);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError, clearError, setLoading]
  );

  // Error component generators
  const getErrorComponent = useCallback(() => {
    if (!errorState.hasError) return null;

    const commonProps = {
      message: errorState.error || "An error occurred",
      onRetry: clearError,
    };

    switch (errorState.errorType) {
      case "network":
        return "NetworkError";
      case "auth":
        return "Forbidden";
      case "api":
        if (
          errorState.error?.includes("404") ||
          errorState.error?.includes("not found")
        ) {
          return "NotFound";
        }
        if (
          errorState.error?.includes("500") ||
          errorState.error?.includes("server")
        ) {
          return "ServerError";
        }
        return "ErrorFallback";
      default:
        return "ErrorFallback";
    }
  }, [errorState, clearError]);

  const isRetryable = useCallback(() => {
    return (
      errorState.errorType === "network" ||
      errorState.errorType === "api" ||
      errorState.errorType === "runtime"
    );
  }, [errorState.errorType]);

  return {
    // State
    ...errorState,

    // Actions
    handleError,
    clearError,
    setLoading,
    executeWithErrorHandling,

    // Utilities
    getErrorComponent,
    isRetryable,

    // Error component props
    errorProps: {
      message: errorState.error || undefined,
      onRetry: isRetryable() ? clearError : undefined,
    },
  };
}

// Higher-order component for automatic error handling
export function withErrorHandling<P extends object>(
  Component: React.ComponentType<P>,
  options: UseErrorHandlingOptions = {}
) {
  return function ErrorHandledComponent(props: P) {
    const errorHandling = useErrorHandling(options);

    if (errorHandling.hasError) {
      const ErrorComponent = errorHandling.getErrorComponent();

      // Return a simple error state - actual error components should be rendered at route level
      return null;
    }

    return createElement(Component, props);
  };
}
