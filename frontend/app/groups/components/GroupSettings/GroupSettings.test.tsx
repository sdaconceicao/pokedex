import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteGroup, useGroups, useUpdateGroup } from "@/hooks/useGroups";
import { useAuthModal } from "@/providers/AuthModalProvider";
import type { PokemonGroup, User } from "@/types";
import GroupSettings from "./GroupSettings";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/useGroups", () => ({
  useGroups: vi.fn(),
  useUpdateGroup: vi.fn(),
  useDeleteGroup: vi.fn(),
}));

vi.mock("@/providers/AuthModalProvider", () => ({
  useAuthModal: vi.fn(),
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

const USER: User = {
  id: "1",
  email: "ash@pallet.town",
  firstName: "Ash",
  lastName: "Ketchum",
  username: "ash",
};

const GROUPS: PokemonGroup[] = [
  { id: "1", name: "Favorites", isDefault: true, pokemonCount: 3 },
  { id: "2", name: "Team", isDefault: false, pokemonCount: 6 },
];

const openSignIn = vi.fn();
const updateGroupAsync = vi.fn().mockResolvedValue(undefined);
const deleteGroupAsync = vi.fn().mockResolvedValue(undefined);

const setAuth = (overrides: Partial<ReturnType<typeof useAuth>> = {}) =>
  vi.mocked(useAuth).mockReturnValue({
    user: USER,
    isLoading: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAuth>);

const setGroups = (overrides: Partial<ReturnType<typeof useGroups>> = {}) =>
  vi.mocked(useGroups).mockReturnValue({
    groups: GROUPS,
    defaultGroup: GROUPS[0],
    isLoading: false,
    error: null,
    ...overrides,
  } as unknown as ReturnType<typeof useGroups>);

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
  vi.mocked(useAuthModal).mockReturnValue({
    openSignIn,
    openSignUp: vi.fn(),
    isAuthModalOpen: false,
  });
  setAuth();
  setGroups();
  setUpdateGroup();
  setDeleteGroup();
});

describe("GroupSettings", () => {
  it("shows the intro line explaining the default list", () => {
    render(<GroupSettings />);

    expect(screen.getByText(/preselected whenever you add a Pokémon/)).toBeInTheDocument();
  });

  describe("loading", () => {
    it("shows a skeleton while auth is resolving", () => {
      setAuth({ user: undefined, isLoading: true });

      render(<GroupSettings />);

      expect(screen.getByLabelText("Loading your lists")).toBeInTheDocument();
    });

    it("shows a skeleton while the groups query is in flight", () => {
      setGroups({ groups: undefined, isLoading: true });

      render(<GroupSettings />);

      expect(screen.getByLabelText("Loading your lists")).toBeInTheDocument();
    });
  });

  describe("signed out", () => {
    it("prompts to sign in", async () => {
      const user = userEvent.setup();
      setAuth({ user: undefined, isLoading: false });

      render(<GroupSettings />);
      expect(screen.getByText("Sign in to manage your Pokémon lists.")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Sign In" }));
      expect(openSignIn).toHaveBeenCalledTimes(1);
    });
  });

  describe("error", () => {
    it("surfaces the groups query's error", () => {
      setGroups({ groups: undefined, error: new Error("network down") });

      render(<GroupSettings />);

      expect(screen.getByRole("status")).toHaveTextContent("network down");
    });
  });

  describe("empty", () => {
    it("explains how to create the first list", () => {
      setGroups({ groups: [] });

      render(<GroupSettings />);

      expect(screen.getByText(/create your first list/)).toBeInTheDocument();
    });
  });

  describe("populated", () => {
    it("renders one row per group with its current name", () => {
      render(<GroupSettings />);

      expect(screen.getByRole("textbox", { name: "Favorites list name" })).toHaveValue("Favorites");
      expect(screen.getByRole("textbox", { name: "Team list name" })).toHaveValue("Team");
    });

    it("preselects the default group's radio", () => {
      render(<GroupSettings />);

      expect(screen.getByRole("radio", { name: "Make Favorites the default list" })).toBeChecked();
      expect(screen.getByRole("radio", { name: "Make Team the default list" })).not.toBeChecked();
    });

    describe("renaming", () => {
      it("commits a changed name on blur", async () => {
        const user = userEvent.setup();
        render(<GroupSettings />);

        const field = screen.getByRole("textbox", { name: "Favorites list name" });
        await user.clear(field);
        await user.type(field, "Squad");
        await user.tab();

        expect(updateGroupAsync).toHaveBeenCalledWith({
          id: "1",
          body: { name: "Squad" },
        });
      });

      it("commits a changed name on submit", async () => {
        const user = userEvent.setup();
        render(<GroupSettings />);

        const field = screen.getByRole("textbox", { name: "Favorites list name" });
        await user.clear(field);
        await user.type(field, "Squad{Enter}");

        expect(updateGroupAsync).toHaveBeenCalledWith({
          id: "1",
          body: { name: "Squad" },
        });
      });

      it("does not commit when the name is unchanged", async () => {
        const user = userEvent.setup();
        render(<GroupSettings />);

        const field = screen.getByRole("textbox", { name: "Favorites list name" });
        await user.click(field);
        await user.tab();

        expect(updateGroupAsync).not.toHaveBeenCalled();
      });

      it("does not commit a blank name", async () => {
        const user = userEvent.setup();
        render(<GroupSettings />);

        const field = screen.getByRole("textbox", { name: "Favorites list name" });
        await user.clear(field);
        await user.tab();

        expect(updateGroupAsync).not.toHaveBeenCalled();
      });

      it("surfaces a rename error inline on the field", () => {
        setUpdateGroup({ updateGroupError: new Error("A list with that name already exists") });

        render(<GroupSettings />);

        const field = screen.getByRole("textbox", { name: "Favorites list name" });
        const form = field.closest("form") as HTMLElement;
        expect(within(form).getByText("A list with that name already exists")).toBeInTheDocument();
      });
    });

    describe("choosing the default", () => {
      it("sets the picked group as default", async () => {
        const user = userEvent.setup();
        render(<GroupSettings />);

        await user.click(screen.getByRole("radio", { name: "Make Team the default list" }));

        expect(updateGroupAsync).toHaveBeenCalledWith({
          id: "2",
          body: { isDefault: true },
        });
      });
    });

    describe("deleting", () => {
      it("asks for confirmation before deleting", async () => {
        const user = userEvent.setup();
        render(<GroupSettings />);

        await user.click(screen.getByRole("button", { name: "Delete Favorites" }));

        expect(screen.getByRole("heading", { name: "Delete Favorites?" })).toBeInTheDocument();
        expect(screen.getByText(/also deletes its saved Pokémon/)).toBeInTheDocument();
        expect(deleteGroupAsync).not.toHaveBeenCalled();
      });

      it("deletes the group once confirmed", async () => {
        const user = userEvent.setup();
        render(<GroupSettings />);

        await user.click(screen.getByRole("button", { name: "Delete Favorites" }));
        await user.click(screen.getByRole("button", { name: "Delete" }));

        expect(deleteGroupAsync).toHaveBeenCalledWith("1");
      });

      it("does nothing when the confirmation is cancelled", async () => {
        const user = userEvent.setup();
        render(<GroupSettings />);

        await user.click(screen.getByRole("button", { name: "Delete Favorites" }));
        await user.click(screen.getByRole("button", { name: "Cancel" }));

        expect(deleteGroupAsync).not.toHaveBeenCalled();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      it("does nothing when dismissed some other way (Escape, the backdrop)", async () => {
        const user = userEvent.setup();
        render(<GroupSettings />);

        await user.click(screen.getByRole("button", { name: "Delete Favorites" }));
        await user.click(screen.getByRole("button", { name: "Dismiss" }));

        expect(deleteGroupAsync).not.toHaveBeenCalled();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });
});
