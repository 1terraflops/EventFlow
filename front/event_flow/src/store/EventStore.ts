import { create } from "zustand";
import { getEvents, searchEvents } from "../requests/Events";

interface Event {
  id: number;
  // logo: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_by: number;
}
interface EventState {
  events: Event[];
  setEvents: (events: Event[]) => void;
  get: (name: string) => Event | undefined;
}
export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  setEvents: (newEvents) => set({ events: newEvents }),
  get: (name) => {
    return get().events.find((event) => event.title === name);
  },
}));
