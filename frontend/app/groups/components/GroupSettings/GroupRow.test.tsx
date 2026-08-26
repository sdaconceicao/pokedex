import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { useDeleteGroup, useUpdateGroup } from "@/hooks/useGroups";
import type { PokemonGroup } from "@/types";
import GroupRow from "./GroupRow";

vi.mock("@/hooks/useGroups", () => ({
  useUpdateGroup: vi.fn(),
  useDeleteGroup: vi.fn(),
}));

vi.mock("@/components/Modal", () => ({
  Modal: ({
    isOpen,
    title,
    footer,
    children,
    onClose,
  }: {
    isOpen: boolean;
    title?: string;
    footer?: ReactNode;
    children: ReactNode;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div role="dialog">
        {title && <h2>{title}</h2>}
        {children}
        {footer}
        {/* Stands in for a real dismissal the caller doesn't drive directly --
            Escape, the backdrop, lago's own close button -- so `onClose` gets
            exercised the same as the footer's own Cancel button. */}
        <button type="button" onClick={onClose}>
          Dismiss
        </button>
      </div>
    ) : null,
}));

const DEFAULT_GROUP: PokemonGroup = {
  id: "1",
  name: "Favorites",
  isDefault: true,
  pokemonCount: 3,
};
const OTHER_GROUP: PokemonGroup = {
  id: "2",
  name: "Team",
  isDefault: false,
  pokemonCount: 6,
};

const updateGroupAsync = vi.fn().mockResolvedValue(undefined);
const deleteGroupAsync = vi.fn().mockResolvedValue(undefined);

const setUpdateGroup = (overrides: Partial<ReturnType<typeof useUpdateGroup>> = {}) =>
  vi.mocked(useUpdateGroup).mockReturnValue({
    updateGroup: vi.fn(),
    updateGroupAsync,
    isUpdateGroupLoading: false,
    updateGroupError: null,
    ...overrides,
  } as unknown as ReturnType<typeof useUpdateGroup>);

const setDeleteGroup = (overrides: Partial<ReturnType<typeof useDeleteGroup>> = {}) =>
  vi.mocked(useDeleteGroup).mockReturnValue({
    deleteGroup: vi.fn(),
    deleteGroupAsync,
    isDeleteGroupLoading: false,
    deleteGroupError: null,
    ...overrides,
  } as unknown as ReturnType<typeof useDeleteGroup>);

beforeEach(() => {
  vi.clearAllMocks();
  updateGroupAsync.mockResolvedValue(undefined);
  deleteGroupAsync.mockResolvedValue(undefined);
  setUpdateGroup();
  setDeleteGroup();
});

describe("GroupRow", () => {
  describe("view mode", () => {
    it("shows the group's name and Pokemon count", () => {
      render(<GroupRow group={OTHER_GROUP} />);

      expect(screen.getByRole("heading", { name: "Team" })).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText(/Pokemon/)).toBeInTheDocument();
    });

    it("shows a Default tag only for the default group", () => {
      render(<GroupRow group={DEFAULT_GROUP} />);

      expect(screen.getByText("Default")).toBeInTheDocument();
    });

    it("does not show a Default tag for a non-default group", () => {
      render(<GroupRow group={OTHER_GROUP} />);

      expect(screen.queryByText("Default")).not.toBeInTheDocument();
    });

    it("links the row to the group's detail page", () => {
      render(<GroupRow group={OTHER_GROUP} />);

      expect(screen.getByRole("link", { name: "Team" })).toHaveAttribute("href", "/groups/2");
    });

    it("keeps the edit and delete buttons outside the link", () => {
      render(<GroupRow group={OTHER_GROUP} />);

      const link = screen.getByRole("link", { name: "Team" });
      const editButton = screen.getByRole("button", { name: "Edit Team" });
      const deleteButton = screen.getByRole("button", { name: "Delete Team" });

      expect(link).not.toContainElement(editButton);
      expect(link).not.toContainElement(deleteButton);
    });
  });

  describe("entering edit mode", () => {
    it("swaps the name for a textbox and shows save, cancel and the default checkbox", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Edit Team" }));

      expect(screen.getByRole("textbox", { name: "Team group name" })).toHaveValue("Team");
      expect(
        screen.getByRole("checkbox", { name: "Make this my default group" }),
      ).not.toBeChecked();
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("checks and disables the default checkbox for the already-default group", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={DEFAULT_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Edit Favorites" }));

      const checkbox = screen.queryByRole("checkbox", {
        name: "Make this my default group",
      });
      expect(checkbox).not.toBeInTheDocument();
    });

    it("leaves the checkbox enabled and unchecked for a non-default group", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Edit Team" }));

      const checkbox = screen.getByRole("checkbox", {
        name: "Make this my default group",
      });
      expect(checkbox).not.toBeChecked();
      expect(checkbox).toBeEnabled();
    });
  });

  describe("saving", () => {
    it("sends only the changed name", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Edit Team" }));
      const field = screen.getByRole("textbox", { name: "Team group name" });
      await user.clear(field);
      await user.type(field, "Squad");
      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(updateGroupAsync).toHaveBeenCalledWith({
        id: "2",
        body: { name: "Squad" },
      });
    });

    it("sends isDefault: true when promoting a different group to default", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Edit Team" }));
      await user.click(screen.getByRole("checkbox", { name: "Make this my default group" }));
      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(updateGroupAsync).toHaveBeenCalledWith({
        id: "2",
        body: { isDefault: true },
      });
    });

    it("returns to view mode after a successful save", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Edit Team" }));
      const field = screen.getByRole("textbox", { name: "Team group name" });
      await user.clear(field);
      await user.type(field, "Squad");
      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(await screen.findByRole("link", { name: "Team" })).toBeInTheDocument();
    });

    it("closes without calling the API when nothing changed", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Edit Team" }));
      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(await screen.findByRole("link", { name: "Team" })).toBeInTheDocument();
      expect(updateGroupAsync).not.toHaveBeenCalled();
    });

    it("blocks saving a blank name", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Edit Team" }));
      const field = screen.getByRole("textbox", { name: "Team group name" });
      await user.clear(field);

      expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(updateGroupAsync).not.toHaveBeenCalled();
      expect(screen.getByRole("textbox", { name: "Team group name" })).toBeInTheDocument();
    });

    it("surfaces an update error inline and stays in edit mode", async () => {
      const user = userEvent.setup();
      setUpdateGroup({
        updateGroupError: new Error("A group with that name already exists"),
      });
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Edit Team" }));

      expect(screen.getByText("A group with that name already exists")).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Team group name" })).toBeInTheDocument();
    });
  });

  describe("cancelling", () => {
    it("discards edits and returns to view mode", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Edit Team" }));
      const field = screen.getByRole("textbox", { name: "Team group name" });
      await user.clear(field);
      await user.type(field, "Squad");
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(updateGroupAsync).not.toHaveBeenCalled();
      expect(screen.getByRole("heading", { name: "Team" })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Edit Team" }));
      expect(screen.getByRole("textbox", { name: "Team group name" })).toHaveValue("Team");
    });
  });

  describe("deleting", () => {
    it("asks for confirmation before deleting", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Delete Team" }));

      expect(screen.getByRole("heading", { name: "Delete Team?" })).toBeInTheDocument();
      expect(screen.getByText(/also deletes its saved Pokémon/)).toBeInTheDocument();
      expect(deleteGroupAsync).not.toHaveBeenCalled();
    });

    it("deletes the group once confirmed", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Delete Team" }));
      await user.click(screen.getByRole("button", { name: "Delete" }));

      expect(deleteGroupAsync).toHaveBeenCalledWith("2");
    });

    it("does nothing when the confirmation is cancelled", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Delete Team" }));
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(deleteGroupAsync).not.toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does nothing when dismissed some other way (Escape, the backdrop)", async () => {
      const user = userEvent.setup();
      render(<GroupRow group={OTHER_GROUP} />);

      await user.click(screen.getByRole("button", { name: "Delete Team" }));
      await user.click(screen.getByRole("button", { name: "Dismiss" }));

      expect(deleteGroupAsync).not.toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
