const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = {
  get: (path, auth = false) =>
    fetch(`${BASE_URL}${path}`, {
      headers: auth
        ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
        : {},
    }),

  post: (path, body, auth = false) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth && { Authorization: `Bearer ${localStorage.getItem("token")}` }),
      },
      body: JSON.stringify(body),
    }),

  put: (path, body = {}, auth = false) =>
    fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(auth && { Authorization: `Bearer ${localStorage.getItem("token")}` }),
      },
      body: JSON.stringify(body),
    }),

  delete: (path, auth = false) =>
    fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: auth
        ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
        : {},
    }),
};
