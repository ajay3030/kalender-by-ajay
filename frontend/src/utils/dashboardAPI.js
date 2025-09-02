// frontend/src/utils/dashboardAPI.js
import { apiFetch } from './api';

export const dashboardAPI = {
  getDashboardStats: () => apiFetch('/user/dashboard'),
};