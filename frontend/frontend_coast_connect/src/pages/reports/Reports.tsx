import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import { Layout, PageHeader } from '../../components/common';
import { Button } from '../../components/ui';
import { ReportList, ReportFilters, ReportDetailsModal } from '../../components/reports';
import { useAuth } from '../../contexts/AuthContext';
import { useReports } from '../../contexts/ReportsContext';
import type { Report, ReportFilters as Filters } from '../../types';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { 
    reports, 
    loading, 
    error, 
    filters, 
    setFilters, 
    clearFilters,
    fetchReports 
  } = useReports();

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters: Partial<Filters> = {};
    
    if (searchParams.get('type')) urlFilters.type = searchParams.get('type') as any;
    if (searchParams.get('status')) urlFilters.status = searchParams.get('status') as any;
    if (searchParams.get('severity')) urlFilters.severity = searchParams.get('severity') as any;
    if (searchParams.get('search')) urlFilters.search = searchParams.get('search') as any;

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, String(value));
      }
    });

    setSearchParams(newParams);
  }, [filters]);

  const handleFiltersChange = (newFilters: Partial<Filters>) => {
    setFilters(newFilters);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleEditReport = (report: Report) => {
    navigate(`/reports/${report.id}/edit`);
  };

  const handleDeleteReport = (report: Report) => {
    // Implement delete functionality
    console.log('Delete report:', report.id);
  };

  const handleUpdateStatus = (report: Report) => {
    // Implement status update functionality
    console.log('Update status for report:', report.id);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedReport(null);
  };

  return (
    <Layout>
      <div>
        <PageHeader
          title="All Reports"
          description="Browse and manage hazard reports from the community"
          action={{
            label: 'Create Report',
            onClick: () => navigate('/reports/create'),
            icon: <Plus size={16} />
          }}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Reports' }
          ]}
        />

        <ReportFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
          loading={loading}
        />

        <ReportList
          reports={reports}
          loading={loading}
          error={error}
          onView={handleViewReport}
          onEdit={handleEditReport}
          onDelete={handleDeleteReport}
          onUpdateStatus={handleUpdateStatus}
          onRetry={fetchReports}
          currentUserId={user?.id}
          userRole={user?.role}
          emptyMessage="No reports match your current filters. Try adjusting your search criteria."
        />

        <ReportDetailsModal
          report={selectedReport}
          isOpen={showDetailsModal}
          onClose={handleCloseModal}
          onEdit={handleEditReport}
          onUpdateStatus={handleUpdateStatus}
          currentUserId={user?.id}
          userRole={user?.role}
        />
      </div>
    </Layout>
  );
};

export default ReportsPage;
