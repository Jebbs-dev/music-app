import { Artist, User } from "@/modules/music/types/types";
import * as SecureStore from 'expo-secure-store';
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthData {
  access_token: string;
  refresh_token: string;
  userInfo: Partial<User | Artist>; // Optional user info
}

interface AuthState {
  isLoggedIn: boolean;
  user: Partial<User | Artist> | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  login: (authData: AuthData, user?: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  authView: "login" | "signup";
  setAuthView: (view: "login" | "signup") => void;
  // updateTokens: (accessToken: string, refreshToken: string) => void;
}

interface AuthStore extends AuthState, AuthActions {}

export const getStorageItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

export const setStorageItem = async (key: string, value: string | null): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
};

export async function getStorageItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

// Custom storage implementation for Zustand persist middleware
const createCustomStorage = () => {
  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        return await getStorageItem(name);
      } catch (error) {
        console.error('Error getting item from storage:', error);
        return null;
      }
    },
    setItem: async (name: string, value: string): Promise<void> => {
      try {
        await setStorageItem(name, value);
      } catch (error) {
        console.error('Error setting item in storage:', error);
      }
    },
    removeItem: async (name: string): Promise<void> => {
      try {
        await setStorageItem(name, null);
      } catch (error) {
        console.error('Error removing item from storage:', error);
      }
    },
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      login: (authData: AuthData,) => {
        set({ 
          isLoggedIn: true,
          accessToken: authData.access_token,
          refreshToken: authData.refresh_token,
          user: authData.userInfo || null
        });
      },

      logout: () => {
        set({ 
          isLoggedIn: false,
          user: null,
          accessToken: null,
          refreshToken: null
        });
        // Clear tokens from secure storage
        setStorageItem("access_token", null);
        setStorageItem("refresh_token", null);
        setStorageItem("user", null);
      },

      setUser: (user: Partial<User | Artist>) => {
        set({ user });
      },
      authView: "login",
      setAuthView: (view: "login" | "signup") => {
        set({ authView: view });
      },

      // updateTokens: (accessToken: string, refreshToken: string) => {
      //   set({ accessToken, refreshToken });
      //   // Update tokens in secure storage
      //   setStorageItemAsync("access_token", accessToken);
      //   setStorageItemAsync("refresh_token", refreshToken);
      // },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => createCustomStorage()),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore;



