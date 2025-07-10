import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { DailyReportsManagement } from "../features/reports";

// Mock the hooks module
vi.mock("../shared/hooks", async () => {
  const actual = await vi.importActual("../shared/hooks");
  return {
    ...actual,
    useDailyReports: () => ({
      reports: [],
      loading: false,
      error: null,
      pagination: null,
      realTimeUpdates: [],
      fetchReports: vi.fn(),
      createReport: vi.fn(),
      updateReport: vi.fn(),
      deleteReport: vi.fn(),
      approveReport: vi.fn(),
      rejectReport: vi.fn(),
      submitForApproval: vi.fn(),
      clearError: vi.fn(),
      clearUpdates: vi.fn(),
    }),
    useDailyReportAnalytics: () => ({
      analytics: null,
      fetchAnalytics: vi.fn(),
    }),
    useDailyReportBulkOperations: () => ({
      bulkApprove: vi.fn(),
      bulkReject: vi.fn(),
      exportReports: vi.fn(),
    }),
    useRole: () => ({
      isAdmin: true,
      isManager: true,
      isUser: true,
      isViewer: true,
      hasRole: vi.fn().mockReturnValue(true),
      roleName: "Admin",
    }),
  };
});

// Mock AuthContext
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockAuthValue = {
    user: {
      userId: "test-user",
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User",
      roleId: 1,
      roleName: "Admin",
      token: "mock-token",
    },
    token: "mock-token",
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn(),
  };

  return <div>{children}</div>;
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider>{component}</MockAuthProvider>
    </BrowserRouter>
  );
};

describe("Daily Reports Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the daily reports management component", async () => {
    renderWithProviders(<DailyReportsManagement />);

    await waitFor(() => {
      expect(screen.getByText("Daily Reports")).toBeInTheDocument();
      expect(
        screen.getByText("Manage and track daily work reports")
      ).toBeInTheDocument();
    });
  });

  it("displays the main navigation tabs", async () => {
    renderWithProviders(<DailyReportsManagement showAnalytics={true} />);

    await waitFor(() => {
      expect(screen.getByText("Reports")).toBeInTheDocument();
      expect(screen.getByText("Analytics")).toBeInTheDocument();
    });
  });

  it("shows create report button", async () => {
    renderWithProviders(<DailyReportsManagement />);

    await waitFor(() => {
      expect(screen.getByText("Create Report")).toBeInTheDocument();
    });
  });

  it("displays filters section", async () => {
    renderWithProviders(<DailyReportsManagement />);

    await waitFor(() => {
      expect(screen.getByText("Filters")).toBeInTheDocument();
      expect(screen.getByText("Approval Status")).toBeInTheDocument();
      expect(screen.getByText("Start Date")).toBeInTheDocument();
      expect(screen.getByText("End Date")).toBeInTheDocument();
    });
  });

  it("shows admin controls when user is admin", async () => {
    renderWithProviders(<DailyReportsManagement />);

    await waitFor(() => {
      expect(screen.getByText("Export Reports")).toBeInTheDocument();
    });
  });

  it("displays empty state when no reports", async () => {
    renderWithProviders(<DailyReportsManagement />);

    await waitFor(() => {
      expect(screen.getByText("No daily reports found")).toBeInTheDocument();
    });
  });
});
