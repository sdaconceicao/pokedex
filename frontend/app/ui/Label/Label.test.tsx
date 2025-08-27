import { render, screen } from "@testing-library/react";
import { Label } from "./Label";

describe("Label", () => {
  const defaultProps = {
    children: "Test Label",
  };

  it("renders with children", () => {
    render(<Label {...defaultProps} />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders with htmlFor attribute", () => {
    render(<Label {...defaultProps} htmlFor="test-input" />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for", "test-input");
  });

  it("renders required indicator when required is true", () => {
    render(<Label {...defaultProps} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("*")).toHaveClass("required");
  });

  it("does not render required indicator when required is false", () => {
    render(<Label {...defaultProps} required={false} />);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("does not render required indicator by default", () => {
    render(<Label {...defaultProps} />);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Label {...defaultProps} className="custom-class" />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("custom-class");
  });

  it("applies default CSS classes", () => {
    render(<Label {...defaultProps} />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("label");
  });

  it("combines default and custom CSS classes", () => {
    render(<Label {...defaultProps} className="custom-class" />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("label", "custom-class");
  });

  it("renders as a label element", () => {
    render(<Label {...defaultProps} />);
    const label = screen.getByText("Test Label");
    expect(label.tagName).toBe("LABEL");
  });

  it("handles empty children", () => {
    render(<Label>{""}</Label>);
    const label = document.querySelector("label");
    expect(label).toBeInTheDocument();
    expect(label?.tagName).toBe("LABEL");
  });

  it("handles complex children", () => {
    const complexChildren = (
      <>
        <span>Complex</span> <strong>Content</strong>
      </>
    );
    render(<Label>{complexChildren}</Label>);
    expect(screen.getByText("Complex")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
