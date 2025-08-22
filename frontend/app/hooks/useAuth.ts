import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, getStoredToken, setStoredToken } from "@/lib/auth";
import type {
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
} from "@/lib/types/auth";

// Custom hooks for authentication
export function useAuth() {
  const queryClient = useQueryClient();

  // Query for current token
  const {
    data: token,
    isLoading: isTokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ["auth", "token"],
    queryFn: getStoredToken,
    staleTime: Infinity, // Token doesn't change unless explicitly updated
  });

  // Query for current user (depends on token)
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["auth", "user", token],
    queryFn: () => authApi.getCurrentUser(token!),
    enabled: !!token, // Only run when token exists
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: authApi.login,
    onSuccess: (data: LoginResponse) => {
      setStoredToken(data.access_token);
      // Update token in cache, which will trigger user query
      queryClient.setQueryData(["auth", "token"], data.access_token);
    },
  });

  // Register mutation
  const registerMutation = useMutation<
    RegisterResponse,
    Error,
    RegisterCredentials
  >({
    mutationFn: authApi.register,
    onSuccess: (data: RegisterResponse) => {
      setStoredToken(data.access_token);
      // Update token in cache, which will trigger user query
      queryClient.setQueryData(["auth", "token"], data.access_token);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear token and user data from cache
      queryClient.setQueryData(["auth", "token"], null);
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
    },
  });

  return {
    user,
    isLoading: isTokenLoading || isUserLoading,
    error: tokenError || userError,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
}

// Hook for checking if user is authenticated
export function useIsAuthenticated() {
  const { user, isLoading } = useAuth();
  return { isAuthenticated: !!user, isLoading };
}
