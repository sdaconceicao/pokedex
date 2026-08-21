import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { groupsApi } from "@/lib/groups";
import type { GroupMembership, GroupPokemon, PokemonGroup } from "@/types/groups";
import {
  useAddPokemonToGroup,
  useCreateGroup,
  useDeleteGroup,
  useGroupMemberships,
  useGroupPokemon,
  useGroups,
  useRemovePokemonFromGroup,
  useUpdateGroup,
} from "./useGroups";

vi.mock("@/lib/groups", () => ({
  groupsApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    listPokemon: vi.fn(),
    addPokemon: vi.fn(),
    removePokemon: vi.fn(),
    listMemberships: vi.fn(),
  },
}));

const TOKEN = "test-token";
const USER = { id: "1", email: "test@test.com", username: "test" };

const GROUPS: PokemonGroup[] = [
  { id: "1", name: "Favorites", isDefault: true, pokemonCount: 2 },
  { id: "2", name: "Team", isDefault: false, pokemonCount: 6 },
];

const GROUP_POKEMON: GroupPokemon = { pokemonId: "25", speciesId: "25" };

function warmClient() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(["auth", "token"], TOKEN);
  queryClient.setQueryData(["auth", "user", TOKEN], USER);
  return queryClient;
}

function coldClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function wrapperFor(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  localStorage.setItem("access_token", TOKEN);
  vi.mocked(groupsApi.list).mockResolvedValue(GROUPS);
  vi.mocked(groupsApi.listPokemon).mockResolvedValue([]);
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("useGroups", () => {
  it("does not fetch while signed out", () => {
    renderHook(() => useGroups(), { wrapper: wrapperFor(coldClient()) });

    expect(groupsApi.list).not.toHaveBeenCalled();
  });

  it("returns the groups and the derived default group once signed in", async () => {
    const { result } = renderHook(() => useGroups(), { wrapper: wrapperFor(warmClient()) });

    await waitFor(() => expect(result.current.groups).toEqual(GROUPS));
    expect(groupsApi.list).toHaveBeenCalledWith(TOKEN);
    expect(result.current.defaultGroup).toEqual(GROUPS[0]);
  });

  it("has no default group when none is marked default", async () => {
    vi.mocked(groupsApi.list).mockResolvedValue([{ ...GROUPS[1], isDefault: false }]);

    const { result } = renderHook(() => useGroups(), { wrapper: wrapperFor(warmClient()) });

    await waitFor(() => expect(result.current.groups).toBeDefined());
    expect(result.current.defaultGroup).toBeUndefined();
  });

  it("surfaces an error from the list call", async () => {
    vi.mocked(groupsApi.list).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useGroups(), { wrapper: wrapperFor(warmClient()) });

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
  });
});

describe("useGroupMemberships", () => {
  const MEMBERSHIPS: GroupMembership[] = [
    { groupId: "1", pokemonId: "25" },
    { groupId: "2", pokemonId: "25" },
  ];

  it("does not fetch while signed out", () => {
    renderHook(() => useGroupMemberships(), { wrapper: wrapperFor(coldClient()) });

    expect(groupsApi.listMemberships).not.toHaveBeenCalled();
  });

  it("returns every membership once signed in", async () => {
    vi.mocked(groupsApi.listMemberships).mockResolvedValue(MEMBERSHIPS);

    const { result } = renderHook(() => useGroupMemberships(), {
      wrapper: wrapperFor(warmClient()),
    });

    await waitFor(() => expect(result.current.memberships).toEqual(MEMBERSHIPS));
    expect(groupsApi.listMemberships).toHaveBeenCalledWith(TOKEN);
  });

  it("surfaces an error from the listMemberships call", async () => {
    vi.mocked(groupsApi.listMemberships).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useGroupMemberships(), {
      wrapper: wrapperFor(warmClient()),
    });

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
  });

  it("is refetched by a plain ['groups'] invalidation, since that key is its prefix", async () => {
    vi.mocked(groupsApi.listMemberships).mockResolvedValue(MEMBERSHIPS);
    const queryClient = warmClient();

    renderHook(() => useGroupMemberships(), { wrapper: wrapperFor(queryClient) });
    await waitFor(() => expect(groupsApi.listMemberships).toHaveBeenCalledTimes(1));

    await queryClient.invalidateQueries({ queryKey: ["groups"] });

    await waitFor(() => expect(groupsApi.listMemberships).toHaveBeenCalledTimes(2));
  });
});

describe("useGroupPokemon", () => {
  it("does not fetch without a group id", () => {
    renderHook(() => useGroupPokemon(undefined), { wrapper: wrapperFor(warmClient()) });

    expect(groupsApi.listPokemon).not.toHaveBeenCalled();
  });

  it("does not fetch while signed out", () => {
    renderHook(() => useGroupPokemon("1"), { wrapper: wrapperFor(coldClient()) });

    expect(groupsApi.listPokemon).not.toHaveBeenCalled();
  });

  it("returns the group's pokemon once signed in", async () => {
    vi.mocked(groupsApi.listPokemon).mockResolvedValue([GROUP_POKEMON]);

    const { result } = renderHook(() => useGroupPokemon("1"), {
      wrapper: wrapperFor(warmClient()),
    });

    await waitFor(() => expect(result.current.pokemon).toEqual([GROUP_POKEMON]));
    expect(groupsApi.listPokemon).toHaveBeenCalledWith(TOKEN, "1");
  });

  it("surfaces an error from the listPokemon call", async () => {
    vi.mocked(groupsApi.listPokemon).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useGroupPokemon("1"), {
      wrapper: wrapperFor(warmClient()),
    });

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
  });
});

