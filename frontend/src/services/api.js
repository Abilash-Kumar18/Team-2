const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// API Services
export const authService = {
  login: (credentials) =>
    apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  getProfile: () => apiRequest('/users/profile'),
};

export const eventService = {
  getAll: () => apiRequest('/events'),
  getById: (id) => apiRequest(`/events/${id}`),
  create: (eventData) =>
    apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
  register: (id) =>
    apiRequest(`/events/${id}/register`, {
      method: 'POST',
    }),
};

export const scanService = {
  checkIn: (qrCodeData) =>
    apiRequest('/scan', {
      method: 'POST',
      body: JSON.stringify({ qrCodeData }),
    }),
};
