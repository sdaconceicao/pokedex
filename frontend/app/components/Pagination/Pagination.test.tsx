import { fireEvent, render, screen } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination smoke", () => {
  it("renders lago pagination and calls onPageChange", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={2} onPageChange={onPageChange} totalItems={151} itemsPerPage={20} />,
    );

    expect(screen.getByText("Showing 21-40 of 151 Pokemon")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Pokemon pagination" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Go to page 3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("renders nothing for a single page", () => {
    const { container } = render(
      <Pagination currentPage={1} onPageChange={vi.fn()} totalItems={5} itemsPerPage={20} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
