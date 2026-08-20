"use client";

import { Button, IconButton, Radio, TextField } from "@code-x/lago";
import { Trash01 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { type FormEvent, useCallback, useState } from "react";
import CountPill from "@/components/CountPill";
import { Modal } from "@/components/Modal";
import { useDeleteGroup, useUpdateGroup } from "@/hooks/useGroups";
import type { PokemonGroup } from "@/types";
import styles from "./GroupRow.module.css";
import { shouldCommitRename } from "./GroupSettings.utils";

interface GroupRowProps {
  group: PokemonGroup;
}

export default function GroupRow({ group }: GroupRowProps) {
  const [name, setName] = useState(group.name);
  const { updateGroupAsync, isUpdateGroupLoading, updateGroupError } = useUpdateGroup();
  const { deleteGroupAsync, isDeleteGroupLoading } = useDeleteGroup();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const commitName = useCallback(() => {
    if (!shouldCommitRename(group.name, name)) return;
    updateGroupAsync({ id: group.id, body: { name: name.trim() } });
  }, [group.id, group.name, name, updateGroupAsync]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      commitName();
    },
    [commitName],
  );

  const handleDelete = useCallback(async () => {
    await deleteGroupAsync(group.id);
    setIsConfirmingDelete(false);
  }, [deleteGroupAsync, group.id]);

  return (
    <li className={styles.row}>
      <form className={styles.renameForm} onSubmit={handleSubmit}>
        <TextField
          aria-label={`${group.name} list name`}
          value={name}
          onChange={setName}
          onBlur={commitName}
          isDisabled={isUpdateGroupLoading}
          isInvalid={!!updateGroupError}
          errorMessage={updateGroupError?.message}
        />
      </form>

      <Link
        href={`/groups/${group.id}`}
        className={styles.viewLink}
        aria-label={`View ${group.name}`}
      >
        <CountPill value={group.pokemonCount} label="Pokemon" />
      </Link>

      <Radio value={group.id} aria-label={`Make ${group.name} the default list`} />

      <IconButton
        aria-label={`Delete ${group.name}`}
        variant="quiet"
        onPress={() => setIsConfirmingDelete(true)}
      >
        <Trash01 width={16} height={16} aria-hidden="true" />
      </IconButton>

      {isConfirmingDelete && (
        <Modal
          isOpen
          onClose={() => setIsConfirmingDelete(false)}
          title={`Delete ${group.name}?`}
          size="sm"
          footer={
            <>
              <Button variant="secondary" onPress={() => setIsConfirmingDelete(false)}>
                Cancel
              </Button>
              <Button variant="error" onPress={handleDelete} isPending={isDeleteGroupLoading}>
                Delete
              </Button>
            </>
          }
        >
          <p>Deleting this list also deletes its saved Pokémon. This can't be undone.</p>
        </Modal>
      )}
    </li>
  );
}
