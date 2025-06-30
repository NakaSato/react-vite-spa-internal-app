import React from "react";
import { Link } from "react-router-dom";
import { NavbarApiStatus } from "../widgets";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Bottom Bar */}{" "}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className="text-blue-100 text-sm">
              © {currentYear} Solar Projects Management. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-blue-100 text-xs">
              <span>🌱</span>
              <span>Powered by renewable energy</span>
            </div>
            {/* API Status Indicator */}
            <NavbarApiStatus className="inline-flex" />
          </div>
          <div className="flex flex-wrap justify-center space-x-6">
            <a
              href="#"
              className="text-blue-200 hover:text-white text-sm transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-blue-200 hover:text-white text-sm transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-blue-200 hover:text-white text-sm transition-colors duration-200"
            >
              Cookie Policy
            </a>
            <a
              href="#"
              className="text-blue-200 hover:text-white text-sm transition-colors duration-200"
            >
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
