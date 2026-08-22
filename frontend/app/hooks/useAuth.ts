import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { authApi, getStoredToken, setStoredToken } from "@/lib/auth";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "@/types/auth";

export function useAuth() {
  const queryClient = useQueryClient();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const {
    data: token,
    isLoading: isTokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ["auth", "token"],
    queryFn: getStoredToken,
    staleTime: Infinity,
  });

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["auth", "user", token],
    queryFn: () => authApi.getCurrentUser(token!),
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: authApi.login,
    onSuccess: (data: LoginResponse) => {
      setStoredToken(data.access_token);
      queryClient.setQueryData(["auth", "token"], data.access_token);
    },
  });

  const registerMutation = useMutation<RegisterResponse, Error, RegisterCredentials>({
    mutationFn: authApi.register,
    onSuccess: (data: RegisterResponse) => {
      setStoredToken(data.access_token);
      queryClient.setQueryData(["auth", "token"], data.access_token);
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "token"], null);
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      queryClient.removeQueries({ queryKey: ["groups"] });
    },
  });

  return {
    user: hasMounted ? user : undefined,
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

export function useIsAuthenticated() {
  const { user, isLoading } = useAuth();
  return { isAuthenticated: !!user, isLoading };
}
