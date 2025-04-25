import { create } from 'zustand';

type User = {
  email: string;
  nickname: string;
  phone_number: string;
  provider: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  clearAuth: () => set({ user: null, accessToken: null }),
}));
