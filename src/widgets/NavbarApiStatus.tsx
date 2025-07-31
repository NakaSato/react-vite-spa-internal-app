import { useState, useEffect } from "react";
import { apiClient } from "../shared/utils/apiClient";
import { useAuth } from "../shared/hooks/useAuth";

interface NavbarApiStatusProps {
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

const NavbarApiStatus = ({
  className = "",
  showDetails = true,
  compact = false,
}: NavbarApiStatusProps) => {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isManualCheck, setIsManualCheck] = useState(false);
  const { isAuthenticated } = useAuth();

  const checkApiStatus = async (manual = false) => {
    try {
      setStatus("checking");
      setIsManualCheck(manual);
      const startTime = Date.now();
      await apiClient.healthCheck();
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setStatus("online");
      setLastCheck(new Date());
    } catch (error) {
      setStatus("offline");
      setResponseTime(null);
      setLastCheck(new Date());
    } finally {
      setTimeout(() => setIsManualCheck(false), 1000);
    }
  };

  useEffect(() => {
    checkApiStatus();
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 shadow-emerald-500/20";
      case "offline":
        return "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 shadow-red-500/20";
      case "checking":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 shadow-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20 shadow-slate-500/20";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "online":
        return (
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
            <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75"></div>
          </div>
        );
      case "offline":
        return (
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-400"></div>
        );
      case "checking":
        return (
          <div className="h-2 w-2 animate-bounce rounded-full bg-amber-400"></div>
        );
      default:
        return <div className="h-2 w-2 rounded-full bg-slate-400"></div>;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "API Connected";
      case "offline":
        return "API Disconnected";
      case "checking":
        return isManualCheck ? "Refreshing..." : "Connecting...";
      default:
        return "Unknown Status";
    }
  };

  const getResponseTimeColor = () => {
    if (!responseTime) return "text-slate-400";
    if (responseTime < 100) return "text-emerald-400";
    if (responseTime < 300) return "text-amber-400";
    return "text-red-400";
  };

  const getResponseTimeIndicator = () => {
    if (!responseTime) return "";
    if (responseTime < 100) return "🚀";
    if (responseTime < 300) return "⚡";
    return "🐌";
  };

  const getTooltip = () => {
    let tooltip = `Backend API Status: ${getStatusText()}`;

    if (status === "online") {
      tooltip += `\n✅ Connection established`;
      if (responseTime) {
        tooltip += `\n${getResponseTimeIndicator()} Response time: ${responseTime}ms`;
      }
      if (isAuthenticated) {
        tooltip += `\n🔐 Authenticated session active`;
      }
    } else if (status === "offline") {
      tooltip += `\n❌ Cannot connect to backend`;
      tooltip += `\n🔧 Check if API server is running`;
    } else if (status === "checking") {
      tooltip += `\n🔄 Testing connection...`;
    }

    if (lastCheck) {
      tooltip += `\n🕒 Last checked: ${lastCheck.toLocaleTimeString()}`;
    }

    tooltip += `\n\n💡 Click to refresh status`;

    return tooltip;
  };

  const handleClick = () => {
    // Manual refresh on click
    checkApiStatus(true);
  };

  if (compact) {
    return (
      <button
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${getStatusColor()} ${className}`}
        title={getTooltip()}
        onClick={handleClick}
        aria-label={`API Status: ${getStatusText()}`}
      >
        {getStatusIcon()}
      </button>
    );
  }

  return (
    <button
      className={`group inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${getStatusColor()} ${className}`}
      title={getTooltip()}
      onClick={handleClick}
      aria-label={`API Status: ${getStatusText()}`}
    >
      <div className="mr-2 flex items-center justify-center">
        {getStatusIcon()}
      </div>

      {showDetails && (
        <>
          <span className="hidden font-semibold sm:inline">
            {getStatusText()}
          </span>

          {status === "online" && responseTime && (
            <div className="ml-2 hidden items-center text-xs md:flex">
              <span className="mx-1 opacity-50">•</span>
              <span className={`font-mono ${getResponseTimeColor()}`}>
                {responseTime}ms
              </span>
              <span className="ml-1">{getResponseTimeIndicator()}</span>
            </div>
          )}

          {isAuthenticated && status === "online" && (
            <div className="ml-2 hidden items-center lg:flex">
              <span className="mx-1 opacity-50">•</span>
              <span className="text-xs opacity-75">🔐 Auth</span>
            </div>
          )}
        </>
      )}

      <div className="ml-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    </button>
  );
};

export default NavbarApiStatus;
