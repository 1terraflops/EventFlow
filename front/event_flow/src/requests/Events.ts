import axios from "axios";
import { API_URL, axiosInstance } from "../config/Api";
import { useUserStore } from "../store/UserStore";
import { useEventStore } from "../store/EventStore";

export interface EventDetail {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_by: number;
}
export interface EventRequestDetail {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}
export enum EventSearchType {
  title,
  description,
}
export const getEvents = async (): Promise<EventDetail[]> => {
  const response = await axiosInstance.get(`${API_URL}/events/`);
  const events = response.data;
  useEventStore.getState().setEvents(events);
  return events;
};

export const getEvent = async (event_id: number) => {
  const response = await axiosInstance.get(`${API_URL}/events/${event_id}/`);
  return response.data;
};

export const createEvent = async (createEventRequest: EventRequestDetail) => {
  const response = await axiosInstance.post(
    `${API_URL}/events/create/`,
    createEventRequest
  );
  return response.data;
};
export const updateEvent = async (
  event_id: number,
  updateEventRequst: EventRequestDetail
) => {
  const response = await axiosInstance.patch(
    `${API_URL}/events/${event_id}/update/`,
    updateEventRequst
  );
  return response.data;
};
export const registerToEvent = async (event_id: number, username: string) => {
  const response = await axiosInstance.post(
    `${API_URL}/events/${event_id}/register/`,
    {
      email: username,
    }
  );
  return response.data;
};
export const getRegisteredToEvent = async (event_id: number) => {
  const response = await axiosInstance.get(
    `${API_URL}/events/${event_id}/registrations/`
  );
  return response.data;
};
export const searchEvents = async (
  query: string,
  type?: EventSearchType,
  archived?: boolean
) => {
  const response = await axiosInstance.get(`${API_URL}/events/search/`, {
    params: { q: query, type: type, archived: archived },
  });
  const events = response.data;
  useEventStore.getState().setEvents(events);
  return response.data;
};
