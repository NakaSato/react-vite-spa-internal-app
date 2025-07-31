import { Component, ReactNode, ErrorInfo } from "react";
import ErrorFallback from "../pages/core/ErrorFallback";
import ServerError from "../pages/core/ServerError";
import NetworkError from "../pages/core/NetworkError";
import { ErrorHandler } from "../shared/utils/errorHandler";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Enhanced error processing
    const enhancedError = ErrorHandler.processError(error, {
      component: "ErrorBoundary",
      action: "component_error",
      additional: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      },
    });

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log enhanced error
    console.group("🛡️ Error Boundary Caught Error");
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.error("Enhanced Error:", enhancedError);
    console.groupEnd();

    // Report to monitoring service in production
    if (import.meta.env.PROD) {
      // Here you would integrate with your error monitoring service
      // Example: Sentry, LogRocket, DataDog, etc.
      this.reportError(enhancedError, errorInfo);
    }
  }

  private reportError(enhancedError: any, errorInfo: ErrorInfo) {
    // Example error reporting implementation
    try {
      // You would replace this with your actual error reporting service
      const errorReport = {
        errorId: enhancedError.id,
        message: enhancedError.message,
        severity: enhancedError.severity,
        timestamp: enhancedError.timestamp,
        userAgent: navigator.userAgent,
        url: window.location.href,
        componentStack: errorInfo.componentStack,
        stack: this.state.error?.stack,
      };

      console.info("📡 Would report error to monitoring service:", errorReport);

      // Example service calls:
      // Sentry.captureException(this.state.error, { extra: errorReport });
      // LogRocket.captureException(this.state.error);
      // DataDog.logger.error("Error Boundary Error", errorReport);
    } catch (reportingError) {
      console.error("Failed to report error:", reportingError);
    }
  }

  private resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
    });
  };

  private determineErrorType(): "network" | "server" | "general" {
    if (!this.state.error) return "general";

    const message = this.state.error.message.toLowerCase();

    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("connection") ||
      message.includes("timeout")
    ) {
      return "network";
    }

    if (
      message.includes("500") ||
      message.includes("server") ||
      message.includes("internal")
    ) {
      return "server";
    }

    return "general";
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Determine error type and render appropriate page
      const errorType = this.determineErrorType();

      switch (errorType) {
        case "network":
          return (
            <NetworkError
              message={this.state.error?.message}
              onRetry={this.resetError}
            />
          );

        case "server":
          return (
            <ServerError
              error={this.state.error?.message}
              onRetry={this.resetError}
            />
          );

        default:
          return (
            <ErrorFallback
              error={this.state.error}
              resetError={this.resetError}
            >
              {/* Additional error context for development */}
              {import.meta.env.DEV && this.state.errorInfo && (
                <div className="rounded-md bg-gray-100 p-4">
                  <h4 className="mb-2 font-medium text-gray-800">
                    Component Stack:
                  </h4>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-gray-600">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </ErrorFallback>
          );
      }
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
