import { create } from 'zustand';
import api from '@/lib/api';
import type { WeddingInfo, Guest, RSVP, WeddingProgress } from '@/types';

interface WeddingState {
  weddingInfo: WeddingInfo | null;
  guests: Guest[];
  rsvps: RSVP[];
  progress: WeddingProgress | null;
  isLoading: boolean;
}

interface WeddingActions {
  fetchWeddingInfo: () => Promise<void>;
  createWeddingInfo: (data: Partial<WeddingInfo>) => Promise<void>;
  updateWeddingInfo: (data: Partial<WeddingInfo>) => Promise<void>;
  fetchGuests: () => Promise<void>;
  createGuest: (data: Partial<Guest>) => Promise<void>;
  updateGuest: (id: string, data: Partial<Guest>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
  fetchRSVPs: () => Promise<void>;
  fetchProgress: () => Promise<void>;
  reset: () => void;
}

type WeddingStore = WeddingState & WeddingActions;

export const useWeddingStore = create<WeddingStore>((set, get) => ({
  weddingInfo: null,
  guests: [],
  rsvps: [],
  progress: null,
  isLoading: false,

  fetchWeddingInfo: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/weddings/my-wedding');
      set({
        weddingInfo: response.data.weddingInfo,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createWeddingInfo: async (data: Partial<WeddingInfo>) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/weddings', data);
      set({
        weddingInfo: response.data.weddingInfo,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateWeddingInfo: async (data: Partial<WeddingInfo>) => {
    set({ isLoading: true });
    try {
      const response = await api.patch('/weddings', data);
      set({
        weddingInfo: response.data.weddingInfo,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchGuests: async () => {
    try {
      const response = await api.get('/guests');
      set({ guests: response.data.guests });
    } catch (error) {
      throw error;
    }
  },

  createGuest: async (data: Partial<Guest>) => {
    try {
      const response = await api.post('/guests', data);
      set((state) => ({
        guests: [response.data.guest, ...state.guests],
      }));
    } catch (error) {
      throw error;
    }
  },

  updateGuest: async (id: string, data: Partial<Guest>) => {
    try {
      const response = await api.patch(`/guests/${id}`, data);
      set((state) => ({
        guests: state.guests.map((guest) =>
          guest.id === id ? response.data.guest : guest
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteGuest: async (id: string) => {
    try {
      await api.delete(`/guests/${id}`);
      set((state) => ({
        guests: state.guests.filter((guest) => guest.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  fetchRSVPs: async () => {
    try {
      const response = await api.get('/rsvps');
      set({ rsvps: response.data.rsvps });
    } catch (error) {
      throw error;
    }
  },

  fetchProgress: async () => {
    try {
      const response = await api.get('/analytics/wedding-progress');
      set({ progress: response.data.stats });
    } catch (error) {
      throw error;
    }
  },

  reset: () => {
    set({
      weddingInfo: null,
      guests: [],
      rsvps: [],
      progress: null,
      isLoading: false,
    });
  },
}));