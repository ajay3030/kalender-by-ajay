// frontend/src/utils/authAPI.js
import { apiFetch } from "./api";

const token = () => localStorage.getItem("token");

export const authAPI = {
  registerUser: (data) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  loginUser:    (data) => apiFetch("/auth/login",    { method: "POST", body: JSON.stringify(data) }),
  logoutUser:   () => apiFetch("/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${token()}` } }),
  getCurrentUser: () => apiFetch("/auth/profile", { headers: { Authorization: `Bearer ${token()}` } }),
  updateProfile: (data) =>
    apiFetch("/auth/profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
};