import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Integration Tests", () => {
  it("renders without crashing", () => {
    render(<App />);
  });

  it("displays the default home page content", () => {
    render(<App />);
    expect(
      screen.getByText("Welcome to the React Vite TypeScript SPA")
    ).toBeInTheDocument();
    expect(
      screen.getByText("This is the main page of your application.")
    ).toBeInTheDocument();
  });

  it("contains the router setup", () => {
    render(<App />);
    // The App should render without throwing router errors
    const appContent = screen.getByText(
      "Welcome to the React Vite TypeScript SPA"
    );
    expect(appContent).toBeInTheDocument();
  });

  it("has the correct document structure", () => {
    render(<App />);
    const appDiv = document.querySelector(".App");
    expect(appDiv).toBeInTheDocument();
  });
});