describe("useCreateGroup", () => {
  it("creates a group and invalidates the groups list", async () => {
    vi.mocked(groupsApi.create).mockResolvedValue(GROUPS[0]);
    const queryClient = warmClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateGroup(), { wrapper: wrapperFor(queryClient) });
    const created = await result.current.createGroupAsync({ name: "Favorites" });

    expect(groupsApi.create).toHaveBeenCalledWith(TOKEN, { name: "Favorites" });
    expect(created).toEqual(GROUPS[0]);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["groups"] });
  });

  it("surfaces a create error", async () => {
    vi.mocked(groupsApi.create).mockRejectedValue(new Error("name taken"));

    const { result } = renderHook(() => useCreateGroup(), { wrapper: wrapperFor(warmClient()) });

    await expect(result.current.createGroupAsync({ name: "x" })).rejects.toThrow("name taken");
    await waitFor(() => expect(result.current.createGroupError).toBeInstanceOf(Error));
  });
});

describe("useUpdateGroup", () => {
  it("updates a group and invalidates the groups list", async () => {
    vi.mocked(groupsApi.update).mockResolvedValue({ ...GROUPS[0], name: "Renamed" });
    const queryClient = warmClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateGroup(), { wrapper: wrapperFor(queryClient) });
    const updated = await result.current.updateGroupAsync({ id: "1", body: { name: "Renamed" } });

    expect(groupsApi.update).toHaveBeenCalledWith(TOKEN, "1", { name: "Renamed" });
    expect(updated.name).toBe("Renamed");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["groups"] });
  });

  it("surfaces an update error", async () => {
    vi.mocked(groupsApi.update).mockRejectedValue(new Error("not found"));

    const { result } = renderHook(() => useUpdateGroup(), { wrapper: wrapperFor(warmClient()) });

    await expect(result.current.updateGroupAsync({ id: "1", body: { name: "x" } })).rejects.toThrow(
      "not found",
    );
    await waitFor(() => expect(result.current.updateGroupError).toBeInstanceOf(Error));
  });
});

describe("useDeleteGroup", () => {
  it("deletes a group and invalidates the groups list", async () => {
    vi.mocked(groupsApi.remove).mockResolvedValue(undefined);
    const queryClient = warmClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteGroup(), { wrapper: wrapperFor(queryClient) });
    await result.current.deleteGroupAsync("1");

    expect(groupsApi.remove).toHaveBeenCalledWith(TOKEN, "1");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["groups"] });
  });

  it("surfaces a delete error", async () => {
    vi.mocked(groupsApi.remove).mockRejectedValue(new Error("not found"));

    const { result } = renderHook(() => useDeleteGroup(), { wrapper: wrapperFor(warmClient()) });

    await expect(result.current.deleteGroupAsync("1")).rejects.toThrow("not found");
    await waitFor(() => expect(result.current.deleteGroupError).toBeInstanceOf(Error));
  });
});

describe("useAddPokemonToGroup", () => {
  it("adds a pokemon and invalidates both the groups list and that group's pokemon", async () => {
    vi.mocked(groupsApi.addPokemon).mockResolvedValue(GROUP_POKEMON);
    const queryClient = warmClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useAddPokemonToGroup(), {
      wrapper: wrapperFor(queryClient),
    });
    const added = await result.current.addPokemonToGroupAsync({
      groupId: "1",
      body: GROUP_POKEMON,
    });

    expect(groupsApi.addPokemon).toHaveBeenCalledWith(TOKEN, "1", GROUP_POKEMON);
    expect(added).toEqual(GROUP_POKEMON);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["groups"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["groups", "1", "pokemon"] });
  });

  it("surfaces an add error", async () => {
    vi.mocked(groupsApi.addPokemon).mockRejectedValue(new Error("group full"));

    const { result } = renderHook(() => useAddPokemonToGroup(), {
      wrapper: wrapperFor(warmClient()),
    });

    await expect(
      result.current.addPokemonToGroupAsync({ groupId: "1", body: GROUP_POKEMON }),
    ).rejects.toThrow("group full");
    await waitFor(() => expect(result.current.addPokemonToGroupError).toBeInstanceOf(Error));
  });
});

describe("useRemovePokemonFromGroup", () => {
  it("removes a pokemon and invalidates both the groups list and that group's pokemon", async () => {
    vi.mocked(groupsApi.removePokemon).mockResolvedValue(undefined);
    const queryClient = warmClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useRemovePokemonFromGroup(), {
      wrapper: wrapperFor(queryClient),
    });
    await result.current.removePokemonFromGroupAsync({ groupId: "1", pokemonId: "25" });

    expect(groupsApi.removePokemon).toHaveBeenCalledWith(TOKEN, "1", "25");
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["groups"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["groups", "1", "pokemon"] });
  });

  it("surfaces a remove error", async () => {
    vi.mocked(groupsApi.removePokemon).mockRejectedValue(new Error("not found"));

    const { result } = renderHook(() => useRemovePokemonFromGroup(), {
      wrapper: wrapperFor(warmClient()),
    });

    await expect(
      result.current.removePokemonFromGroupAsync({ groupId: "1", pokemonId: "25" }),
    ).rejects.toThrow("not found");
    await waitFor(() => expect(result.current.removePokemonFromGroupError).toBeInstanceOf(Error));
  });
});
