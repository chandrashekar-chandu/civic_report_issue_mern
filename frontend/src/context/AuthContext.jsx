// src/context/AuthContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // REGISTER USER
  // ==========================================
  const register = async (formData) => {
    try {
      const response = await api.post(
        "/auth/register",
        formData
      );

      const { token, user } = response.data;

      // Save token
      localStorage.setItem("token", token);

      // Save user in state
      setUser(user);

      return response.data;
    } catch (error) {
      console.error(
        "Register Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // ==========================================
  // LOGIN USER
  // ==========================================
  const login = async (formData) => {
    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      const { token, user } = response.data;

      // Save token
      localStorage.setItem("token", token);

      // Save user in state
      setUser(user);

      return response.data;
    } catch (error) {
      console.error(
        "Login Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // ==========================================
  // LOGOUT USER
  // ==========================================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // ==========================================
  // FETCH CURRENT USER
  // ==========================================
  const getCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.error(
        "Get Current User Error:",
        error.response?.data || error.message
      );

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================
  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================
export const useAuth = () => {
  return useContext(AuthContext);
};