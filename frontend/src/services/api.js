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
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  googleLogin: (tokenData) =>
    apiRequest('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify(tokenData),
    }),
  registerStudent: (userData) =>
    apiRequest('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  registerOrganizer: (userData) =>
    apiRequest('/auth/register/organizer', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  forgotPassword: (email) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  verifyOtp: (email, otp) =>
    apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),
  resetPassword: (email, otp, newPassword) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    }),
  getProfile: () => apiRequest('/auth/profile'),
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
