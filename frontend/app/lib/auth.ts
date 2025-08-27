import type {
  LoginCredentials,
  RegisterCredentials,
  User,
  LoginResponse,
  RegisterResponse,
} from "../types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:3004";

// Helper function to safely access localStorage
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const setStoredToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", token);
};

const removeStoredToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
};

// Authentication API functions
export const authApi = {
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

  async getCurrentUser(token: string): Promise<User> {
    if (!token) throw new Error("No token provided");

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
