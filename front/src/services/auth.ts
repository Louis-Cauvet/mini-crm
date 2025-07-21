import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Configuration d'axios avec les cookies
axios.defaults.withCredentials = true;

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
}

export interface LoginData {
  email: string;
  motDePasse: string;
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthResponse {
  message: string;
  user: User;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return response.data;
  }

  async logout(): Promise<void> {
    await axios.post(`${API_BASE_URL}/auth/logout`);
  }

  async getMe(): Promise<{ user: User }> {
    const response = await axios.get(`${API_BASE_URL}/auth/me`);
    return response.data;
  }

  async checkAuth(): Promise<boolean> {
    try {
      await this.getMe();
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
