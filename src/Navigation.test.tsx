import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Link } from "react-router-dom";
import AppRoutes from "./AppRoutes";

// Create a test component with navigation
const TestAppWithNavigation = () => {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <AppRoutes />
    </BrowserRouter>
  );
};

describe("Navigation Integration Tests", () => {
  it("can navigate between pages", async () => {
    const user = userEvent.setup();
    render(<TestAppWithNavigation />);

    // Should start on home page
    expect(
      screen.getByText("Welcome to the React Vite TypeScript SPA")
    ).toBeInTheDocument();

    // Click about link
    const aboutLink = screen.getByRole("link", { name: /about/i });
    await user.click(aboutLink);

    // Should now show about page
    expect(screen.getByText("About Us")).toBeInTheDocument();

    // Click home link
    const homeLink = screen.getByRole("link", { name: /home/i });
    await user.click(homeLink);

    // Should be back on home page
    expect(
      screen.getByText("Welcome to the React Vite TypeScript SPA")
    ).toBeInTheDocument();
  });
});
