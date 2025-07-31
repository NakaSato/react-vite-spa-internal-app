import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../shared/contexts/AuthContext";
import { muiTheme } from "../shared/theme";
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
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <div className="mb-4 text-6xl text-red-500">💥</div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="mb-6 text-gray-600">
              An unexpected error occurred in the application. Please try
              refreshing the page or contact support if the issue persists.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
                <h3 className="mb-2 text-lg font-semibold text-red-900">
                  Error Details (Development Mode)
                </h3>
                <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-red-800">
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
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                }}
                className="rounded-lg bg-gray-600 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-700"
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
  return (
    <ErrorBoundary>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <div style={{ minHeight: "100vh" }}>
              <AppRoutes />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
