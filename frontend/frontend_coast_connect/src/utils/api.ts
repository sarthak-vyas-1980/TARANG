import type { 
  ApiResponse, 
  User, 
  Report, 
  CreateReportData,
  AuthResponse
} from '../types';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from './constants';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Token management
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Headers configuration
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          this.removeToken();
          window.location.href = '/login';
          throw new Error('Authentication failed');
        }
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData: any): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>(API_ENDPOINTS.ME);
  }

  async logout(): Promise<void> {
    try {
      await this.request(API_ENDPOINTS.LOGOUT, { method: 'POST' });
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.removeToken();
    }
  }
  
   
  // Reports methods
  async createReport(reportData: CreateReportData): Promise<ApiResponse<{ report: Report }>> {
    return this.request<{ report: Report }>(API_ENDPOINTS.REPORTS, {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async getReports(params?: Record<string, any>): Promise<ApiResponse<{ reports: Report[] }>> {
    const queryString = params 
      ? '?' + new URLSearchParams(params).toString() 
      : '';
    return this.request<{ reports: Report[] }>(`${API_ENDPOINTS.REPORTS}${queryString}`);
  }

  async getReport(id: number): Promise<ApiResponse<{ report: Report }>> {
    return this.request<{ report: Report }>(API_ENDPOINTS.REPORT_BY_ID(id));
  }

  async updateReportStatus(id: number, status: string): Promise<ApiResponse<{ report: Report }>> {
    return this.request<{ report: Report }>(API_ENDPOINTS.UPDATE_REPORT_STATUS(id), {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteReport(id: number): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.REPORT_BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Dashboard methods
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DASHBOARD);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.HEALTH);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
