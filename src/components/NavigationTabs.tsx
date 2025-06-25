import React from "react";
import { TabType } from "../types/project";
import ApiStatus from "./ApiStatus";

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "projects", name: "Projects", icon: "🏗️" },
    { id: "construction", name: "Construction", icon: "⚡" },
    { id: "reports", name: "Reports", icon: "📈" },
  ] as const;

  return (
    <div className="bg-white shadow-xl rounded-2xl mb-8 border border-gray-200">
      <div className="border-b border-gray-200">
        <div className="flex justify-between items-center px-8 py-4">
          <nav className="-mb-px flex space-x-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as TabType)}
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
  );
};

export default NavigationTabs;
