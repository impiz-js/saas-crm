import { create } from "zustand";
import { api } from "../lib/api";
import { User } from "../types";

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const TOKEN_KEY = "studioflow_token";

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  loading: false,
  hydrate: async () => {
    const token = get().token;
    if (!token) return;
    try {
      set({ loading: true });
      const { user } = await api.me(token);
      set({ user });
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      set({ token: null, user: null });
    } finally {
      set({ loading: false });
    }
  },
  login: async (email, password) => {
    const { token, user } = await api.login(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    set({ token, user });
  },
  register: async (name, email, password) => {
    const { token, user } = await api.register(name, email, password);
    localStorage.setItem(TOKEN_KEY, token);
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null });
  }
}));
