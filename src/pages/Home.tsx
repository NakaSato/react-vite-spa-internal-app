import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div
      className="flex flex-col items-center justify-center h-screen px-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/images/dashboard.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-6 mb-4">
            {/* PEA Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
              <img
                src="/images/pea_logo.png"
                alt="PEA Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* PWA Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
              <img
                src="/images/pwa_logo.png"
                alt="PWA Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          โครงการจัดการพลังงานไฟฟ้าจากระบบผลิตไฟฟ้าพลังงานแสงอาทิตย์
        </h1>

        {isAuthenticated ? (
          <div>
            <p className="text-xl text-gray-200 mb-8 drop-shadow">
              Hello {user?.fullName}! Ready to manage your solar projects?
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-white border-opacity-50 text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
