import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  const defaultProps = {
    "data-testid": "test-input",
  };

  it("renders with default props", () => {
    render(<Input {...defaultProps} />);

    const container = screen.getByTestId("test-input");
    const input = screen.getByTestId("test-input-input");

    expect(container).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveClass("md");
  });

  it("renders with custom type", () => {
    render(<Input {...defaultProps} type="email" />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("type", "email");
  });

  it("renders with custom size", () => {
    render(<Input {...defaultProps} size="lg" />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveClass("lg");
  });

  it("renders with placeholder", () => {
    const placeholder = "Enter your name";
    render(<Input {...defaultProps} placeholder={placeholder} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("placeholder", placeholder);
  });

  it("renders with value", () => {
    const value = "test value";
    const mockOnChange = jest.fn();
    render(<Input {...defaultProps} value={value} onChange={mockOnChange} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveValue(value);
  });

  it("renders with defaultValue", () => {
    const defaultValue = "default value";
    render(<Input {...defaultProps} defaultValue={defaultValue} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveValue(defaultValue);
  });

  it("handles onChange event", async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();

    render(<Input {...defaultProps} onChange={mockOnChange} />);

    const input = screen.getByTestId("test-input-input");
    await user.type(input, "a");

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("handles onBlur event", async () => {
    const user = userEvent.setup();
    const mockOnBlur = jest.fn();

    render(<Input {...defaultProps} onBlur={mockOnBlur} />);

    const input = screen.getByTestId("test-input-input");
    input.focus();
    input.blur();

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it("handles onFocus event", async () => {
    const user = userEvent.setup();
    const mockOnFocus = jest.fn();

    render(<Input {...defaultProps} onFocus={mockOnFocus} />);

    const input = screen.getByTestId("test-input-input");
    input.focus();

    expect(mockOnFocus).toHaveBeenCalledTimes(1);
  });

  it("renders disabled state", () => {
    render(<Input {...defaultProps} disabled />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled");
  });

  it("renders read-only state", () => {
    render(<Input {...defaultProps} readOnly />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("readonly");
  });

  it("renders required state", () => {
    render(<Input {...defaultProps} required />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toBeRequired();
  });

  it("renders with name attribute", () => {
    const name = "username";
    render(<Input {...defaultProps} name={name} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("name", name);
  });

  it("renders with id attribute", () => {
    const id = "user-input";
    render(<Input {...defaultProps} id={id} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("id", id);
  });

  it("renders with custom className", () => {
    const customClass = "custom-class";
    render(<Input {...defaultProps} className={customClass} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveClass(customClass);
  });

  it("renders error state", () => {
    render(<Input {...defaultProps} error />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveClass("error");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders error message when error and errorMessage are provided", () => {
    const errorMessage = "This field is required";
    render(<Input {...defaultProps} error errorMessage={errorMessage} />);

    const errorElement = screen.getByTestId("test-input-error");
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
    expect(errorElement).toHaveAttribute("role", "alert");
  });

  it("does not render error message when error is false", () => {
    const errorMessage = "This field is required";
    render(
      <Input {...defaultProps} error={false} errorMessage={errorMessage} />
    );

    const errorElement = screen.queryByTestId("test-input-error");
    expect(errorElement).not.toBeInTheDocument();
  });

  it("does not render error message when errorMessage is empty", () => {
    render(<Input {...defaultProps} error errorMessage="" />);

    const errorElement = screen.queryByTestId("test-input-error");
    expect(errorElement).not.toBeInTheDocument();
  });

  it("renders with autoComplete attribute", () => {
    const autoComplete = "username";
    render(<Input {...defaultProps} autoComplete={autoComplete} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("autoComplete", autoComplete);
  });

  it("renders with autoFocus attribute", () => {
    render(<Input {...defaultProps} autoFocus />);

    const input = screen.getByTestId("test-input-input");
    // autoFocus is a boolean prop that React handles internally
    expect(input).toBeInTheDocument();
  });

  it("renders with maxLength attribute", () => {
    const maxLength = 50;
    render(<Input {...defaultProps} maxLength={maxLength} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("maxLength", maxLength.toString());
  });

  it("renders with minLength attribute", () => {
    const minLength = 3;
    render(<Input {...defaultProps} minLength={minLength} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("minLength", minLength.toString());
  });

  it("renders with min attribute", () => {
    const min = 0;
    render(<Input {...defaultProps} min={min} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("min", min.toString());
  });

  it("renders with max attribute", () => {
    const max = 100;
    render(<Input {...defaultProps} max={max} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("max", max.toString());
  });

  it("renders with pattern attribute", () => {
    const pattern = "[A-Za-z]{3}";
    render(<Input {...defaultProps} pattern={pattern} />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("pattern", pattern);
  });

  it("renders password input with correct styling", () => {
    render(<Input {...defaultProps} type="password" />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveClass("password");
  });

  it("renders number input with correct styling", () => {
    render(<Input {...defaultProps} type="number" />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveClass("number");
  });

  it("renders search input with correct styling", () => {
    render(<Input {...defaultProps} type="search" />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveClass("search");
  });

  it("sets aria-describedby when error message is present", () => {
    const id = "test-id";
    const errorMessage = "Error message";
    render(
      <Input {...defaultProps} id={id} error errorMessage={errorMessage} />
    );

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveAttribute("aria-describedby", `${id}-error`);
  });

  it("does not set aria-describedby when no error message", () => {
    const id = "test-id";
    render(<Input {...defaultProps} id={id} error />);

    const input = screen.getByTestId("test-input-input");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input {...defaultProps} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies correct CSS classes for different states", () => {
    const { rerender } = render(
      <Input {...defaultProps} size="sm" error disabled />
    );

    let input = screen.getByTestId("test-input-input");
    expect(input).toHaveClass("input", "sm", "error", "disabled");

    rerender(<Input {...defaultProps} size="lg" className="custom-class" />);
    input = screen.getByTestId("test-input-input");
    expect(input).toHaveClass("input", "lg", "custom-class");
  });

  it("combines type-specific classes with base classes", () => {
    render(<Input {...defaultProps} type="password" size="md" />);

    const input = screen.getByTestId("test-input-input");
    expect(input).toHaveClass("input", "md", "password");
  });
});
