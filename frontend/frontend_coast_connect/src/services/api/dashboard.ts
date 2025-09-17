import type { 
  DashboardStats,
  AnalyticsData,
  ApiResponse 
} from '../../types';
import { apiClient } from '../../utils/api';

export class DashboardService {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await apiClient.getDashboardStats();
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch dashboard statistics');
    }
  }

  /**
   * Get analytics data
   */
  static async getAnalytics(
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<ApiResponse<AnalyticsData>> {
    try {
      const response = await apiClient.request<AnalyticsData>(`/analytics?period=${period}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch analytics data');
    }
  }

  /**
   * Get reports trends
   */
  static async getReportsTrends(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<{
    trends: Array<{
      date: string;
      count: number;
      type?: string;
      severity?: string;
    }>;
  }>> {
    try {
      const response = await apiClient.request(
        `/analytics/trends?startDate=${startDate}&endDate=${endDate}`
      );
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch reports trends');
    }
  }

  /**
   * Get geographical distribution of reports
   */
  static async getGeographicalDistribution(): Promise<ApiResponse<{
    distribution: Array<{
      locationId: number;
      locationName: string;
      lat: number;
      lng: number;
      reportCount: number;
      severityBreakdown: Record<string, number>;
    }>;
  }>> {
    try {
      const response = await apiClient.request('/analytics/geographical');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch geographical distribution');
    }
  }

  /**
   * Get system health metrics
   */
  static async getSystemHealth(): Promise<ApiResponse<{
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    responseTime: number;
    activeUsers: number;
    systemLoad: number;
  }>> {
    try {
      const response = await apiClient.request('/dashboard/health');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch system health');
    }
  }

  /**
   * Get user activity metrics
   */
  static async getUserActivity(): Promise<ApiResponse<{
    activeUsers: number;
    newUsers: number;
    userGrowth: number;
    topContributors: Array<{
      userId: number;
      userName: string;
      reportCount: number;
    }>;
  }>> {
    try {
      const response = await apiClient.request('/dashboard/user-activity');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch user activity');
    }
  }

  /**
   * Export dashboard data
   */
  static async exportDashboardData(
    format: 'csv' | 'excel' | 'pdf' = 'csv'
  ): Promise<Blob> {
    try {
      const response = await fetch(`${apiClient.baseURL}/dashboard/export?format=${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return await response.blob();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to export dashboard data');
    }
  }
}

export default DashboardService;
