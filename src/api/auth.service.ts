// Authentication service

import apiClient from './client';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';
import { saveToStorage, removeFromStorage } from '../utils/storage';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Save tokens and user data
    await apiClient.setAuthToken(response.token);
    await saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    await saveToStorage(STORAGE_KEYS.USER_DATA, response.user);

    return response;
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    // Save tokens and user data
    await apiClient.setAuthToken(response.token);
    await saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    await saveToStorage(STORAGE_KEYS.USER_DATA, response.user);

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, { requiresAuth: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      await apiClient.clearAuthToken();
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    // Update tokens
    await apiClient.setAuthToken(response.token);
    await saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

    return response;
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  /**
   * Social login (Google, Apple, Facebook)
   */
  async socialLogin(
    provider: 'google' | 'apple' | 'facebook',
    token: string
  ): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `/auth/${provider}`,
      { token }
    );

    // Save tokens and user data
    await apiClient.setAuthToken(response.token);
    await saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    await saveToStorage(STORAGE_KEYS.USER_DATA, response.user);

    return response;
  }
}

export const authService = new AuthService();
export default authService;
