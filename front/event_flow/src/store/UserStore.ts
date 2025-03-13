import { create } from "zustand";

interface UserProfile {
  login: string;
  age: string;
  name: string;
  surname: string;
}

interface UserState {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  role: string;
  signIn: (profile: UserProfile, role: string) => void;
  signOut: () => void;
  setUserProfile: (profile: UserProfile) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  isAuthenticated: false,
  userProfile: null,
  role: "",
  signIn: (profile, role) =>
    set({ isAuthenticated: true, userProfile: profile, role: role }),
  signOut: () => set({ isAuthenticated: false, userProfile: null, role: "" }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setIsAuthenticated: (isAuthenticated) =>
    set({ isAuthenticated: isAuthenticated }),
}));
