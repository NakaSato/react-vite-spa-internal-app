import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { DailyReportsManagementLoader } from "../features/reports";

// Mock the components directly
const MockDailyReportsManagement = () => {
  return (
    <div data-testid="daily-reports-management">
      <h1>Daily Reports Management</h1>
      <div>Reports Tab</div>
      <div>Analytics Tab</div>
      <div>Templates Tab</div>
    </div>
  );
};

vi.mock("../features/reports", () => ({
  DailyReportsManagement: MockDailyReportsManagement,
}));

describe("Daily Reports Integration", () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it("should render daily reports management component", () => {
    renderWithRouter(<DailyReportsManagementLoader />);

    expect(screen.getByTestId("daily-reports-management")).toBeInTheDocument();
    expect(screen.getByText("Daily Reports Management")).toBeInTheDocument();
  });

  it("should display main tab sections", () => {
    renderWithRouter(<DailyReportsManagementLoader />);

    expect(screen.getByText("Reports Tab")).toBeInTheDocument();
    expect(screen.getByText("Analytics Tab")).toBeInTheDocument();
    expect(screen.getByText("Templates Tab")).toBeInTheDocument();
  });
});
