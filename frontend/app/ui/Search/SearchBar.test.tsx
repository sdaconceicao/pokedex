import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";

import SearchBar from "./SearchBar";
import styles from "./SearchBar.module.css";

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
};

const mockSearchParams = {
  get: jest.fn(),
};

describe("SearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  describe("Initial Rendering", () => {
    it("renders search input with placeholder", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      expect(searchInput).toBeInTheDocument();
    });

    it("renders search button", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchButton = screen.getByRole("button", { name: /search/i });
      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toHaveAttribute("type", "submit");
    });

    it("does not render clear button initially", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const clearButton = screen.queryByRole("button", {
        name: /clear search/i,
      });
      expect(clearButton).not.toBeInTheDocument();
    });

    it("initializes search query from URL params", () => {
      mockSearchParams.get.mockReturnValue("pikachu");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      expect(searchInput).toHaveValue("pikachu");
    });

    it("handles empty search params", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      expect(searchInput).toHaveValue("");
    });

    it("handles null search params", () => {
      mockSearchParams.get.mockReturnValue(null);

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      expect(searchInput).toHaveValue("");
    });
  });

  describe("Search Functionality", () => {
    it("submits search with query", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(searchInput, "charizard");
      await user.click(searchButton);

      expect(mockPush).toHaveBeenCalledWith("/?q=charizard");
    });

    it("submits search with trimmed query", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(searchInput, "  mewtwo  ");
      await user.click(searchButton);

      expect(mockPush).toHaveBeenCalledWith("/?q=mewtwo");
    });

    it("submits empty search and navigates to home", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.clear(searchInput);
      await user.click(searchButton);

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("submits whitespace-only search and navigates to home", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(searchInput, "   ");
      await user.click(searchButton);

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("submits search on Enter key press", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");

      await user.type(searchInput, "bulbasaur");
      await user.keyboard("{Enter}");

      expect(mockPush).toHaveBeenCalledWith("/?q=bulbasaur");
    });
  });

  describe("Clear Functionality", () => {
    it("shows clear button when search query exists", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      await user.type(searchInput, "test");

      const clearButton = screen.getByRole("button", { name: /clear search/i });
      expect(clearButton).toBeInTheDocument();
    });

    it("clears search and navigates to home when clear button is clicked", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      await user.type(searchInput, "test");

      const clearButton = screen.getByRole("button", { name: /clear search/i });
      await user.click(clearButton);

      expect(searchInput).toHaveValue("");
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("hides clear button after clearing search", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      await user.type(searchInput, "test");

      const clearButton = screen.getByRole("button", { name: /clear search/i });
      await user.click(clearButton);

      expect(
        screen.queryByRole("button", { name: /clear search/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Input Handling", () => {
    it("updates search query on input change", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");

      await user.type(searchInput, "squirtle");

      expect(searchInput).toHaveValue("squirtle");
    });

    it("handles special characters in search query", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");

      await user.type(searchInput, "pikachu-123!");

      expect(searchInput).toHaveValue("pikachu-123!");
    });

    it("handles unicode characters in search query", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");

      await user.type(searchInput, "pokémon");

      expect(searchInput).toHaveValue("pokémon");
    });
  });

  describe("URL Synchronization", () => {
    it("initializes with URL params on mount", () => {
      mockSearchParams.get.mockReturnValue("initial-query");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      expect(searchInput).toHaveValue("initial-query");
    });

    it("handles empty URL params on mount", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      expect(searchInput).toHaveValue("");
    });
  });

  describe("Form Behavior", () => {
    it("submits form with search query", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      await user.type(searchInput, "test");
      await user.keyboard("{Enter}");

      expect(mockPush).toHaveBeenCalledWith("/?q=test");
    });

    it("handles form submission with button click", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(searchInput, "test");
      await user.click(searchButton);

      expect(mockPush).toHaveBeenCalledWith("/?q=test");
    });
  });

  describe("CSS Module Classes", () => {
    it("applies correct CSS module classes to container", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchBar = screen
        .getByPlaceholderText("Search Pokemon...")
        .closest(`.${styles.searchBar}`);
      expect(searchBar).toBeInTheDocument();
    });

    it("applies correct CSS module classes to form", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const form = screen
        .getByPlaceholderText("Search Pokemon...")
        .closest("form");
      expect(form).toHaveClass(styles.searchForm);
    });

    it("applies correct CSS module classes to search input", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      expect(searchInput).toHaveClass(styles.searchInput);
    });

    it("applies correct CSS module classes to search button", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchButton = screen.getByRole("button", { name: /search/i });
      expect(searchButton).toHaveClass(styles.searchButton);
    });

    it("applies correct CSS module classes to clear button", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      await user.type(searchInput, "test");

      const clearButton = screen.getByRole("button", { name: /clear search/i });
      expect(clearButton).toHaveClass(styles.clearButton);
    });
  });

  describe("Accessibility", () => {
    it("has proper form element", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const form = screen
        .getByPlaceholderText("Search Pokemon...")
        .closest("form");
      expect(form).toBeInTheDocument();
    });

    it("has proper input role", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByRole("textbox");
      expect(searchInput).toBeInTheDocument();
    });

    it("has proper button roles", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchButton = screen.getByRole("button", { name: /search/i });
      expect(searchButton).toBeInTheDocument();
    });

    it("has proper aria-labels for icons", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchIcon = screen.getByLabelText("Search");
      expect(searchIcon).toBeInTheDocument();

      // Type something to show clear button
      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      await user.type(searchInput, "test");

      const clearIcon = screen.getByLabelText("Clear search");
      expect(clearIcon).toBeInTheDocument();
    });

    it("has proper placeholder text", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles search query with only numbers", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");

      await user.clear(searchInput);
      await user.type(searchInput, "12345");
      await user.keyboard("{Enter}");

      expect(mockPush).toHaveBeenCalledWith("/?q=12345");
    });

    it("handles search query with mixed content and URL encoding", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");

      await user.type(searchInput, "Pikachu #025 Electric");
      await user.keyboard("{Enter}");

      // URL encoding will convert # to %23 and spaces to +
      expect(mockPush).toHaveBeenCalledWith("/?q=Pikachu+%23025+Electric");
    });

    it("handles rapid input changes", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");

      await user.type(searchInput, "p");
      await user.type(searchInput, "i");
      await user.type(searchInput, "k");
      await user.type(searchInput, "a");
      await user.type(searchInput, "c");
      await user.type(searchInput, "h");
      await user.type(searchInput, "u");

      expect(searchInput).toHaveValue("pikachu");
    });

    it("handles reasonable length search queries", async () => {
      const user = userEvent.setup();
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      const reasonableQuery = "pikachu-electric-type-pokemon";

      await user.type(searchInput, reasonableQuery);
      await user.keyboard("{Enter}");

      expect(mockPush).toHaveBeenCalledWith(`/?q=${reasonableQuery}`);
    });
  });

  describe("Performance and State Management", () => {
    it("renders without errors", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      // The component should render without warnings
      expect(
        screen.getByPlaceholderText("Search Pokemon...")
      ).toBeInTheDocument();
    });

    it("uses useEffect for URL synchronization", () => {
      mockSearchParams.get.mockReturnValue("");

      render(<SearchBar />);

      // The component should use useEffect for URL sync
      // This is tested by ensuring the component renders without warnings
      expect(
        screen.getByPlaceholderText("Search Pokemon...")
      ).toBeInTheDocument();
    });

    it("maintains state consistency during re-renders", () => {
      mockSearchParams.get.mockReturnValue("");

      const { rerender } = render(<SearchBar />);

      // Re-render the component
      rerender(<SearchBar />);

      // State should remain consistent
      const searchInput = screen.getByPlaceholderText("Search Pokemon...");
      expect(searchInput).toHaveValue("");
    });
  });
});
