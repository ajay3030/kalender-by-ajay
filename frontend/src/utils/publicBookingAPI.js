// frontend/src/utils/publicBookingAPI.js
import { apiFetch } from './api';

export const publicBookingAPI = {
  getPublicEventType: slug => apiFetch(`/public/book/${slug}`),
  getAvailableSlots: (eventTypeId, startDate, endDate) => apiFetch(`/public/slots/${eventTypeId}?startDate=${startDate}&endDate=${endDate}`),
  checkSlotAvailability: (eventTypeId, dateTime) => apiFetch(`/public/check-slot/${eventTypeId}`, { method: 'POST', body: JSON.stringify({ dateTime }) }),
  createBooking: data => apiFetch(`/public/book/${data.eventTypeId}`, { method: 'POST', body: JSON.stringify(data) }),
  getBookingDetails: id => apiFetch(`/public/booking/${id}/confirm`),
  cancelBooking: (bookingId, token) => apiFetch(`/public/booking/${bookingId}/cancel`, { method: 'POST', body: JSON.stringify({ token }) }),
};