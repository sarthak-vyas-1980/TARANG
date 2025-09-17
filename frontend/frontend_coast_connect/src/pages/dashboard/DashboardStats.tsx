// src/types/dashboard.ts

import type { Reports } from '../reports';

// Dashboard statistics summary
export  interface DashboardStats {
  totalReports: number;               // Total number of reports in the system
  verifiedReports: number;            // Number of reports verified by officials
  pendingReports: number;             // Number of reports awaiting review
  rejectedReports: number;            // Number of reports rejected
  highSeverityReports: number;        // Number of reports with high severity
  reportsThisMonth: number;           // Number of reports submitted in the current month
  reportsLastMonth: number;           // Number of reports submitted in the previous month
  
  reportsByType: Array<{
    type: string;                    // Hazard type (e.g., 'TSUNAMI')
    count: number;                   // Number of reports of this type
    percentage: number;              // Percentage relative to total reports
  }>;

  reportsBySeverity: Array<{
    severity: string;                // Severity level ('LOW', 'MEDIUM', 'HIGH')
    count: number;                  
    percentage: number;
  }>;

  reportsByStatus: Array<{
    status: string;                  // Status ('PENDING', 'VERIFIED', etc.)
    count: number;
    percentage: number;
  }>;

  recentReports: Report[];           // Array of latest submitted reports (sorted descending)

  // Optional fields for extended analytics
  averageResponseTime?: number;      // Average time taken to verify reports (in hours)
  topReportingUsers?: Array<{
    userId: number;
    userName: string;
    reportCount: number;
  }>;
}
