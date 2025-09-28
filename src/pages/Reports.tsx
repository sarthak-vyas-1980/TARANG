// src/pages/Reports.tsx
import React from 'react';
import useAuth from '../hooks/useAuth';
import { ReportList, ReportVerification } from '../components/reports';
import Card from '../components/ui/Card';

export const Reports: React.FC = () => {
  const { isOfficial } = useAuth();

  return (
    <div className="min-h-screen py-8 px-2">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card padding="lg" shadow="sm">
          <h1 className="text-2xl font-bold text-primary">
            {isOfficial ? 'Report Management' : 'Hazard Reports'}
          </h1>
          <p className="text-gray-700 mt-1">
            {isOfficial 
              ? 'Review, verify, and manage hazard reports from citizens and field personnel'
              : 'View all hazard reports and track their verification status'
            }
          </p>
        </Card>

        {isOfficial ? (
          <ReportVerification />
        ) : (
          <ReportList />
        )}
      </div>
    </div>
  );
};

export default Reports;