import type { 
  LoginCredentials, 
  RegisterData, 
  User, 
  AuthResponse,
  ApiResponse 
} from '../../types';
import { apiClient } from '../../utils/api';

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.login(credentials.email, credentials.password);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.register(userData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.getCurrentUser();
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get user data');
    }
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.logout();
    } catch (error) {
      console.warn('Logout error:', error);
      // Still remove token even if API call fails
      apiClient.removeToken();
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!apiClient.getToken();
  }

  /**
   * Get stored token
   */
  static getToken(): string | null {
    return apiClient.getToken();
  }

  /**
   * Refresh authentication token (if implemented)
   */
  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      // This would need to be implemented in your backend
      const response = await apiClient.request<{ token: string }>('/auth/refresh', {
        method: 'POST'
      });
      
      if (response.success && response.data?.token) {
        apiClient.setToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Token refresh failed');
    }
  }

  /**
   * Change user password
   */
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{}>> {
    try {
      const response = await apiClient.request('/users/change-password', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Password change failed');
    }
  }

  /**
   * Request password reset (if implemented)
   */
  static async requestPasswordReset(email: string): Promise<ApiResponse<{}>> {
    try {
      const response = await apiClient.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Password reset request failed');
    }
  }

  /**
   * Reset password with token (if implemented)
   */
  static async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<{}>> {
    try {
      const response = await apiClient.request('/auth/reset-password/confirm', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Password reset failed');
    }
  }
}

export default AuthService;
