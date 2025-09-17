import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Layout, PageHeader } from '../../components/common';
import { Button, Alert, Card } from '../../components/ui';
import { ReportStatusBadge } from '../../components/reports';
import { useAuth } from '../../contexts/AuthContext';
import { ReportsService } from '../../services';
import { dateFormatters, hazardFormatters, locationFormatters } from '../../utils/formatters';
import { getSeverityColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { Report } from '../../types';

const ViewReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

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
        setReport(response.data.report);
      } else {
        setError('Report not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (report) {
      navigate(`/reports/${report.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!report) return;

    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        await ReportsService.deleteReport(report.id);
        navigate('/reports');
      } catch (err) {
        console.error('Failed to delete report:', err);
      }
    }
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
            title="Report Details"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Reports', href: '/reports' },
              { label: 'Report Details' }
            ]}
          />

          <Alert variant="error" className="mb-6">
            <AlertCircle size={16} className="mr-2" />
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

  const canEdit = user?.id === report.reporterId;
  const canDelete = canEdit || user?.role === 'OFFICIAL';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title={`Report #${report.id}`}
          description={hazardFormatters.type(report.type)}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Reports', href: '/reports' },
            { label: `Report #${report.id}` }
          ]}
        />

        <div className="mb-6 flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/reports')}
            leftIcon={<ArrowLeft size={16} />}
          >
            Back to Reports
          </Button>

          {canEdit && (
            <Button
              variant="outline"
              onClick={handleEdit}
              leftIcon={<Edit2 size={16} />}
            >
              Edit Report
            </Button>
          )}

          {canDelete && (
            <Button
              variant="danger"
              onClick={handleDelete}
              leftIcon={<Trash2 size={16} />}
            >
              Delete Report
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Header */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                  {hazardFormatters.type(report.type)}
                </h1>
                <ReportStatusBadge status={report.status} />
              </div>

              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium mb-4 ${getSeverityColor(report.severity)}`}>
                {hazardFormatters.severity(report.severity).icon} {hazardFormatters.severity(report.severity).text} Severity
              </div>

              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {report.description}
              </p>
            </Card>

            {/* Location Info */}
            {report.location && (
              <Card>
                <h2 className="text-lg font-semibold mb-4">Location</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Location Name:</span>
                    <p className="text-gray-900">{report.location.name}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Coordinates:</span>
                    <p className="text-gray-900">
                      {locationFormatters.coordinates(report.location.lat, report.location.lng)}
                    </p>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Lat: {report.location.lat.toFixed(6)}, Lng: {report.location.lng.toFixed(6)}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Info */}
            <Card>
              <h3 className="font-semibold mb-4">Report Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Report ID:</span>
                  <p className="font-mono text-sm">#{report.id}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Type:</span>
                  <p className="font-medium">{hazardFormatters.type(report.type)}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Severity:</span>
                  <p className="font-medium">{hazardFormatters.severity(report.severity).text}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="mt-1">
                    <ReportStatusBadge status={report.status} size="sm" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Reporter Info */}
            {report.reporter && (
              <Card>
                <h3 className="font-semibold mb-4">Reporter</h3>
                <div className="space-y-2">
                  <p className="font-medium">
                    {report.reporter.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {report.reporter.email}
                  </p>
                </div>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <h3 className="font-semibold mb-4">Timeline</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Created:</span>
                  <p className="text-sm">{dateFormatters.short(report.createdAt)}</p>
                </div>
                
                {report.updatedAt !== report.createdAt && (
                  <div>
                    <span className="text-sm text-gray-600">Last updated:</span>
                    <p className="text-sm">{dateFormatters.short(report.updatedAt)}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewReportPage;
