import { create } from "zustand";

interface Event {
  logo: string;
  title: string;
  description: string;
  location: string;
  date: string;
}
interface EventState {
  events: Event[];
  setEvents: (events: Event[]) => void;
  get: (name: string) => Event | undefined;
}
const mock = () => {
  const events: Event[] = [];
  for (let index = 0; index < 22; index++) {
    events.push({
      logo: "/eventElementLogoExample.png",
      title: "Назва івенту",
      description: "Опис",
      location: "Чернівці",
      date: "30 червня 2025",
    });
  }
  return events;
};
export const useEventStore = create<EventState>((set, get) => ({
  events: mock(),
  setEvents: (newEvents) => set({ events: newEvents }),
  get: (name) => {
    return get().events.find((event) => event.title === name);
  },
}));
