import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout, PageHeader } from '../../components/common';
import { Button } from '../../components/ui';
import { ReportForm } from '../../components/reports';
import { useReports } from '../../contexts/ReportsContext';
import type { CreateReportData } from '../../types';

const CreateReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { createReport, loading } = useReports();

  const handleSubmit = async (data: CreateReportData) => {
    try {
      const newReport = await createReport(data);
      if (newReport) {
        navigate('/reports');
      }
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Create New Report"
          description="Report a new ocean hazard to alert the community and authorities"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Reports', href: '/reports' },
            { label: 'Create Report' }
          ]}
        />

        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            leftIcon={<ArrowLeft size={16} />}
          >
            Back to Reports
          </Button>
        </div>

        <ReportForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </Layout>
  );
};

export default CreateReportPage;
