import { create } from "zustand";
import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from "@/lib/utils/storage";

export interface IAuthStore {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),

  login: (token: string) => {
    setStoredToken(token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    clearStoredToken();
    set({ token: null, isAuthenticated: false });
  },
}));
