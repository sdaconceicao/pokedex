"use client";

import { type FileRejectReason, FileUploader, type FileUploadItem } from "@code-x/lago";
import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import { useAvatar } from "@/hooks/useAvatar";
import { notify } from "@/lib/toast";
import styles from "./AccountAvatar.module.css";
import { AVATAR_ACCEPT, AVATAR_MAX_BYTES, dataUriToUploadItem } from "./AccountAvatar.utils";

interface AccountAvatarProps {
  /** Grid placement supplied by the page. */
  className?: string;
}

export default function AccountAvatar({ className }: AccountAvatarProps) {
  const { avatarSrc, uploadAvatarAsync, isUploadLoading, removeAvatarAsync, isRemoveLoading } =
    useAvatar();

  const [localItem, setLocalItem] = useState<FileUploadItem | null>(null);
  const [rejection, setRejection] = useState("");
  const isBusy = isUploadLoading || isRemoveLoading;

  // Two sources, resolved by precedence rather than by copying one into the
  // other: a locally picked file wins while it is uploading, complete or failed,
  // and otherwise the stored avatar is derived straight from the query.
  //
  // Derived in render on purpose. This previously copied the stored avatar into
  // state from an effect, which meant a value arriving on a later render could
  // be missed entirely — the image then stayed blank until a remount. A derived
  // value has no such window.
  const storedItem = useMemo(
    () => (avatarSrc ? dataUriToUploadItem(avatarSrc) : null),
    [avatarSrc],
  );
  const current = localItem ?? storedItem;
  const items = current ? [current] : [];
  const hasImage = current?.status === "complete" || current?.status === "uploading";

  const upload = useCallback(
    async (picked: FileUploadItem) => {
      setRejection("");
      setLocalItem({ ...picked, status: "uploading", progress: 0 });

      try {
        await uploadAvatarAsync({
          file: picked.file,
          onProgress: (percent) =>
            setLocalItem({ ...picked, status: "uploading", progress: percent }),
        });
        setLocalItem({ ...picked, status: "complete", progress: 100 });
        notify({
          title: "Avatar updated",
          description: "Your profile picture has been updated",
          variant: "success",
        });
      } catch (error) {
        setLocalItem({
          ...picked,
          status: "error",
          errorMessage: error instanceof Error ? error.message : "Upload failed",
        });
      }
    },
    [uploadAvatarAsync],
  );

  const handleChange = useCallback(
    (next: FileUploadItem[]) => {
      const picked = next.at(-1);
      if (!picked) {
        setLocalItem(null);
        return;
      }
      void upload(picked);
    },
    [upload],
  );

  const handleRemove = useCallback(async () => {
    try {
      await removeAvatarAsync();
      // The query refetches to `null` as well, so clearing the local item leaves
      // an empty uploader rather than falling back to the stored image.
      setLocalItem(null);
      notify({
        title: "Avatar removed",
        description: "Your profile picture has been removed",
        variant: "success",
      });
    } catch (error) {
      notify({
        title: error instanceof Error ? error.message : "Could not remove avatar",
        description: "Please try again.",
        variant: "error",
      });
    }
  }, [removeAvatarAsync]);

  const handleReject = useCallback((_files: File[], reason: FileRejectReason) => {
    setRejection(
      reason === "maxSize"
        ? `Image must be ${AVATAR_MAX_BYTES / 1024} KiB or smaller`
        : "Image must be a PNG, JPEG, or WebP",
    );
  }, []);

  return (
    <section className={clsx(styles.container, className)}>
      <FileUploader
        variant="round"
        label="Profile picture"
        hint={hasImage ? undefined : "Upload your profile picture"}
        accept={AVATAR_ACCEPT}
        maxSize={AVATAR_MAX_BYTES}
        // Explicit because the prop defaults to true — an account has one avatar.
        allowsMultiple={false}
        value={items}
        onChange={handleChange}
        onReject={handleReject}
        onRemove={() => void handleRemove()}
        onRetry={(item: FileUploadItem) => void upload(item)}
        isInvalid={!!rejection}
        errorMessage={rejection}
        isDisabled={isBusy}
        className={styles.uploader}
      />
    </section>
  );
}
