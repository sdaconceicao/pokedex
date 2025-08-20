import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = process.env.AUTH_API_URL || "http://localhost:3004";

// Helper function to safely access localStorage
const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

const setStoredToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", token);
};

const removeStoredToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  // Add other user properties from your backend
}

interface LoginResponse {
  access_token: string;
  user: User;
}

interface RegisterResponse {
  access_token: string;
  user: User;
}

// Authentication API functions
const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Login failed");
    }

    return response.json();
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Registration failed");
    }

    return response.json();
  },

  async getCurrentUser(): Promise<User> {
    const token = getStoredToken();
    if (!token) throw new Error("No token found");

    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  },

  async logout(): Promise<void> {
    removeStoredToken();
  },
};

// Custom hooks for authentication
export function useAuth() {
  const queryClient = useQueryClient();

  // Query for current user
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!getStoredToken(),
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setStoredToken(data.access_token);
      queryClient.setQueryData(["auth", "user"], data.user);
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setStoredToken(data.access_token);
      queryClient.setQueryData(["auth", "user"], data.user);
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.clear(); // Clear all cached data
    },
  });

  return {
    user,
    isLoading,
    error,
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
