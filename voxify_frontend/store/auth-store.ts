import { create } from "zustand";
import type { AuthResponse } from "@/lib/types";

type AuthState = {
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  setAuth: (payload: AuthResponse) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: ({ user }) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
