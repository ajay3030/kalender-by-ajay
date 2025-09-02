// frontend/src/utils/profileAPI.js
import { apiFetch } from './api';

export const profileAPI = {
  getUserProfile: () => apiFetch('/user/profile'),
  updateProfile:  data => apiFetch('/user/profile', { method: 'PUT', body: JSON.stringify(data) }),
  uploadAvatar:   form => apiFetch('/user/upload-avatar', { method: 'POST', body: form }),
  changePassword: data => apiFetch('/user/change-password', { method: 'PUT', body: JSON.stringify(data) }),
  getSettings:    () => apiFetch('/user/settings'),
  updateSettings: data => apiFetch('/user/settings', { method: 'PUT', body: JSON.stringify(data) }),
};
