import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout, PageHeader } from '../../components/common';
import { Button, Alert } from '../../components/ui';
import { ReportForm } from '../../components/reports';
import { useAuth } from '../../contexts/AuthContext';
import { useReports } from '../../contexts/ReportsContext';
import { ReportsService } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { Report, CreateReportData, UpdateReportData } from '../../types';

const EditReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { updateReport, loading: updateLoading } = useReports();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    if (!id) {
      setError('Invalid report ID');
      setLoading(false);
      return;
    }

    try {
      const response = await ReportsService.getReport(parseInt(id));
      
      if (response.success && response.data) {
        const reportData = response.data.report;
        
        // Check if user can edit this report
        if (reportData.reporterId !== user?.id && user?.role !== 'OFFICIAL') {
          setError('You do not have permission to edit this report');
          setLoading(false);
          return;
        }

        setReport(reportData);
      } else {
        setError('Report not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateReportData) => {
    if (!report) return;

    try {
      const updateData: UpdateReportData = {
        type: data.type,
        description: data.description,
        severity: data.severity,
        locationName: data.locationName,
        lat: data.lat,
        lng: data.lng
      };

      const updatedReport = await updateReport(report.id, updateData);
      if (updatedReport) {
        navigate(`/reports/${report.id}`);
      }
    } catch (error) {
      console.error('Failed to update report:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading report..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="Edit Report"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Reports', href: '/reports' },
              { label: 'Edit Report' }
            ]}
          />

          <Alert variant="error" className="mb-6">
            {error}
          </Alert>

          <Button
            variant="outline"
            onClick={() => navigate('/reports')}
            leftIcon={<ArrowLeft size={16} />}
          >
            Back to Reports
          </Button>
        </div>
      </Layout>
    );
  }

  if (!report) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Report not found</p>
        </div>
      </Layout>
    );
  }

  const initialData: CreateReportData = {
    type: report.type,
    description: report.description,
    severity: report.severity,
    locationName: report.location?.name || '',
    lat: report.location?.lat || 0,
    lng: report.location?.lng || 0
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Edit Report"
          description={`Editing report #${report.id}`}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Reports', href: '/reports' },
            { label: `Report #${report.id}`, href: `/reports/${report.id}` },
            { label: 'Edit' }
          ]}
        />

        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            leftIcon={<ArrowLeft size={16} />}
          >
            Cancel Edit
          </Button>
        </div>

        <ReportForm
          onSubmit={handleSubmit}
          loading={updateLoading}
          initialData={initialData}
        />
      </div>
    </Layout>
  );
};

export default EditReportPage;
