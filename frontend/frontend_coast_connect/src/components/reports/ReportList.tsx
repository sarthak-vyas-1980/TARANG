import React from 'react';
import { AlertCircle } from 'lucide-react';
import ReportCard from './ReportCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { Button } from '../ui';
import type { Report } from '../../types';

interface ReportListProps {
  reports: Report[];
  loading?: boolean;
  error?: string | null;
  onView?: (report: Report) => void;
  onEdit?: (report: Report) => void;
  onDelete?: (report: Report) => void;
  onUpdateStatus?: (report: Report) => void;
  onRetry?: () => void;
  emptyMessage?: string;
  currentUserId?: number;
  userRole?: string;
}

const ReportList: React.FC<ReportListProps> = ({
  reports,
  loading = false,
  error,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
  onRetry,
  emptyMessage = 'No reports found',
  currentUserId,
  userRole
}) => {
  // Loading state
  if (loading && reports.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading reports..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to load reports
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Empty state
  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          📋
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Reports Found
        </h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Loading overlay for refresh */}
      {loading && reports.length > 0 && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" text="Refreshing..." />
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            currentUserId={currentUserId}
            userRole={userRole}
          />
        ))}
      </div>

      {/* Reports Count */}
      <div className="text-center text-sm text-gray-500 mt-6">
        Showing {reports.length} report{reports.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default ReportList;
