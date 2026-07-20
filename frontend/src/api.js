const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token }),

  getBooks: (token, shelf) =>
    request(`/books${shelf ? `?shelf=${encodeURIComponent(shelf)}` : ""}`, { token }),
  searchBooks: (token, q) => request(`/books/search?q=${encodeURIComponent(q)}`, { token }),
  addBook: (token, payload) => request("/books", { method: "POST", body: payload, token }),
  updateBook: (token, id, payload) =>
    request(`/books/${id}`, { method: "PATCH", body: payload, token }),
  deleteBook: (token, id) => request(`/books/${id}`, { method: "DELETE", token }),

  getJournal: (token, bookId) => request(`/journal/${bookId}`, { token }),
  saveJournal: (token, bookId, payload) =>
    request(`/journal/${bookId}`, { method: "PUT", body: payload, token }),

  getOverview: (token) => request("/stats/overview", { token }),
  getHistory: (token) => request("/stats/history", { token }),
};
