// src/services/auth.service.js
import api from "../utils/axios";

const AuthService = {
  async login(username, password) {
    const response = await api.post("/admin/login", { username, password });
    if (response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/admin/profile");
    return response.data;
  },

  logout() {
    localStorage.removeItem("adminToken");
  },

  getToken() {
    return localStorage.getItem("adminToken");
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default AuthService;
