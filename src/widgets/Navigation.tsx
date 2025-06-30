import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { LogoutButton } from "../features/auth";
import { TabType } from "../shared/types/project";
import { ApiStatus } from "../widgets";

interface NavigationProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  showTabs?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  showTabs = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show tabs only on dashboard page
  const shouldShowTabs =
    showTabs && location.pathname === "/dashboard" && isAuthenticated;

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "projects", name: "Projects", icon: "🏗️" },
    { id: "construction", name: "Construction", icon: "⚡" },
    { id: "reports", name: "Reports", icon: "📈" },
    { id: "masterplan", name: "Master Plan", icon: "🎯" },
    { id: "management", name: "Management", icon: "📋" },
  ] as const;

  return (
    <>
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl font-bold hover:text-blue-200">
                INTERNAL CONSTRUCTION
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium">
                        {user?.fullName}
                      </div>
                      <div className="text-xs text-blue-200">
                        {user?.roleName}
                      </div>
                    </div>
                  </div>
                  <LogoutButton
                    variant="secondary"
                    size="sm"
                    redirectTo="/"
                    className="bg-blue-800 hover:bg-blue-900"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Tabs */}
      {shouldShowTabs && (
        <div className="bg-white shadow-xl border-b border-gray-200">
          <div className="container mx-auto">
            <div className="flex justify-between items-center px-8 py-4">
              <nav className="-mb-px flex space-x-12">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      onTabChange && onTabChange(tab.id as TabType)
                    }
                    className={`py-6 px-4 border-b-4 font-bold text-lg transition-all duration-300 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
                    }`}
                  >
                    <span className="mr-3 text-2xl">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
              <ApiStatus />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
