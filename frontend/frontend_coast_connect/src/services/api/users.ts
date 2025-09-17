import type { 
  User, 
  UpdateUserRequest,
  ChangePasswordRequest,
  ApiResponse 
} from '../../types';
import { apiClient } from '../../utils/api';

export class UsersService {
  /**
   * Get all users (for admins/officials)
   */
  static async getUsers(): Promise<ApiResponse<{ users: User[] }>> {
    try {
      const response = await apiClient.request<{ users: User[] }>('/users');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }

  /**
   * Get user by ID
   */
  static async getUser(id: number): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.request<{ user: User }>(`/users/${id}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.request<{ user: User }>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update user');
    }
  }

  /**
   * Update current user profile
   */
  static async updateCurrentUser(userData: UpdateUserRequest): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.request<{ user: User }>('/users/me', {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }

  /**
   * Change user password
   */
  static async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<{}>> {
    try {
      const response = await apiClient.request('/users/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData)
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to change password');
    }
  }

  /**
   * Delete user account
   */
  static async deleteUser(id: number): Promise<ApiResponse<{}>> {
    try {
      const response = await apiClient.request(`/users/${id}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(id: number): Promise<ApiResponse<{
    totalReports: number;
    verifiedReports: number;
    pendingReports: number;
    rejectedReports: number;
  }>> {
    try {
      const response = await apiClient.request(`/users/${id}/stats`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch user statistics');
    }
  }

  /**
   * Get current user statistics
   */
  static async getCurrentUserStats(): Promise<ApiResponse<{
    totalReports: number;
    verifiedReports: number;
    pendingReports: number;
    rejectedReports: number;
  }>> {
    try {
      const response = await apiClient.request('/users/me/stats');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch user statistics');
    }
  }

  /**
   * Upload user avatar (if implemented)
   */
  static async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${apiClient.baseURL}/users/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Avatar upload failed');
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to upload avatar');
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: string): Promise<ApiResponse<{ users: User[] }>> {
    try {
      const response = await apiClient.request<{ users: User[] }>(`/users?role=${role}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch users by role');
    }
  }
}

export default UsersService;
