// frontend/src/utils/api.js
const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };
  const res = await fetch(url, config);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
};

// quick smoke-test
// apiFetch("/").then(console.log).catch(console.error);