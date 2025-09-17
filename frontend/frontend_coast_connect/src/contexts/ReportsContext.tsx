import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ReportsService, NotificationService } from '../services';
import type { 
  Report, 
  CreateReportData, 
  UpdateReportData,
  ReportFilters,
  ApiResponse 
} from '../types';

interface ReportsContextType {
  reports: Report[];
  loading: boolean;
  error: string | null;
  filters: ReportFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  
  // Actions
  fetchReports: (filters?: ReportFilters) => Promise<void>;
  createReport: (data: CreateReportData) => Promise<Report | null>;
  updateReport: (id: number, data: UpdateReportData) => Promise<Report | null>;
  updateReportStatus: (id: number, status: string) => Promise<Report | null>;
  deleteReport: (id: number) => Promise<boolean>;
  setFilters: (filters: Partial<ReportFilters>) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  refreshReports: () => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

interface ReportsProviderProps {
  children: ReactNode;
}

export const ReportsProvider: React.FC<ReportsProviderProps> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ReportFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch reports with current filters and pagination
  const fetchReports = useCallback(async (newFilters?: ReportFilters): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const currentFilters = newFilters || filters;
      const params = {
        ...currentFilters,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await ReportsService.getReports(params);
      
      if (response.success && response.data) {
        setReports(response.data.reports);
        
        // Update pagination if metadata is available
        if (response.meta) {
          setPagination(prev => ({
            ...prev,
            total: response.meta!.total,
            hasNext: response.meta!.hasNextPage,
            hasPrev: response.meta!.hasPrevPage
          }));
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reports';
      setError(errorMessage);
      NotificationService.error('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Create new report
  const createReport = async (data: CreateReportData): Promise<Report | null> => {
    try {
      setLoading(true);
      const response = await ReportsService.createReport(data);
      
      if (response.success && response.data) {
        const newReport = response.data.report;
        setReports(prev => [newReport, ...prev]);
        NotificationService.success('Success', 'Report created successfully');
        return newReport;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create report';
      NotificationService.error('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing report
  const updateReport = async (id: number, data: UpdateReportData): Promise<Report | null> => {
    try {
      setLoading(true);
      const response = await ReportsService.updateReport(id, data);
      
      if (response.success && response.data) {
        const updatedReport = response.data.report;
        setReports(prev => 
          prev.map(report => 
            report.id === id ? updatedReport : report
          )
        );
        NotificationService.success('Success', 'Report updated successfully');
        return updatedReport;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update report';
      NotificationService.error('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update report status (for officials)
  const updateReportStatus = async (id: number, status: string): Promise<Report | null> => {
    try {
      setLoading(true);
      const response = await ReportsService.updateReportStatus(id, { status });
      
      if (response.success && response.data) {
        const updatedReport = response.data.report;
        setReports(prev => 
          prev.map(report => 
            report.id === id ? updatedReport : report
          )
        );
        NotificationService.success('Success', 'Report status updated successfully');
        return updatedReport;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update report status';
      NotificationService.error('Error', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete report
  const deleteReport = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await ReportsService.deleteReport(id);
      
      if (response.success) {
        setReports(prev => prev.filter(report => report.id !== id));
        NotificationService.success('Success', 'Report deleted successfully');
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete report';
      NotificationService.error('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Set filters and refetch
  const setFilters = useCallback((newFilters: Partial<ReportFilters>): void => {
    const updatedFilters = { ...filters, ...newFilters };
    setFiltersState(updatedFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchReports(updatedFilters);
  }, [filters, fetchReports]);

  // Clear all filters
  const clearFilters = useCallback((): void => {
    setFiltersState({});
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchReports({});
  }, [fetchReports]);

  // Set page and refetch
  const setPage = useCallback((page: number): void => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Refresh reports with current filters
  const refreshReports = useCallback(async (): Promise<void> => {
    await fetchReports(filters);
  }, [fetchReports, filters]);

  // Fetch reports on pagination change
  useEffect(() => {
    fetchReports();
  }, [pagination.page]);

  // Initial load
  useEffect(() => {
    fetchReports();
  }, []);

  const value: ReportsContextType = {
    reports,
    loading,
    error,
    filters,
    pagination,
    fetchReports,
    createReport,
    updateReport,
    updateReportStatus,
    deleteReport,
    setFilters,
    clearFilters,
    setPage,
    refreshReports
  };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
};

export const useReports = (): ReportsContextType => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};
