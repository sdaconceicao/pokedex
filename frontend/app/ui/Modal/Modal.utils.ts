/**
 * Pure utility functions for Modal component
 */

/**
 * Checks if a click event occurred on the backdrop (outside the dialog content)
 */
export const isBackdropClick = (
  e: React.MouseEvent<HTMLDialogElement>
): boolean => {
  const rect = e.currentTarget.getBoundingClientRect();

  return !(
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  );
};

/**
 * Determines if the modal should be rendered
 */
export const shouldRenderModal = (isOpen: boolean): boolean => isOpen;
