import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { User, AuthResponse } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { displayName?: string; avatarUrl?: string }) => Promise<void>;
  initialize: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isInitialized: false,  // Track if initialization has been called

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post<AuthResponse>('/auth/login', {
            email,
            password,
          });

          const { user, accessToken } = response.data;

          // Store in localStorage for API interceptor
          localStorage.setItem('access_token', accessToken);

          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, displayName?: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post<AuthResponse>('/auth/register', {
            email,
            password,
            displayName,
          });

          const { user, accessToken } = response.data;

          // Store in localStorage for API interceptor
          localStorage.setItem('access_token', accessToken);

          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateProfile: async (data: { displayName?: string; avatarUrl?: string }) => {
        try {
          const response = await api.patch('/auth/profile', data);
          const updatedUser = response.data.user;
          
          set((state) => ({
            user: updatedUser,
          }));
        } catch (error) {
          throw error;
        }
      },

      initialize: () => {
        const token = localStorage.getItem('access_token');

        // Set loading state and clear stale auth state while checking authentication
        set({
          isLoading: true,
          isAuthenticated: false,  // Reset to false until validation completes
          isInitialized: true,
        });

        if (token) {
          // Validate token by fetching profile
          api.get('/auth/profile')
            .then((response) => {
              set({
                user: response.data,
                token,
                isAuthenticated: true,
                isLoading: false,
              });
            })
            .catch(() => {
              // Token is invalid, clear everything
              localStorage.removeItem('access_token');
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
              });
            });
        } else {
          // No token, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);