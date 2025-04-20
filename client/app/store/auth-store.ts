import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string) => {
        // For demo purposes, accept any non-empty credentials
        if (email && password) {
          set({
            isAuthenticated: true,
            user: {
              name: 'Test User',
              email: email,
            },
          });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      register: async (name: string, email: string, password: string) => {
        if (name && email && password) {
          set({
            isAuthenticated: true,
            user: {
              name,
              email,
            },
          });
        } else {
          throw new Error('Invalid registration data');
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          try {
            const cookie = document.cookie
              .split('; ')
              .find((row) => row.startsWith(`${name}=`));
            if (cookie) {
              const value = cookie.split('=')[1];
              return JSON.parse(decodeURIComponent(value));
            }
            return null;
          } catch (error) {
            console.error('Error parsing auth cookie:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          const stringValue = JSON.stringify(value);
          document.cookie = `${name}=${encodeURIComponent(stringValue)}; path=/; max-age=31536000`;
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          document.cookie = `${name}=; path=/; max-age=0`;
        },
      },
    }
  )
); 