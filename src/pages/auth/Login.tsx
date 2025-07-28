import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { LoginForm } from "../features/auth";

const Login: React.FC = () => {
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
        <div className="mt-4 mb-2 w-full max-w-md bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Login;
