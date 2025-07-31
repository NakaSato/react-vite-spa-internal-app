import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { LoginForm } from "@features/auth";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);

  // Check if coming from successful registration
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const registrationSuccess = params.get("registered");
    if (registrationSuccess === "true") {
      setMessage(
        "Registration successful! Please log in with your new account."
      );
    }
  }, [location]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center">
      {message && (
        <div className="mb-2 mt-4 w-full max-w-md rounded border border-green-300 bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
}
