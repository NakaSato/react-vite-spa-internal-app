import { useState, useEffect, Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../shared/contexts/AuthContext";
import "./App.css";
import AppRoutes from "./AppRoutes";

// Global error boundary component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Global Error Boundary caught an error:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-4">
            <div className="text-red-500 text-6xl mb-4">💥</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred in the application. Please try
              refreshing the page or contact support if the issue persists.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Error Details (Development Mode)
                </h3>
                <pre className="text-sm text-red-800 overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      {"\n\nStack Trace:\n"}
                      {this.state.error.stack}
                    </>
                  )}
                </pre>
              </div>
            )}

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                🔙 Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const [toastPosition, setToastPosition] = useState<
    "top-right" | "top-center" | "bottom-right"
  >("top-right");

  // Detect mobile for better toast positioning
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setToastPosition(isMobile ? "top-center" : "top-right");
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
            <Toaster
              position={toastPosition}
              containerClassName="!top-4 !right-4 !left-4"
              containerStyle={{
                zIndex: 9999,
              }}
              toastOptions={{
                duration: 4000,
                style: {
                  background: "rgba(17, 24, 39, 0.95)",
                  color: "#f9fafb",
                  border: "1px solid rgba(75, 85, 99, 0.3)",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "500",
                  maxWidth: "400px",
                  backdropFilter: "blur(10px)",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  padding: "16px 20px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                },
                success: {
                  duration: 3500,
                  style: {
                    background:
                      "linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)",
                    color: "#ffffff",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    boxShadow:
                      "0 20px 25px -5px rgba(16, 185, 129, 0.2), 0 10px 10px -5px rgba(16, 185, 129, 0.1)",
                    animation: "toast-enter 0.3s ease-out",
                  },
                  iconTheme: {
                    primary: "#ffffff",
                    secondary: "#10b981",
                  },
                },
                error: {
                  duration: 6000,
                  style: {
                    background:
                      "linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)",
                    color: "#ffffff",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    boxShadow:
                      "0 20px 25px -5px rgba(239, 68, 68, 0.2), 0 10px 10px -5px rgba(239, 68, 68, 0.1)",
                    animation: "toast-enter 0.3s ease-out",
                  },
                  iconTheme: {
                    primary: "#ffffff",
                    secondary: "#ef4444",
                  },
                },
                loading: {
                  duration: Infinity,
                  style: {
                    background:
                      "linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)",
                    color: "#ffffff",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    boxShadow:
                      "0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.1)",
                    animation: "toast-enter 0.3s ease-out, pulse 2s infinite",
                  },
                  iconTheme: {
                    primary: "#ffffff",
                    secondary: "#3b82f6",
                  },
                },
                blank: {
                  style: {
                    background: "rgba(30, 41, 59, 0.95)",
                    color: "#f1f5f9",
                    border: "1px solid rgba(71, 85, 105, 0.3)",
                    animation: "toast-enter 0.3s ease-out",
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
