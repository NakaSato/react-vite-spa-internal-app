import { Link } from "react-router-dom";
import { NavbarApiStatus } from "../../widgets";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col space-y-4 sm:space-y-6">
          {/* Top Section - Copyright and Team */}
          <div className="flex flex-col items-center justify-between space-y-3 sm:flex-row sm:space-y-0">
            <div className="flex flex-col items-center space-y-2 text-center sm:flex-row sm:space-x-4 sm:space-y-0 sm:text-left">
              <p className="text-xs font-medium text-blue-100 sm:text-sm">
                © {currentYear} Solar Projects Management. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-xs text-blue-200">
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
          <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:justify-end sm:space-y-0">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <a
                href="#"
                className="flex min-h-[44px] items-center rounded px-2 py-1 text-xs text-blue-200 transition-colors duration-200 hover:bg-blue-500/20 hover:text-white sm:text-sm"
                style={{ touchAction: "manipulation" }}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="flex min-h-[44px] items-center rounded px-2 py-1 text-xs text-blue-200 transition-colors duration-200 hover:bg-blue-500/20 hover:text-white sm:text-sm"
                style={{ touchAction: "manipulation" }}
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="flex min-h-[44px] items-center rounded px-2 py-1 text-xs text-blue-200 transition-colors duration-200 hover:bg-blue-500/20 hover:text-white sm:text-sm"
                style={{ touchAction: "manipulation" }}
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="flex min-h-[44px] items-center rounded px-2 py-1 text-xs text-blue-200 transition-colors duration-200 hover:bg-blue-500/20 hover:text-white sm:text-sm"
                style={{ touchAction: "manipulation" }}
              >
                Security
              </a>
            </div>
          </div>

          {/* Mobile-only separator line */}
          <div className="block border-t border-blue-500/30 pt-3 sm:hidden">
            <div className="text-center">
              <p className="text-xs text-blue-200">
                Internal Construction Management System
              </p>
              <p className="mt-1 text-xs text-blue-300">
                ระบบจัดการโครงการก่อสร้างภายในองค์กร
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
