import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { RegisterForm } from "@features/auth";

const Register: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegistrationSuccess = () => {
    // Redirect to login with success message in query params
    navigate("/login?registered=true");
  };

  const handleSwitchToLogin = () => {
    navigate("/login");
  };

  return (
    <RegisterForm
      onSuccess={handleRegistrationSuccess}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
};

export default Register;
