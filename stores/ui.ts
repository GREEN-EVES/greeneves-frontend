import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activeTab: string;
  loading: boolean;
  toast: {
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null;
}

interface UIActions {
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  activeTab: 'overview',
  loading: false,
  toast: null,

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setActiveTab: (tab: string) => {
    set({ activeTab: tab });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    set({
      toast: {
        open: true,
        message,
        type,
      },
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
      set((state) => 
        state.toast?.open 
          ? { toast: { ...state.toast, open: false } }
          : state
      );
    }, 5000);
  },

  hideToast: () => {
    set((state) => 
      state.toast 
        ? { toast: { ...state.toast, open: false } }
        : state
    );
  },
}));