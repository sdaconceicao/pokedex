"use client";

import { Alert, Button, Heading, Skeleton } from "@code-x/lago";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGroups } from "@/hooks/useGroups";
import { useAuthModal } from "@/providers/AuthModalProvider";
import GroupRow from "./GroupRow";
import styles from "./GroupSettings.module.css";
import { resolveGroupSettingsState } from "./GroupSettings.utils";

const SKELETON_KEYS = [0, 1, 2];

function GroupSettingsSkeleton() {
  return (
    <div className={styles.list} aria-hidden="true">
      {SKELETON_KEYS.map((key) => (
        <Skeleton
          key={key}
          variant="line"
          height={40}
          label={key === 0 ? "Loading your groups" : undefined}
        />
      ))}
    </div>
  );
}

export default function GroupSettings() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { openSignIn } = useAuthModal();
  const { groups, isLoading: isGroupsLoading, error } = useGroups();

  const state = resolveGroupSettingsState(isAuthLoading, user, isGroupsLoading, error, groups);

  let content: ReactNode;
  switch (state) {
    case "loading":
      content = <GroupSettingsSkeleton />;
      break;
    case "signedOut":
      content = (
        <div className={styles.prompt}>
          <p>Sign in to manage your Pokémon groups.</p>
          <Button variant="primary" onPress={openSignIn}>
            Sign In
          </Button>
        </div>
      );
      break;
    case "error":
      content = (
        <Alert variant="error">
          <Alert.Header title="Couldn't load your groups" subtitle={error?.message} />
        </Alert>
      );
      break;
    case "empty":
      content = (
        <p className={styles.empty}>Press the + on any Pokémon card to create your first group.</p>
      );
      break;
    case "populated":
      content = (
        <ul className={styles.list}>
          {groups?.map((group) => (
            <GroupRow key={group.id} group={group} />
          ))}
        </ul>
      );
      break;
  }

  return (
    <section className={styles.container}>
      <Heading level={1}>Your groups</Heading>
      <p className={styles.intro}>
        Your default group is preselected whenever you add a Pokémon to a group.
      </p>
      {content}
    </section>
  );
}
