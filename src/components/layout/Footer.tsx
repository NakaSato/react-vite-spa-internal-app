import { Link } from "react-router-dom";
import { NavbarApiStatus } from "../../widgets";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 text-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Main Footer Content */}
        <div className="flex flex-col space-y-4 sm:space-y-6">
          {/* Top Section - Copyright and Team */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <p className="text-blue-100 text-xs sm:text-sm font-medium">
                © {currentYear} Solar Projects Management. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-blue-200 text-xs">
                <span className="hidden sm:inline">•</span>
                <span>Powered by GridTokenX Team</span>
              </div>
            </div>

            {/* API Status - Compact on mobile */}
            <div className="flex items-center">
              <NavbarApiStatus
                className="inline-flex"
                compact={true}
                showDetails={false}
              />
            </div>
          </div>

          {/* Bottom Section - Links */}
          <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center space-y-3 sm:space-y-0">
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
              <a
                href="#"
                className="text-blue-200 hover:text-white text-xs sm:text-sm transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-500/20 min-h-[44px] flex items-center"
                style={{ touchAction: "manipulation" }}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white text-xs sm:text-sm transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-500/20 min-h-[44px] flex items-center"
                style={{ touchAction: "manipulation" }}
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white text-xs sm:text-sm transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-500/20 min-h-[44px] flex items-center"
                style={{ touchAction: "manipulation" }}
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white text-xs sm:text-sm transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-500/20 min-h-[44px] flex items-center"
                style={{ touchAction: "manipulation" }}
              >
                Security
              </a>
            </div>
          </div>

          {/* Mobile-only separator line */}
          <div className="block sm:hidden border-t border-blue-500/30 pt-3">
            <div className="text-center">
              <p className="text-blue-200 text-xs">
                Internal Construction Management System
              </p>
              <p className="text-blue-300 text-xs mt-1">
                ระบบจัดการโครงการก่อสร้างภายในองค์กร
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
