import { InputSize, InputType } from "./Input";

/**
 * Generates CSS classes for the input element
 * @param size - The size variant of the input
 * @param error - Whether the input has an error state
 * @param disabled - Whether the input is disabled
 * @param className - Additional custom classes
 * @returns An array of CSS class names
 */
export const generateInputClasses = (
  size: InputSize,
  error: boolean,
  disabled: boolean
): string[] => {
  return [
    "input",
    size,
    error ? "error" : "",
    disabled ? "disabled" : "",
  ].filter(Boolean);
};

/**
 * Generates CSS class for type-specific styling
 * @param type - The input type
 * @returns CSS class name for type-specific styling or empty string
 */
export const generateTypeClasses = (type: InputType): string => {
  switch (type) {
    case "password":
      return "password";
    case "number":
      return "number";
    case "search":
      return "search";
    default:
      return "";
  }
};

/**
 * Generates the error message ID for accessibility
 * @param id - The input element ID
 * @param errorMessage - The error message text
 * @returns The error message ID or undefined
 */
export const generateErrorMessageId = (
  id?: string,
  errorMessage?: string
): string | undefined => {
  if (!id || !errorMessage) {
    return undefined;
  }

  return `${id}-error`;
};

/**
 * Determines if the input should show an error message
 * @param error - Whether the input has an error state
 * @param errorMessage - The error message text
 * @returns True if error message should be displayed
 */
export const shouldShowErrorMessage = (
  error: boolean,
  errorMessage?: string
): boolean => {
  return error && Boolean(errorMessage);
};

/**
 * Validates input props for consistency
 * @param props - The input props to validate
 * @returns An object with validation results
 */
export const validateInputProps = (props: {
  type?: string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate number input constraints
  if (props.type === "number") {
    if (
      props.min !== undefined &&
      props.max !== undefined &&
      props.min > props.max
    ) {
      errors.push("min value cannot be greater than max value");
    }
  }

  // Validate length constraints
  if (
    props.minLength !== undefined &&
    props.maxLength !== undefined &&
    props.minLength > props.maxLength
  ) {
    errors.push("minLength cannot be greater than maxLength");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Determines if the input should be read-only
 * @param readOnly - Whether the input is explicitly read-only
 * @param disabled - Whether the input is disabled
 * @returns True if the input should be read-only
 */
export const isReadOnly = (readOnly: boolean, disabled: boolean): boolean => {
  return readOnly || disabled;
};
