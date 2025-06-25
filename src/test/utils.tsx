import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ReactElement } from "react";

// Custom render function that includes router
export const renderWithRouter = (
  ui: ReactElement,
  options: RenderOptions & { initialEntries?: string[] } = {}
) => {
  const { initialEntries = ["/"], ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything from testing-library
export * from "@testing-library/react";
export { renderWithRouter as render };
