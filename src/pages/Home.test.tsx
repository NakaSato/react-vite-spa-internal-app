import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../pages/Home";

describe("Home Component", () => {
  it("renders without crashing", () => {
    render(<Home />);
  });

  it("displays the correct heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      "Welcome to the React Vite TypeScript SPA"
    );
  });

  it("displays the correct description", () => {
    render(<Home />);
    const description = screen.getByText(
      "This is the main page of your application."
    );
    expect(description).toBeInTheDocument();
  });

  it("has the correct CSS classes for layout", () => {
    render(<Home />);
    const container = screen
      .getByText("Welcome to the React Vite TypeScript SPA")
      .closest("div");
    expect(container).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "h-screen"
    );
  });

  it("has the correct CSS classes for heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("text-4xl", "font-bold");
  });

  it("has the correct CSS classes for description", () => {
    render(<Home />);
    const description = screen.getByText(
      "This is the main page of your application."
    );
    expect(description).toHaveClass("mt-4", "text-lg");
  });
});
