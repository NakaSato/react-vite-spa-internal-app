import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../shared/contexts/AuthContext";
import "./App.css";
import AppRoutes from "./AppRoutes";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: "bg-gray-800 text-white rounded-lg text-sm max-w-md",
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
                className: "bg-green-600 text-white",
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
                className: "bg-red-600 text-white",
              },
              loading: {
                iconTheme: {
                  primary: "#3b82f6",
                  secondary: "#fff",
                },
                className: "bg-blue-600 text-white",
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
