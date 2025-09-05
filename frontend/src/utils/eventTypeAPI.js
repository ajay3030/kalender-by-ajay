// frontend/src/utils/eventTypeAPI.js
import { apiFetch } from './api';

export const eventTypeAPI = {
  getEventTypes: (page = 1, limit = 20) =>
    apiFetch(`/event-types?page=${page}&limit=${limit}`),

  createEventType: data =>
    apiFetch('/event-types', { method: 'POST', body: JSON.stringify(data) }),

  updateEventType: (id, data) =>
    apiFetch(`/event-types/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteEventType: id =>
    apiFetch(`/event-types/${id}`, { method: 'DELETE' }),

  toggleEventType: id =>
    apiFetch(`/event-types/${id}/toggle`, { method: 'POST' }),

  duplicateEventType: id =>
    apiFetch(`/event-types/${id}/duplicate`, { method: 'POST' }),

  getSlots: (id, startDate, endDate, timezone = 'UTC') =>
    apiFetch(`/event-types/${id}/slots?startDate=${startDate}&endDate=${endDate}&timezone=${timezone}`),

   getEventTypeById: id =>
    apiFetch(`/event-types/${id}`)
};