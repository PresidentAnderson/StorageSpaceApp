// API Client configuration

import { API_ENDPOINTS } from '../constants';
import { getFromStorage, saveToStorage, removeFromStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants';

const API_BASE_URL = process.env.API_URL || 'https://api.storagespace.app';
const API_TIMEOUT = 30000;

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
  timeout?: number;
}

class APIClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  /**
   * Get authentication token from storage
   */
  private async getAuthToken(): Promise<string | null> {
    return await getFromStorage<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Set authentication token in storage
   */
  async setAuthToken(token: string): Promise<void> {
    await saveToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  /**
   * Clear authentication token from storage
   */
  async clearAuthToken(): Promise<void> {
    await removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    await removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
    await removeFromStorage(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Build headers for request
   */
  private async buildHeaders(requiresAuth: boolean = false): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requiresAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Make HTTP request with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || response.statusText,
        data: errorData,
      };
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = false, timeout = this.defaultTimeout, ...options } = config;
    const headers = await this.buildHeaders(requiresAuth);
    const url = `${this.baseURL}${endpoint}`;

    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'GET',
        headers,
        ...options,
      },
      timeout
    );

    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = false, timeout = this.defaultTimeout, ...options } = config;
    const headers = await this.buildHeaders(requiresAuth);
    const url = `${this.baseURL}${endpoint}`;

    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      },
      timeout
    );

    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = false, timeout = this.defaultTimeout, ...options } = config;
    const headers = await this.buildHeaders(requiresAuth);
    const url = `${this.baseURL}${endpoint}`;

    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      },
      timeout
    );

    return this.handleResponse<T>(response);
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = false, timeout = this.defaultTimeout, ...options } = config;
    const headers = await this.buildHeaders(requiresAuth);
    const url = `${this.baseURL}${endpoint}`;

    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'PATCH',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      },
      timeout
    );

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = false, timeout = this.defaultTimeout, ...options } = config;
    const headers = await this.buildHeaders(requiresAuth);
    const url = `${this.baseURL}${endpoint}`;

    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'DELETE',
        headers,
        ...options,
      },
      timeout
    );

    return this.handleResponse<T>(response);
  }
}

// Create and export a singleton instance
export const apiClient = new APIClient();
export default apiClient;
