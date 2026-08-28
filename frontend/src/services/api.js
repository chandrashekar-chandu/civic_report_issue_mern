import axios from "axios";

const api = axios.create({
  baseURL: "https://civic-report-issue-mern-1.onrender.com/api",
  //  baseURL: "http://localhost:5002/api",
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;