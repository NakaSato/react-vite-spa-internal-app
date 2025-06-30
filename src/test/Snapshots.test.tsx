import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import AppRoutes from "../app/AppRoutes";

describe("Snapshot Tests", () => {
  it("Home component matches snapshot", () => {
    const { container } = render(<Home />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("About component matches snapshot", () => {
    const { container } = render(<About />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("AppRoutes with home route matches snapshot", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("AppRoutes with about route matches snapshot", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/about"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
