import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { Layout, PageHeader } from '../../components/common';
import { Button, Card } from '../../components/ui';
import { ReportList, ReportDetailsModal } from '../../components/reports';
import { useAuth } from '../../contexts/AuthContext';
import { useReports } from '../../contexts/ReportsContext';
import { useState } from 'react';
import type { Report } from '../../types';

const MyReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reports, loading, error, fetchReports } = useReports();

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter reports to show only current user's reports
  const myReports = reports.filter(report => report.reporterId === user?.id);

  useEffect(() => {
    // Fetch reports when component mounts
    fetchReports();
  }, []);

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

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedReport(null);
  };

  // Calculate stats
  const stats = {
    total: myReports.length,
    pending: myReports.filter(r => r.status === 'PENDING').length,
    verified: myReports.filter(r => r.status === 'VERIFIED').length,
    rejected: myReports.filter(r => r.status === 'REJECTED').length
  };

  return (
    <Layout>
      <div>
        <PageHeader
          title="My Reports"
          description="View and manage your submitted hazard reports"
          action={{
            label: 'Create New Report',
            onClick: () => navigate('/reports/create'),
            icon: <Plus size={16} />
          }}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Reports', href: '/reports' },
            { label: 'My Reports' }
          ]}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 text-sm font-bold">P</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-semibold">{stats.pending}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-semibold">{stats.verified}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-sm font-bold">✗</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-semibold">{stats.rejected}</p>
              </div>
            </div>
          </Card>
        </div>

        <ReportList
          reports={myReports}
          loading={loading}
          error={error}
          onView={handleViewReport}
          onEdit={handleEditReport}
          onDelete={handleDeleteReport}
          onRetry={fetchReports}
          currentUserId={user?.id}
          userRole={user?.role}
          emptyMessage="You haven't submitted any reports yet. Create your first report to get started!"
        />

        <ReportDetailsModal
          report={selectedReport}
          isOpen={showDetailsModal}
          onClose={handleCloseModal}
          onEdit={handleEditReport}
          currentUserId={user?.id}
          userRole={user?.role}
        />
      </div>
    </Layout>
  );
};

export default MyReportsPage;
