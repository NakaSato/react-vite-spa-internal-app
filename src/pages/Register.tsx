import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import RegisterForm from "../components/RegisterForm";

const Register: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegistrationSuccess = () => {
    // Show success message and redirect to login
    alert("Registration successful! Please log in with your new account.");
    navigate("/login");
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
