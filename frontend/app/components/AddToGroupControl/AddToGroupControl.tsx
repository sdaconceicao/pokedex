"use client";

import {
  Alert,
  Button,
  Checkbox,
  Form,
  MultiSelect,
  MultiSelectItem,
  TextField,
} from "@code-x/lago";
import { type FunctionComponent, type ReactNode, useCallback, useMemo, useState } from "react";
import type { Key } from "react-aria-components";
import {
  useAddPokemonToGroup,
  useCreateGroup,
  useGroupMemberships,
  useGroups,
  useRemovePokemonFromGroup,
} from "@/hooks/useGroups";
import type { Pokemon } from "@/types/graphql";
import css from "./AddToGroupControl.module.css";
import {
  diffListSelection,
  getMembershipGroupIds,
  getNewListDefaults,
  hasListChanges,
  isValidNewListName,
  resolveExistingListsMode,
} from "./AddToGroupControl.utils";

interface AddToGroupControlProps {
  pokemon: Pokemon;
  onDone: () => void;
}

export const AddToGroupControl: FunctionComponent<AddToGroupControlProps> = ({
  pokemon,
  onDone,
}) => {
  const { groups } = useGroups();
  const { memberships } = useGroupMemberships();
  const { createGroupAsync, isCreateGroupLoading, createGroupError } = useCreateGroup();
  const { addPokemonToGroupAsync, isAddPokemonToGroupLoading, addPokemonToGroupError } =
    useAddPokemonToGroup();
  const {
    removePokemonFromGroupAsync,
    isRemovePokemonFromGroupLoading,
    removePokemonFromGroupError,
  } = useRemovePokemonFromGroup();

  const [selectedOverride, setSelectedOverride] = useState<string[] | undefined>(undefined);
  const [nameOverride, setNameOverride] = useState<string | undefined>(undefined);
  const [isDefaultOverride, setIsDefaultOverride] = useState<boolean | undefined>(undefined);

  const allGroups = useMemo(() => groups ?? [], [groups]);
  const memberGroupIds = useMemo(
    () => getMembershipGroupIds(memberships ?? [], pokemon.id),
    [memberships, pokemon.id],
  );
  const mode = useMemo(() => resolveExistingListsMode(allGroups), [allGroups]);

  const selectedIds = selectedOverride ?? memberGroupIds;
  const diff = useMemo(
    () => diffListSelection(memberGroupIds, selectedIds),
    [memberGroupIds, selectedIds],
  );

  const newListDefaults = useMemo(() => getNewListDefaults(allGroups), [allGroups]);
  const name = nameOverride ?? newListDefaults.name;
  const isDefaultChecked = isDefaultOverride ?? newListDefaults.isDefault;

  const isSaving =
    isCreateGroupLoading || isAddPokemonToGroupLoading || isRemovePokemonFromGroupLoading;
  const error = createGroupError ?? addPokemonToGroupError ?? removePokemonFromGroupError;

  const handleUpdate = useCallback(async () => {
    try {
      for (const groupId of diff.toRemove) {
        await removePokemonFromGroupAsync({ groupId, pokemonId: pokemon.id });
      }
      for (const groupId of diff.toAdd) {
        await addPokemonToGroupAsync({
          groupId,
          body: { pokemonId: pokemon.id, speciesId: pokemon.speciesId },
        });
      }
      onDone();
    } catch {}
  }, [
    addPokemonToGroupAsync,
    diff.toAdd,
    diff.toRemove,
    onDone,
    pokemon.id,
    pokemon.speciesId,
    removePokemonFromGroupAsync,
  ]);

  const handleCreateSubmit = useCallback(
    async (event?: { preventDefault(): void }) => {
      event?.preventDefault();
      if (!isValidNewListName(name)) return;
      try {
        const created = await createGroupAsync({ name: name.trim(), isDefault: isDefaultChecked });
        await addPokemonToGroupAsync({
          groupId: created.id,
          body: { pokemonId: pokemon.id, speciesId: pokemon.speciesId },
        });
        onDone();
      } catch {}
    },
    [
      addPokemonToGroupAsync,
      createGroupAsync,
      isDefaultChecked,
      name,
      onDone,
      pokemon.id,
      pokemon.speciesId,
    ],
  );

  const handleSelectionChange = useCallback((keys: Key[]) => {
    setSelectedOverride(keys.map(String));
  }, []);

  const handleSingleToggle = useCallback(
    (isSelected: boolean) => {
      setSelectedOverride(isSelected ? allGroups.map((group) => group.id) : []);
    },
    [allGroups],
  );

  const updateButton = (
    <Button
      size="sm"
      variant="secondary"
      className={css.updateButton}
      onPress={handleUpdate}
      isPending={isSaving}
      isDisabled={!hasListChanges(diff)}
    >
      Update
    </Button>
  );

  let existingListsSection: ReactNode = null;
  if (mode === "single") {
    const [only] = allGroups;
    existingListsSection = (
      <div className={css.existingList}>
        <Checkbox
          className={css.singleList}
          isSelected={selectedIds.includes(only.id)}
          onChange={handleSingleToggle}
        >
          {only.name}
        </Checkbox>
        {updateButton}
      </div>
    );
  } else if (mode === "dropdown") {
    existingListsSection = (
      <div className={css.existingList}>
        <MultiSelect
          size="sm"
          label="Your lists"
          placeholder="No lists"
          value={selectedIds}
          onChange={handleSelectionChange}
          className={css.select}
        >
          {allGroups.map((group) => (
            <MultiSelectItem key={group.id} id={group.id} textValue={group.name}>
              {group.name}
            </MultiSelectItem>
          ))}
        </MultiSelect>
        {updateButton}
      </div>
    );
  }

  return (
    <div className={css.addToGroupControl}>
      {error && (
        <Alert variant="error">
          <Alert.Header title={error.message} />
        </Alert>
      )}

      {existingListsSection}

      <Form className={css.newListForm} onSubmit={handleCreateSubmit} validationBehavior="aria">
        <TextField
          label="New list"
          value={name}
          onChange={setNameOverride}
          placeholder={allGroups.length === 0 ? undefined : "New list name"}
        />
        <Checkbox isSelected={isDefaultChecked} onChange={setIsDefaultOverride}>
          Make this my default list
        </Checkbox>
        <Button
          type="submit"
          size="sm"
          variant="primary"
          isPending={isSaving}
          isDisabled={!isValidNewListName(name)}
        >
          Add
        </Button>
      </Form>
    </div>
  );
};

export default AddToGroupControl;
