"use client";

import { Dialog, DialogTrigger, IconButton, Popover } from "@code-x/lago";
import { Check, Plus } from "@untitled-ui/icons-react";
import { type FunctionComponent, useCallback, useEffect, useState } from "react";
import { AddToGroupControl } from "@/components/AddToGroupControl";
import { useGroupMemberships } from "@/hooks/useGroups";
import { formatPokemonName } from "@/lib/formNames";
import { useAddToGroup } from "@/providers/AddToGroupProvider";
import type { Pokemon } from "@/types/graphql";
import css from "./AddToGroupButton.module.css";
import { isPokemonSaved } from "./AddToGroupButton.utils";

interface AddToGroupButtonProps {
  pokemon: Pokemon;
  className?: string;
}

export const AddToGroupButton: FunctionComponent<AddToGroupButtonProps> = ({
  pokemon,
  className,
}) => {
  const { memberships } = useGroupMemberships();
  const { requestOpen, resumeFor, clearResume } = useAddToGroup();
  const [isOpen, setIsOpen] = useState(false);

  const isSaved = isPokemonSaved(memberships ?? [], pokemon.id);
  const name = formatPokemonName(pokemon);
  const label = isSaved ? `Manage ${name}'s lists` : `Add ${name} to a list`;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setIsOpen(false);
        return;
      }
      if (requestOpen(pokemon)) {
        setIsOpen(true);
      }
    },
    [pokemon, requestOpen],
  );

  useEffect(() => {
    if (resumeFor === pokemon.id) {
      setIsOpen(true);
      clearResume();
    }
  }, [resumeFor, pokemon.id, clearResume]);

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={handleOpenChange}>
      <IconButton variant="quiet" size="sm" className={className} aria-label={label}>
        {isSaved ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
      </IconButton>
      <Popover placement="bottom end" className={css.popover}>
        <Dialog aria-label={label}>
          <AddToGroupControl pokemon={pokemon} onDone={() => setIsOpen(false)} />
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};

export default AddToGroupButton;
