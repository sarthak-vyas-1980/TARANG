import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle, CheckCircle, Clock, BarChart3, MapPin, TrendingUp } from 'lucide-react';
import { Layout, PageHeader } from '../../components/common';
import { Card, Button, Badge } from '../../components/ui';
import { ReportCard, ReportList } from '../../components/reports';
import { useAuth } from '../../contexts/AuthContext';
import { useReports } from '../../contexts/ReportsContext';
import { ReportsService } from '../../services';
import { formatNumber } from '../../utils/helpers';
import type { Report } from '../../types';

interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  verifiedReports: number;
  highSeverityReports: number;
  myReports?: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reports, loading: reportsLoading, fetchReports } = useReports();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    pendingReports: 0,
    verifiedReports: 0,
    highSeverityReports: 0,
    myReports: 0
  });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent reports
      await fetchReports({ limit: 10, sort: 'createdAt', order: 'desc' });
      
      // Calculate stats from reports
      const allReports = reports;
      const myReports = allReports.filter(report => report.reporterId === user?.id);
      
      setStats({
        totalReports: allReports.length,
        pendingReports: allReports.filter(r => r.status === 'PENDING').length,
        verifiedReports: allReports.filter(r => r.status === 'VERIFIED').length,
        highSeverityReports: allReports.filter(r => r.severity === 'HIGH').length,
        myReports: myReports.length
      });
      
      setRecentReports(allReports.slice(0, 5));
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report: Report) => {
    navigate(`/reports/${report.id}`);
  };

  const handleEditReport = (report: Report) => {
    navigate(`/reports/${report.id}/edit`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'OFFICIAL':
        return {
          title: 'Official Dashboard',
          description: 'Monitor and manage hazard reports across your jurisdiction',
          primaryAction: 'Review Pending Reports',
          primaryActionUrl: '/reports?status=PENDING'
        };
      case 'ANALYST':
        return {
          title: 'Analyst Dashboard',
          description: 'Analyze hazard patterns and generate insights',
          primaryAction: 'View Analytics',
          primaryActionUrl: '/analytics'
        };
      default:
        return {
          title: 'Citizen Dashboard',
          description: 'Report hazards and stay informed about your area',
          primaryAction: 'Create New Report',
          primaryActionUrl: '/reports/create'
        };
    }
  };

  const roleContent = getRoleSpecificContent();

  if (loading || reportsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {getGreeting()}, {user?.name || user?.email}!
              </h1>
              <p className="text-blue-100 mb-4">
                {roleContent.description}
              </p>
              <Button
                variant="secondary"
                onClick={() => navigate(roleContent.primaryActionUrl)}
                leftIcon={<Plus size={18} />}
              >
                {roleContent.primaryAction}
              </Button>
            </div>
            <div className="hidden md:block text-6xl">
              {user?.role === 'OFFICIAL' ? '👮' : user?.role === 'ANALYST' ? '📊' : '👤'}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <BarChart3 size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-semibold">{formatNumber(stats.totalReports)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-semibold">{formatNumber(stats.pendingReports)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-semibold">{formatNumber(stats.verifiedReports)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Severity</p>
                <p className="text-2xl font-semibold">{formatNumber(stats.highSeverityReports)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Reports</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/reports')}
                >
                  View All
                </Button>
              </div>

              {recentReports.length > 0 ? (
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewReport(report)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900">
                              {report.type.replace('_', ' ')}
                            </h3>
                            <Badge
                              variant={
                                report.severity === 'HIGH' ? 'danger' :
                                report.severity === 'MEDIUM' ? 'warning' : 'secondary'
                              }
                              size="sm"
                            >
                              {report.severity}
                            </Badge>
                            <Badge
                              variant={
                                report.status === 'VERIFIED' ? 'success' :
                                report.status === 'PENDING' ? 'warning' : 'secondary'
                              }
                              size="sm"
                            >
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {report.description}
                          </p>
                          {report.location && (
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin size={12} className="mr-1" />
                              {report.location.name}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 ml-4">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No reports available</p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate('/reports/create')}
                  >
                    Create First Report
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Stats (for citizens) */}
            {user?.role === 'CITIZEN' && (
              <Card>
                <h3 className="font-semibold mb-4">My Contributions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">My Reports</span>
                    <span className="font-medium">{stats.myReports}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="font-medium">
                      {reports.filter(r => 
                        r.reporterId === user?.id && 
                        new Date(r.createdAt).getMonth() === new Date().getMonth()
                      ).length}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => navigate('/reports/my-reports')}
                >
                  View My Reports
                </Button>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/reports/create')}
                  leftIcon={<Plus size={16} />}
                >
                  Report New Hazard
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/reports')}
                  leftIcon={<BarChart3 size={16} />}
                >
                  Browse All Reports
                </Button>
                
                {(user?.role === 'OFFICIAL' || user?.role === 'ANALYST') && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => navigate('/reports?status=PENDING')}
                      leftIcon={<Clock size={16} />}
                    >
                      Review Pending
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => navigate('/analytics')}
                      leftIcon={<TrendingUp size={16} />}
                    >
                      View Analytics
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* System Status */}
            <Card>
              <h3 className="font-semibold mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Platform Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-medium">
                    {Math.floor(Math.random() * 50) + 10}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
