import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useReportsContext } from '../contexts/ReportsContext';
import Card from '../components/ui/Card';

const AdminDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const { reports, getReportsByStatus } = useReportsContext();

  if (!user || user.role !== 'official') {
    return <Navigate to="/dashboard" replace />;
  }

  const totalReports = reports.length;
  const pendingReports = getReportsByStatus('pending').length;
  const verifiedReports = getReportsByStatus('verified').length;
  const rejectedReports = getReportsByStatus('rejected').length;
  const criticalReports = reports.filter((r) => r.severity === 'critical').length;
  const recentReports = reports.filter((r) => Date.now() - new Date(r.createdAt).getTime() <= 24 * 60 * 60 * 1000).length;

  const StatCard = ({
    title,
    value,
    icon,
    color,
    description,
  }: {
    title: string;
    value: number;
    icon?: React.ReactNode;
    color: string;
    description?: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="text-3xl" style={{ color }}>
          {icon || '📊'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-2">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card padding="lg" shadow="sm" className="mb-0">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-gray-700 mt-2">Monitor and manage ocean hazard reports</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Reports" value={totalReports} color="#3B82F6" description="All time reports" />
          <StatCard title="Pending Verification" value={pendingReports} color="#F59E0B" description="Awaiting review" />
          <StatCard title="Verified Reports" value={verifiedReports} color="#10B981" description="Approved reports" />
          <StatCard title="Rejected Reports" value={rejectedReports} color="#EF4444" description="Declined reports" />
          <StatCard title="Critical Alerts" value={criticalReports} color="#DC2626" description="High priority" />
          <StatCard title="Recent (24h)" value={recentReports} color="#8B5CF6" description="Last 24 hours" />
        </div>

        <Card padding="lg" shadow="sm" className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 bg-blue-50 text-primary rounded-md hover:bg-blue-100 transition-colors">
              <span className="text-2xl mr-3">📋</span>
              <span className="font-medium">Verify Reports</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-green-50 text-primary rounded-md hover:bg-green-100 transition-colors">
              <span className="text-2xl mr-3">📈</span>
              <span className="font-medium">View Analytics</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-purple-50 text-primary rounded-md hover:bg-purple-100 transition-colors">
              <span className="text-2xl mr-3">🌊</span>
              <span className="font-medium">Issue Alert</span>
            </button>
          </div>
        </Card>

        <Card padding="lg" shadow="sm">
          <h2 className="text-xl font-semibold text-primary mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New report submitted', location: 'Chennai Coast', time: '2 minutes ago', type: 'new' },
              { action: 'Report verified', location: 'Mumbai Harbor', time: '15 minutes ago', type: 'verified' },
              { action: 'Critical alert issued', location: 'Kochi Beach', time: '1 hour ago', type: 'critical' },
              { action: 'Report rejected', location: 'Visakhapatnam Port', time: '3 hours ago', type: 'rejected' },
            ].map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    item.type === 'new'
                      ? 'bg-blue-500'
                      : item.type === 'verified'
                      ? 'bg-green-500'
                      : item.type === 'critical'
                      ? 'bg-red-500'
                      : 'bg-gray-500'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-500">
                    {item.location} • {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
