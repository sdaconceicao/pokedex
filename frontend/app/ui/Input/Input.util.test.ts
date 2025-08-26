import {
  generateInputClasses,
  generateTypeClasses,
  generateErrorMessageId,
  shouldShowErrorMessage,
  validateInputProps,
  isReadOnly,
} from "./Input.utils";

describe("Input Utils", () => {
  describe("generateInputClasses", () => {
    it("generates base classes correctly", () => {
      const result = generateInputClasses("md", false, false);
      expect(result).toEqual(["input", "md"]);
    });

    it("includes error class when error is true", () => {
      const result = generateInputClasses("md", true, false);
      expect(result).toEqual(["input", "md", "error"]);
    });

    it("includes disabled class when disabled is true", () => {
      const result = generateInputClasses("md", false, true);
      expect(result).toEqual(["input", "md", "disabled"]);
    });

    it("combines multiple states correctly", () => {
      const result = generateInputClasses("lg", true, true);
      expect(result).toEqual(["input", "lg", "error", "disabled"]);
    });

    it("handles different sizes", () => {
      const smallResult = generateInputClasses("sm", false, false);
      const largeResult = generateInputClasses("lg", false, false);

      expect(smallResult).toEqual(["input", "sm"]);
      expect(largeResult).toEqual(["input", "lg"]);
    });
  });

  describe("generateTypeClasses", () => {
    it("returns empty string for text type", () => {
      const result = generateTypeClasses("text");
      expect(result).toBe("");
    });

    it("returns password class for password type", () => {
      const result = generateTypeClasses("password");
      expect(result).toBe("password");
    });

    it("returns number class for number type", () => {
      const result = generateTypeClasses("number");
      expect(result).toBe("number");
    });

    it("returns search class for search type", () => {
      const result = generateTypeClasses("search");
      expect(result).toBe("search");
    });

    it("returns empty string for email type", () => {
      const result = generateTypeClasses("email");
      expect(result).toBe("");
    });

    it("returns empty string for tel type", () => {
      const result = generateTypeClasses("tel");
      expect(result).toBe("");
    });

    it("returns empty string for url type", () => {
      const result = generateTypeClasses("url");
      expect(result).toBe("");
    });
  });

  describe("generateErrorMessageId", () => {
    it("returns undefined when id is not provided", () => {
      const result = generateErrorMessageId(undefined, "error message");
      expect(result).toBeUndefined();
    });

    it("returns undefined when errorMessage is not provided", () => {
      const result = generateErrorMessageId("input-id", undefined);
      expect(result).toBeUndefined();
    });

    it("returns undefined when both are not provided", () => {
      const result = generateErrorMessageId(undefined, undefined);
      expect(result).toBeUndefined();
    });

    it("returns correct error message id when both are provided", () => {
      const result = generateErrorMessageId("input-id", "error message");
      expect(result).toBe("input-id-error");
    });

    it("handles empty string error message", () => {
      const result = generateErrorMessageId("input-id", "");
      expect(result).toBeUndefined();
    });
  });

  describe("shouldShowErrorMessage", () => {
    it("returns false when error is false", () => {
      const result = shouldShowErrorMessage(false, "error message");
      expect(result).toBe(false);
    });

    it("returns false when errorMessage is undefined", () => {
      const result = shouldShowErrorMessage(true, undefined);
      expect(result).toBe(false);
    });

    it("returns false when errorMessage is empty string", () => {
      const result = shouldShowErrorMessage(true, "");
      expect(result).toBe(false);
    });

    it("returns true when both error and errorMessage are truthy", () => {
      const result = shouldShowErrorMessage(true, "error message");
      expect(result).toBe(true);
    });

    it("returns false when error is false even with errorMessage", () => {
      const result = shouldShowErrorMessage(false, "error message");
      expect(result).toBe(false);
    });
  });

  describe("validateInputProps", () => {
    it("returns valid for empty props", () => {
      const result = validateInputProps({});
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("returns valid for props without constraints", () => {
      const result = validateInputProps({ type: "text" });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("returns valid for valid number constraints", () => {
      const result = validateInputProps({
        type: "number",
        min: 0,
        max: 100,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("returns valid for valid length constraints", () => {
      const result = validateInputProps({
        minLength: 3,
        maxLength: 50,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("returns invalid when min is greater than max for number type", () => {
      const result = validateInputProps({
        type: "number",
        min: 100,
        max: 0,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "min value cannot be greater than max value"
      );
    });

    it("returns invalid when minLength is greater than maxLength", () => {
      const result = validateInputProps({
        minLength: 50,
        maxLength: 3,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "minLength cannot be greater than maxLength"
      );
    });

    it("returns valid when min is undefined", () => {
      const result = validateInputProps({
        type: "number",
        max: 100,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("returns valid when max is undefined", () => {
      const result = validateInputProps({
        type: "number",
        min: 0,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("returns valid when minLength is undefined", () => {
      const result = validateInputProps({
        maxLength: 50,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("returns valid when maxLength is undefined", () => {
      const result = validateInputProps({
        minLength: 3,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("handles multiple validation errors", () => {
      const result = validateInputProps({
        type: "number",
        min: 100,
        max: 0,
        minLength: 50,
        maxLength: 3,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain(
        "min value cannot be greater than max value"
      );
      expect(result.errors).toContain(
        "minLength cannot be greater than maxLength"
      );
    });
  });

  describe("isReadOnly", () => {
    it("returns true when readOnly is true", () => {
      const result = isReadOnly(true, false);
      expect(result).toBe(true);
    });

    it("returns true when disabled is true", () => {
      const result = isReadOnly(false, true);
      expect(result).toBe(true);
    });

    it("returns true when both are true", () => {
      const result = isReadOnly(true, true);
      expect(result).toBe(true);
    });

    it("returns false when both are false", () => {
      const result = isReadOnly(false, false);
      expect(result).toBe(false);
    });
  });
});
