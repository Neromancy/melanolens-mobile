import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { UserProfile } from '../types';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: UserProfile) => Promise<void>;
  updateUser: (user: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync('ml_token');
      const userRaw = await SecureStore.getItemAsync('ml_user');
      if (token && userRaw) {
        set({
          token,
          user: JSON.parse(userRaw),
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    } catch (e) {
      console.warn('Session restore error:', e);
    }
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  setAuth: async (token, user) => {
    await SecureStore.setItemAsync('ml_token', token);
    await SecureStore.setItemAsync('ml_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  updateUser: async (updatedFields) => {
    const current = get().user;
    if (!current) return;
    const nextUser = { ...current, ...updatedFields };
    await SecureStore.setItemAsync('ml_user', JSON.stringify(nextUser));
    set({ user: nextUser });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('ml_token');
    await SecureStore.deleteItemAsync('ml_user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));