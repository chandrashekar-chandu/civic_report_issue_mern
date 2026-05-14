// frontend/src/services/api.js

import axios from "axios";

// ==========================================
// AXIOS INSTANCE
// ==========================================
// Uses Render backend in production.
// Includes credentials and Authorization header.
// Logs errors to help debugging.
const api = axios.create({
  baseURL: "https://civic-report-issue-mern.onrender.com/api",
  withCredentials: false,
  timeout: 30000, // 30 seconds (Render free tier may take time to wake up)
});

// ==========================================
// REQUEST INTERCEPTOR
// Automatically attach JWT token
// ==========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// RESPONSE INTERCEPTOR
// Handle common errors globally
// ==========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response?.data || error.message
    );

    // If token is invalid or expired, logout user
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;