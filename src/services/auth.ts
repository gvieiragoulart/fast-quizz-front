import api from './api';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/api/auth/register', userData);
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
