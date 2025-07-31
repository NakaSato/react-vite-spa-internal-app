import { Component, ErrorInfo, ReactNode } from "react";
import { ErrorHandler } from "../shared/utils/errorHandler";
import { ErrorLayout } from "../templates/layouts/ErrorLayout";

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

      // Determine error type and render appropriate template
      const errorType = this.determineErrorType();

      switch (errorType) {
        case "network":
          return (
            <ErrorLayout
              errorCode="NETWORK_ERROR"
              title="เครือข่ายมีปัญหา - Network Connection Issue"
              message="ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต | Unable to connect to the server. Please check your internet connection and try again."
              icon="🌐"
              customActions={[
                {
                  label: "ลองใหม่ / Retry",
                  onClick: this.resetError,
                  variant: "contained",
                  color: "primary",
                },
                {
                  label: "รีเฟรชหน้า / Refresh Page",
                  onClick: () => window.location.reload(),
                  variant: "outlined",
                  color: "secondary",
                },
              ]}
            />
          );

        case "server":
          return (
            <ErrorLayout
              errorCode="500"
              title="เซิร์ฟเวอร์มีปัญหา - Internal Server Error"
              message="เซิร์ฟเวอร์กำลังมีปัญหาชั่วคราว กรุณาลองใหม่อีกครั้งในภายหลัง | The server is experiencing issues. Please try again later or contact support if the problem persists."
              icon="🔧"
              customActions={[
                {
                  label: "ลองใหม่ / Try Again",
                  onClick: this.resetError,
                  variant: "contained",
                  color: "primary",
                },
                {
                  label: "กลับหน้าหลัก / Go Home",
                  onClick: () => (window.location.href = "/"),
                  variant: "outlined",
                  color: "secondary",
                },
              ]}
            />
          );

        default:
          return (
            <ErrorLayout
              errorCode={this.state.errorId || "UNKNOWN_ERROR"}
              title="เกิดข้อผิดพลาด - Application Error"
              message="แอปพลิเคชันพบข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่หรือติดต่อทีมสนับสนุน | An unexpected error occurred in the application. Please try again or contact support if the problem continues."
              icon="⚠️"
              customActions={[
                {
                  label: "ลองใหม่ / Try Again",
                  onClick: this.resetError,
                  variant: "contained",
                  color: "primary",
                },
                {
                  label: "รีโหลดหน้า / Reload Page",
                  onClick: () => window.location.reload(),
                  variant: "outlined",
                  color: "secondary",
                },
              ]}
              showSupport
            >
              {/* Development error details */}
              {import.meta.env.DEV && this.state.errorInfo && (
                <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="font-sarabun-semibold mb-3 text-gray-800">
                    🔍 Development Debug Info
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-sarabun-medium mb-1 text-sm text-gray-700">
                        Error Message:
                      </h5>
                      <pre className="overflow-x-auto rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">
                        {this.state.error?.message}
                      </pre>
                    </div>
                    <div>
                      <h5 className="font-sarabun-medium mb-1 text-sm text-gray-700">
                        Component Stack:
                      </h5>
                      <pre className="overflow-x-auto whitespace-pre-wrap rounded border border-blue-200 bg-blue-50 p-2 text-xs text-blue-800">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                    {this.state.error?.stack && (
                      <div>
                        <h5 className="font-sarabun-medium mb-1 text-sm text-gray-700">
                          Stack Trace:
                        </h5>
                        <pre className="max-h-40 overflow-x-auto whitespace-pre-wrap rounded border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-800">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </ErrorLayout>
          );
      }
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
