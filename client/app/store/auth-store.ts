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
          const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`));
          return cookie ? cookie.split('=')[1] : null;
        },
        setItem: (name, value) => {
          document.cookie = `${name}=${value}; path=/; max-age=31536000`;
        },
        removeItem: (name) => {
          document.cookie = `${name}=; path=/; max-age=0`;
        },
      },
    }
  )
); 