import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, getStoredToken, requireStoredToken } from "@/lib/auth";
import type { AvatarMessageResponse, UploadAvatarVariables } from "@/types/auth";

/**
 * The avatar is fetched on its own query key rather than as part of the profile:
 * `GET /users` stays a handful of short strings, and the image — up to 500 KiB
 * as a data URI — is only pulled by the screens that show one.
 */
export function useAvatar() {
  const queryClient = useQueryClient();

  // Same key as useAuth's token query, so react-query dedupes rather than
  // re-reading localStorage. Calling useAuth() here would drag in its eight
  // mutations for the sake of one string.
  const { data: token } = useQuery({
    queryKey: ["auth", "token"],
    queryFn: getStoredToken,
    staleTime: Infinity,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["auth", "avatar", token],
    queryFn: token ? () => authApi.getAvatar(token) : skipToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["auth", "avatar"] });

  const uploadMutation = useMutation<AvatarMessageResponse, Error, UploadAvatarVariables>({
    mutationFn: ({ file, onProgress }) =>
      authApi.uploadAvatar(requireStoredToken(), file, onProgress),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation<AvatarMessageResponse, Error, void>({
    mutationFn: () => authApi.deleteAvatar(requireStoredToken()),
    onSuccess: invalidate,
  });

  return {
    // The API says `null` for "no avatar"; lago's Avatar wants `undefined` to
    // fall back to initials. Converted here so no consumer handles both.
    avatarSrc: data?.image ?? undefined,
    isLoading,
    error,
    uploadAvatarAsync: uploadMutation.mutateAsync,
    isUploadLoading: uploadMutation.isPending,
    removeAvatarAsync: removeMutation.mutateAsync,
    isRemoveLoading: removeMutation.isPending,
  };
}
