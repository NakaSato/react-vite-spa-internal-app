import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Home from "../pages/Home";
import About from "../pages/About";

describe("Component Styling Tests", () => {
  describe("Home Component Styling", () => {
    it("has correct Tailwind classes applied", () => {
      const { container } = render(<Home />);
      const mainDiv = container.firstChild as HTMLElement;

      expect(mainDiv).toHaveClass("flex");
      expect(mainDiv).toHaveClass("flex-col");
      expect(mainDiv).toHaveClass("items-center");
      expect(mainDiv).toHaveClass("justify-center");
      expect(mainDiv).toHaveClass("h-screen");
    });

    it("has correct heading styles", () => {
      const { container } = render(<Home />);
      const heading = container.querySelector("h1") as HTMLElement;

      expect(heading).toHaveClass("text-4xl");
      expect(heading).toHaveClass("font-bold");
    });

    it("has correct paragraph styles", () => {
      const { container } = render(<Home />);
      const paragraph = container.querySelector("p") as HTMLElement;

      expect(paragraph).toHaveClass("mt-4");
      expect(paragraph).toHaveClass("text-lg");
    });
  });

  describe("About Component Styling", () => {
    it("has correct Tailwind classes applied", () => {
      const { container } = render(<About />);
      const mainDiv = container.firstChild as HTMLElement;

      expect(mainDiv).toHaveClass("flex");
      expect(mainDiv).toHaveClass("flex-col");
      expect(mainDiv).toHaveClass("items-center");
      expect(mainDiv).toHaveClass("justify-center");
      expect(mainDiv).toHaveClass("h-screen");
    });

    it("has correct heading styles", () => {
      const { container } = render(<About />);
      const heading = container.querySelector("h1") as HTMLElement;

      expect(heading).toHaveClass("text-4xl");
      expect(heading).toHaveClass("font-bold");
    });

    it("has correct paragraph styles", () => {
      const { container } = render(<About />);
      const paragraph = container.querySelector("p") as HTMLElement;

      expect(paragraph).toHaveClass("mt-4");
      expect(paragraph).toHaveClass("text-lg");
    });
  });
});
