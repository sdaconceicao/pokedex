"use client";

import { Alert, Button, Checkbox, Heading, IconButton, TextField } from "@code-x/lago";
import { Edit02, Trash01 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import CountPill from "@/components/CountPill";
import { Modal } from "@/components/Modal";
import { useDeleteGroup, useUpdateGroup } from "@/hooks/useGroups";
import type { PokemonGroup } from "@/types";
import styles from "./GroupRow.module.css";
import { buildGroupUpdatePayload, isValidGroupName } from "./GroupSettings.utils";

interface GroupRowProps {
  group: PokemonGroup;
}

export default function GroupRow({ group }: GroupRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(group.name);
  const [makeDefault, setMakeDefault] = useState(group.isDefault);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { updateGroupAsync, isUpdateGroupLoading, updateGroupError } = useUpdateGroup();
  const { deleteGroupAsync, isDeleteGroupLoading } = useDeleteGroup();

  const handleEdit = useCallback(() => {
    setName(group.name);
    setMakeDefault(group.isDefault);
    setIsEditing(true);
  }, [group.name, group.isDefault]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleSave = useCallback(async () => {
    const payload = buildGroupUpdatePayload(group, { name, makeDefault });
    if (!payload) {
      setIsEditing(false);
      return;
    }
    try {
      await updateGroupAsync({ id: group.id, body: payload });
      setIsEditing(false);
    } catch {
      // updateGroupError renders inline below; stay in edit mode so the
      // user can retry or cancel.
    }
  }, [group, name, makeDefault, updateGroupAsync]);

  const handleDelete = useCallback(async () => {
    await deleteGroupAsync(group.id);
    setIsConfirmingDelete(false);
  }, [deleteGroupAsync, group.id]);

  if (isEditing) {
    return (
      <li className={styles.row}>
        <div className={styles.editCard}>
          <TextField
            aria-label={`${group.name} group name`}
            className={styles.nameField}
            value={name}
            onChange={setName}
            isDisabled={isUpdateGroupLoading}
          />
          {!group.isDefault && (
            <Checkbox isSelected={makeDefault} onChange={setMakeDefault}>
              Make this my default group
            </Checkbox>
          )}

          {updateGroupError && (
            <Alert variant="error" className={styles.error}>
              <Alert.Header title="Couldn't save changes" subtitle={updateGroupError.message} />
            </Alert>
          )}

          <div className={styles.editActions}>
            <Button
              variant="primary"
              size="sm"
              onPress={handleSave}
              isPending={isUpdateGroupLoading}
              isDisabled={!isValidGroupName(name)}
            >
              Save
            </Button>
            <Button variant="secondary" size="sm" onPress={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={styles.row}>
      <div className={styles.card}>
        <div className={styles.info}>
          <Heading level={3} className={styles.name}>
            <Link href={`/groups/${group.id}`}>{group.name}</Link>
          </Heading>
          {group.isDefault && <span className={styles.defaultTag}>Default</span>}
        </div>

        <CountPill value={group.pokemonCount} label="Pokemon" className={styles.count} />

        <div className={styles.actions}>
          <IconButton
            aria-label={`Edit ${group.name}`}
            variant="quiet"
            className={styles.actionButton}
            onPress={handleEdit}
          >
            <Edit02 width={16} height={16} aria-hidden="true" />
          </IconButton>
          <IconButton
            aria-label={`Delete ${group.name}`}
            variant="quiet"
            className={styles.actionButton}
            onPress={() => setIsConfirmingDelete(true)}
          >
            <Trash01 width={16} height={16} aria-hidden="true" />
          </IconButton>
        </div>
      </div>

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
          <p>Deleting this group also deletes its saved Pokémon. This can't be undone.</p>
        </Modal>
      )}
    </li>
  );
}
