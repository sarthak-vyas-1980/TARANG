import type { ApiResponse, BaseQueryParams } from './common';
import type { User, LoginCredentials, RegisterData } from './user';
import type { Report, CreateReportData, UpdateReportData, UpdateReportStatusData, ReportFilters, Location } from './reports';
import type { AuthResponse } from './auth';

// Authentication API types
export interface LoginApiRequest extends LoginCredentials {}

export interface RegisterApiRequest extends RegisterData {}

export interface LoginApiResponse extends ApiResponse<AuthResponse> {}

export interface RegisterApiResponse extends ApiResponse<AuthResponse> {}

export interface MeApiResponse extends ApiResponse<{ user: User }> {}

// Reports API types
export interface CreateReportApiRequest extends CreateReportData {}

export interface UpdateReportApiRequest extends UpdateReportData {}

export interface UpdateReportStatusApiRequest extends UpdateReportStatusData {}

export interface GetReportsApiResponse extends ApiResponse<{ reports: Report[] }> {}

export interface GetReportApiResponse extends ApiResponse<{ report: Report }> {}

export interface CreateReportApiResponse extends ApiResponse<{ report: Report }> {}

export interface UpdateReportApiResponse extends ApiResponse<{ report: Report }> {}

export interface DeleteReportApiResponse extends ApiResponse<{}> {}

export interface ReportsQueryParams extends BaseQueryParams, ReportFilters {}

// Dashboard and Analytics API types
export interface DashboardStats {
  totalReports: number;
  verifiedReports: number;
  pendingReports: number;
  highSeverityReports: number;
  reportsThisMonth: number;
  reportsLastMonth: number;
  reportsByType: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  reportsBySeverity: Array<{
    severity: string;
    count: number;
    percentage: number;
  }>;
  reportsByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  recentReports: Report[];
}

export interface DashboardApiResponse extends ApiResponse<DashboardStats> {}

export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year';
  data: Array<{
    date: string;
    count: number;
    type?: string;
    severity?: string;
  }>;
}

export interface AnalyticsApiResponse extends ApiResponse<AnalyticsData> {}

// Location API types
export interface GetLocationsApiResponse extends ApiResponse<{ locations: Location[] }> {}

export interface CreateLocationApiResponse extends ApiResponse<{ location: Location }> {}

// File upload types
export interface FileUploadResponse {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
}

export interface FileUploadApiResponse extends ApiResponse<FileUploadResponse> {}

// Health check response
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version?: string;
  database?: 'connected' | 'disconnected';
}

export interface HealthCheckApiResponse extends ApiResponse<HealthCheckResponse> {}

// API client configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// API endpoint definitions
export interface ApiEndpoints {
  // Auth endpoints
  login: string;
  register: string;
  logout: string;
  me: string;
  refreshToken: string;
  
  // Report endpoints
  reports: string;
  createReport: string;
  getReport: (id: number) => string;
  updateReport: (id: number) => string;
  deleteReport: (id: number) => string;
  updateReportStatus: (id: number) => string;
  
  // User endpoints
  users: string;
  updateUser: (id: number) => string;
  changePassword: string;
  
  // Location endpoints
  locations: string;
  createLocation: string;
  
  // Analytics endpoints
  dashboard: string;
  analytics: string;
  
  // Health check
  health: string;
}

// WebSocket message types (for future real-time features)
export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: string;
}

export interface ReportUpdateMessage extends WebSocketMessage {
  type: 'REPORT_UPDATE';
  payload: {
    reportId: number;
    status: string;
    updatedBy: number;
  };
}

export interface NewReportMessage extends WebSocketMessage {
  type: 'NEW_REPORT';
  payload: Report;
}
