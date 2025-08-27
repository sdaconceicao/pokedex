import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  const defaultProps = {
    children: "Click me",
  };

  describe("Button Variants", () => {
    it("renders with primary variant by default", () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("primary");
    });

    it("renders with secondary variant", () => {
      render(<Button {...defaultProps} variant="secondary" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("secondary");
    });

    it("renders with outline variant", () => {
      render(<Button {...defaultProps} variant="outline" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("outline");
    });

    it("renders with ghost variant", () => {
      render(<Button {...defaultProps} variant="ghost" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("ghost");
    });

    it("renders with danger variant", () => {
      render(<Button {...defaultProps} variant="danger" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("danger");
    });
  });

  describe("Button Sizes", () => {
    it("renders with medium size by default", () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("md");
    });

    it("renders with small size", () => {
      render(<Button {...defaultProps} size="sm" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("sm");
    });

    it("renders with large size", () => {
      render(<Button {...defaultProps} size="lg" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("lg");
    });
  });

  describe("Button States", () => {
    it("renders enabled by default", () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });

    it("renders disabled when specified", () => {
      render(<Button {...defaultProps} disabled />);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled");
    });

    it("applies disabled styles when disabled", () => {
      render(<Button {...defaultProps} disabled />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("disabled");
    });
  });

  describe("Button Interactions", () => {
    it("calls onClick when clicked", async () => {
      const mockOnClick = jest.fn();
      const user = userEvent.setup();

      render(<Button {...defaultProps} onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const mockOnClick = jest.fn();
      const user = userEvent.setup();

      render(<Button {...defaultProps} onClick={mockOnClick} disabled />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe("Button Types", () => {
    it("renders as button by default", () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("renders as submit button", () => {
      render(<Button {...defaultProps} type="submit" />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("renders as reset button", () => {
      render(<Button {...defaultProps} type="reset" />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "reset");
    });
  });

  describe("Link Variant", () => {
    it("renders as link when as='link' is specified", () => {
      render(<Button {...defaultProps} as="link" href="/test" />);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });

    it("applies button styles to link", () => {
      render(<Button {...defaultProps} as="link" href="/test" />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("button");
    });
  });

  describe("Custom Classes", () => {
    it("applies custom className", () => {
      render(<Button {...defaultProps} className="custom-class" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("combines custom className with default classes", () => {
      render(<Button {...defaultProps} className="custom-class" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button", "primary", "md", "custom-class");
    });
  });

  describe("CSS Module Classes", () => {
    it("applies correct CSS module classes", () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button");
      expect(button).toHaveClass("primary");
      expect(button).toHaveClass("md");
    });

    it("applies variant and size classes correctly", () => {
      render(<Button {...defaultProps} variant="secondary" size="lg" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("button");
      expect(button).toHaveClass("secondary");
      expect(button).toHaveClass("lg");
    });
  });

  describe("Test IDs", () => {
    it("applies default test ID for button", () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByTestId("button");
      expect(button).toBeInTheDocument();
    });

    it("applies default test ID for link", () => {
      render(<Button {...defaultProps} as="link" href="/test" />);

      const link = screen.getByTestId("button-link");
      expect(link).toBeInTheDocument();
    });

    it("applies custom test ID when provided", () => {
      render(<Button {...defaultProps} data-testid="custom-button" />);

      const button = screen.getByTestId("custom-button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("renders button with proper role", () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("renders link with proper role when as='link'", () => {
      render(<Button {...defaultProps} as="link" href="/test" />);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("maintains disabled state for screen readers", () => {
      render(<Button {...defaultProps} disabled />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });
  });
});
