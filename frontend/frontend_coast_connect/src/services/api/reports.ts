import type { 
  Report, 
  CreateReportData, 
  UpdateReportData,
  UpdateReportStatusData,
  ReportFilters,
  ApiResponse 
} from '../../types';
import { apiClient } from '../../utils/api';
import { buildQueryString } from '../../utils/helpers';

export class ReportsService {
  /**
   * Get all reports with optional filters
   */
  static async getReports(filters?: ReportFilters): Promise<ApiResponse<{ reports: Report[] }>> {
    try {
      const queryString = filters ? buildQueryString(filters) : '';
      const response = await apiClient.getReports(filters);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch reports');
    }
  }

  /**
   * Get single report by ID
   */
  static async getReport(id: number): Promise<ApiResponse<{ report: Report }>> {
    try {
      const response = await apiClient.getReport(id);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch report');
    }
  }

  /**
   * Create new report
   */
  static async createReport(reportData: CreateReportData): Promise<ApiResponse<{ report: Report }>> {
    try {
      const response = await apiClient.createReport(reportData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create report');
    }
  }

  /**
   * Update existing report (for report owners)
   */
  static async updateReport(id: number, reportData: UpdateReportData): Promise<ApiResponse<{ report: Report }>> {
    try {
      const response = await apiClient.request<{ report: Report }>(`/reports/${id}`, {
        method: 'PUT',
        body: JSON.stringify(reportData)
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update report');
    }
  }

  /**
   * Update report status (for officials)
   */
  static async updateReportStatus(
    id: number, 
    statusData: UpdateReportStatusData
  ): Promise<ApiResponse<{ report: Report }>> {
    try {
      const response = await apiClient.updateReportStatus(id, statusData.status);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update report status');
    }
  }

  /**
   * Delete report
   */
  static async deleteReport(id: number): Promise<ApiResponse<{}>> {
    try {
      const response = await apiClient.deleteReport(id);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete report');
    }
  }

  /**
   * Get reports by user
   */
  static async getReportsByUser(userId: number): Promise<ApiResponse<{ reports: Report[] }>> {
    try {
      const response = await apiClient.getReports({ reporterId: userId });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch user reports');
    }
  }

  /**
   * Get reports by location
   */
  static async getReportsByLocation(locationId: number): Promise<ApiResponse<{ reports: Report[] }>> {
    try {
      const response = await apiClient.getReports({ locationId });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch location reports');
    }
  }

  /**
   * Get reports statistics
   */
  static async getReportsStats(): Promise<ApiResponse<{
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
  }>> {
    try {
      const response = await apiClient.request('/reports/stats');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch reports statistics');
    }
  }

  /**
   * Search reports
   */
  static async searchReports(query: string): Promise<ApiResponse<{ reports: Report[] }>> {
    try {
      const response = await apiClient.getReports({ search: query });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to search reports');
    }
  }

  /**
   * Get recent reports
   */
  static async getRecentReports(limit: number = 10): Promise<ApiResponse<{ reports: Report[] }>> {
    try {
      const response = await apiClient.getReports({ limit, sort: 'createdAt', order: 'desc' });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch recent reports');
    }
  }

  /**
   * Get high severity reports
   */
  static async getHighSeverityReports(): Promise<ApiResponse<{ reports: Report[] }>> {
    try {
      const response = await apiClient.getReports({ severity: 'HIGH' });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch high severity reports');
    }
  }

  /**
   * Get pending reports (for officials)
   */
  static async getPendingReports(): Promise<ApiResponse<{ reports: Report[] }>> {
    try {
      const response = await apiClient.getReports({ status: 'PENDING' });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch pending reports');
    }
  }
}

export default ReportsService;
