import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

// Helper function to render with router at specific route
const renderWithRouter = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppRoutes />
    </MemoryRouter>
  );
};

describe("AppRoutes", () => {
  it("renders without crashing", () => {
    renderWithRouter();
  });

  it("renders the home page by default", () => {
    renderWithRouter(["/"]);
    expect(
      screen.getByText("Welcome to the React Vite TypeScript SPA")
    ).toBeInTheDocument();
    expect(
      screen.getByText("This is the main page of your application.")
    ).toBeInTheDocument();
  });

  it("renders the about page when navigating to /about", () => {
    renderWithRouter(["/about"]);
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(
      screen.getByText("This is the about page of your application.")
    ).toBeInTheDocument();
  });

  it("contains the main app structure", () => {
    renderWithRouter();
    const appDiv = document.querySelector(".App");
    expect(appDiv).toBeInTheDocument();
  });

  it("renders home route correctly", () => {
    renderWithRouter(["/"]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Welcome to the React Vite TypeScript SPA"
    );
  });

  it("renders about route correctly", () => {
    renderWithRouter(["/about"]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "About Us"
    );
  });

  it("renders 404 page for unknown routes", () => {
    renderWithRouter(["/unknown-route"]);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  it("renders 404 page for deeply nested unknown routes", () => {
    renderWithRouter(["/some/deep/unknown/path"]);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });
});
