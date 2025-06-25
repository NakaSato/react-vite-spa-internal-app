import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "../pages/About";

describe("About Component", () => {
  it("renders without crashing", () => {
    render(<About />);
  });

  it("displays the correct heading", () => {
    render(<About />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("About Us");
  });

  it("displays the correct description", () => {
    render(<About />);
    const description = screen.getByText(
      "This is the about page of your application."
    );
    expect(description).toBeInTheDocument();
  });

  it("has the correct CSS classes for layout", () => {
    render(<About />);
    const container = screen.getByText("About Us").closest("div");
    expect(container).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "h-screen"
    );
  });

  it("has the correct CSS classes for heading", () => {
    render(<About />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("text-4xl", "font-bold");
  });

  it("has the correct CSS classes for description", () => {
    render(<About />);
    const description = screen.getByText(
      "This is the about page of your application."
    );
    expect(description).toHaveClass("mt-4", "text-lg");
  });
});
