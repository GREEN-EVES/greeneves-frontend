import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { Event, Guest, RSVP, WeddingProgress } from '@/types';

interface EventState {
  // Multi-event support
  events: Event[];
  currentEvent: Event | null;
  currentEventId: string | null;

  // Related data for current event
  guests: Guest[];
  rsvps: RSVP[];
  progress: WeddingProgress | null;

  isLoading: boolean;
}

interface EventActions {
  // Multi-event management
  fetchEvents: () => Promise<void>;
  createEvent: (data: Partial<Event>) => Promise<Event>;
  updateEvent: (id: string, data: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  selectEvent: (id: string) => void;

  // Guest management (scoped to current event)
  fetchGuests: () => Promise<void>;
  createGuest: (data: Partial<Guest>) => Promise<void>;
  updateGuest: (id: string, data: Partial<Guest>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;

  // RSVP management
  fetchRSVPs: () => Promise<void>;

  // Progress/analytics
  fetchProgress: () => Promise<void>;

  // Reset state
  reset: () => void;
}

type EventStore = EventState & EventActions;

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      currentEvent: null,
      currentEventId: null,
      guests: [],
      rsvps: [],
      progress: null,
      isLoading: false,

      // Fetch all events for the user
      fetchEvents: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/events');
          const events = response.data || [];

          console.log('=== FETCH EVENTS DEBUG ===');
          console.log('Raw API response:', response.data);
          console.log('First event galleryImages:', events[0]?.galleryImages);
          console.log('First event coverImageUrl:', events[0]?.coverImageUrl);

          // Auto-select first event if none selected
          const { currentEventId } = get();
          let newCurrentEvent = null;
          let newCurrentEventId = currentEventId;

          if (events.length > 0) {
            if (currentEventId) {
              newCurrentEvent = events.find((e: Event) => e.id === currentEventId) || events[0];
            } else {
              newCurrentEvent = events[0];
            }
            newCurrentEventId = newCurrentEvent.id;
          }

          console.log('Selected currentEvent:', newCurrentEvent);
          console.log('Selected event galleryImages:', newCurrentEvent?.galleryImages);

          set({
            events,
            currentEvent: newCurrentEvent,
            currentEventId: newCurrentEventId,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Create a new event
      createEvent: async (data: Partial<Event>) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/events', data);
          const newEvent = response.data;

          set((state) => ({
            events: [...state.events, newEvent],
            currentEvent: newEvent,
            currentEventId: newEvent.id,
            isLoading: false,
          }));

          return newEvent;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Update an event
      updateEvent: async (id: string, data: Partial<Event>) => {
        set({ isLoading: true });
        try {
          const response = await api.put(`/events/${id}`, data);
          const updatedEvent = response.data;

          console.log('=== UPDATE EVENT STORE DEBUG ===');
          console.log('Updated event from API:', updatedEvent);
          console.log('galleryImages:', updatedEvent?.galleryImages);
          console.log('coverImageUrl:', updatedEvent?.coverImageUrl);

          set((state) => ({
            events: state.events.map((e) => (e.id === id ? updatedEvent : e)),
            currentEvent: state.currentEventId === id ? updatedEvent : state.currentEvent,
            isLoading: false,
          }));

          console.log('Store updated');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Delete an event
      deleteEvent: async (id: string) => {
        set({ isLoading: true });
        try {
          await api.delete(`/events/${id}`);

          set((state) => {
            const newEvents = state.events.filter((e) => e.id !== id);
            const newCurrentEvent = newEvents.length > 0 ? newEvents[0] : null;

            return {
              events: newEvents,
              currentEvent: state.currentEventId === id ? newCurrentEvent : state.currentEvent,
              currentEventId: state.currentEventId === id ? newCurrentEvent?.id || null : state.currentEventId,
              isLoading: false,
            };
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Select/switch to a different event
      selectEvent: (id: string) => {
        const { events } = get();
        const event = events.find((e) => e.id === id);

        if (event) {
          set({
            currentEvent: event,
            currentEventId: id,
            // Clear current event's related data
            guests: [],
            rsvps: [],
            progress: null,
          });
        }
      },

      // Fetch guests for current event
      fetchGuests: async () => {
        try {
          const response = await api.get('/guests');
          set({ guests: response.data.guests || [] });
        } catch (error) {
          throw error;
        }
      },

      // Create guest for current event
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

      // Update guest
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

      // Delete guest
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

      // Fetch RSVPs
      fetchRSVPs: async () => {
        try {
          const response = await api.get('/rsvps');
          set({ rsvps: response.data.rsvps || [] });
        } catch (error) {
          throw error;
        }
      },

      // Fetch progress/analytics for current event
      fetchProgress: async () => {
        try {
          const { currentEventId } = get();
          if (!currentEventId) return;

          const response = await api.get(`/analytics/event/${currentEventId}/progress`);
          set({ progress: response.data.stats || null });
        } catch (error) {
          throw error;
        }
      },

      // Reset all state
      reset: () => {
        set({
          events: [],
          currentEvent: null,
          currentEventId: null,
          guests: [],
          rsvps: [],
          progress: null,
          isLoading: false,
        });
      },
    }),
    {
      name: 'event-storage',
      partialize: (state) => ({
        currentEventId: state.currentEventId,
      }),
    }
  )
);

// Backward compatibility exports (deprecated - will be removed)
export const useWeddingStore = useEventStore;
