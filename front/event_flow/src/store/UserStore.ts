import { create } from "zustand";

export interface UserProfile {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
}

interface UserState {
  isAuthenticated: boolean;
  userProfile: UserProfile | undefined;
  // role: string;
  signIn: (profile: UserProfile /* role: string */) => void;
  signOut: () => void;
  setUserProfile: (profile: UserProfile) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  isAuthenticated: false,
  userProfile: undefined,
  role: "",
  signIn: (profile /* role */) => {
    set({ isAuthenticated: true, userProfile: profile /* role: role */ });
  },
  signOut: () =>
    set({ isAuthenticated: false, userProfile: undefined /* role: "" */ }),
  setUserProfile: (profile) => {
    set({ userProfile: profile });
  },
  setIsAuthenticated: (isAuthenticated) =>
    set({ isAuthenticated: isAuthenticated }),
}));
