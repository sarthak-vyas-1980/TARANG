// src/pages/VerifyReports.tsx
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui';
import { useAuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface Report {
  id: string;
  title: string;
  description: string;
  hazardType: string;
  severity: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  reportedBy: string;
  createdAt: string;
  status: 'pending' | 'verified' | 'rejected' | 'investigating';
  images?: string[];
}

const VerifyReports: React.FC = () => {
  const { user } = useAuthContext();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'investigating'>('pending');

  // Redirect if not official
  if (!user || user.role !== 'official') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      const response = await fetch(`/api/reports?status=${filter === 'all' ? '' : filter}&limit=50`);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.data.reports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Mock data for development
      setReports([
        {
          id: '1',
          title: 'High waves observed near Marina Beach',
          description: 'Witnessed unusually high waves (3-4 meters) hitting the coast. Local fishermen avoiding the area.',
          hazardType: 'high_waves',
          severity: 'medium',
          location: {
            address: 'Marina Beach, Chennai, Tamil Nadu',
            lat: 13.0500,
            lng: 80.2824,
          },
          reportedBy: 'John Fisherman',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
        // Add more mock reports...
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyReport = async (reportId: string, status: 'verified' | 'rejected' | 'investigating') => {
    try {
      const response = await fetch(`/api/reports/${reportId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          status,
          notes: verificationNotes,
        }),
      });

      if (response.ok) {
        // Update local state
        setReports(reports.map(report => 
          report.id === reportId 
            ? { ...report, status }
            : report
        ));
        setSelectedReport(null);
        setVerificationNotes('');
      }
    } catch (error) {
      console.error('Error verifying report:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-700/30 text-green-300 dark:bg-green-700/30 dark:text-green-300';
      case 'medium': return 'bg-yellow-600/30 text-yellow-200 dark:bg-yellow-600/30 dark:text-yellow-200';
      case 'high': return 'bg-orange-600/30 text-orange-200 dark:bg-orange-600/30 dark:text-orange-200';
      case 'critical': return 'bg-red-700/30 text-red-300 dark:bg-red-700/30 dark:text-red-300';
      default: return 'bg-darknavy/40 text-lightgray dark:bg-darknavy/40 dark:text-lightgray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-700/30 text-yellow-200 dark:bg-yellow-700/30 dark:text-yellow-200';
      case 'verified': return 'bg-green-700/30 text-green-300 dark:bg-green-700/30 dark:text-green-300';
      case 'rejected': return 'bg-red-700/30 text-red-300 dark:bg-red-700/30 dark:text-red-300';
      case 'investigating': return 'bg-blue-700/30 text-blue-200 dark:bg-blue-700/30 dark:text-blue-200';
      default: return 'bg-darknavy/40 text-lightgray dark:bg-darknavy/40 dark:text-lightgray';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neonblue dark:text-neonblue drop-shadow-neon-blue">Verify Reports</h1>
        <p className="text-turquoise dark:text-turquoise mt-2">Review and verify submitted hazard reports</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {['all', 'pending', 'investigating'].map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'primary' : 'secondary'}
              size="sm"
              className="rounded-lg text-sm font-medium"
              onClick={() => setFilter(filterOption as any)}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
  <Card padding="md" shadow="sm" className="overflow-x-auto p-0">
        <table className="min-w-full divide-y divide-darknavy dark:divide-neonblue">
          <thead className="bg-darknavy/80 dark:bg-darknavy/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-turquoise uppercase tracking-wider">Report Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-turquoise uppercase tracking-wider">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-turquoise uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-turquoise uppercase tracking-wider">Reporter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-turquoise uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-turquoise uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-darknavy/40 dark:hover:bg-darknavy/40 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-neonblue dark:text-neonblue">{report.title}</div>
                    <div className="text-sm text-turquoise dark:text-turquoise">{report.location.address}</div>
                    <div className="text-xs text-lightgray dark:text-lightgray capitalize">{report.hazardType.replace('_', ' ')}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(report.severity)}`}>
                    {report.severity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-lightgray dark:text-lightgray">
                  {report.reportedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-turquoise dark:text-turquoise">
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {report.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleVerifyReport(report.id, 'verified')}
                          variant="primary"
                          size="sm"
                          className="border border-green-400"
                        >
                          ✓ Approve
                        </Button>
                        <Button
                          onClick={() => handleVerifyReport(report.id, 'investigating')}
                          variant="secondary"
                          size="sm"
                          className="border border-blue-400"
                        >
                          🔍 Investigate
                        </Button>
                        <Button
                          onClick={() => handleVerifyReport(report.id, 'rejected')}
                          variant="danger"
                          size="sm"
                          className="border border-red-400"
                        >
                          ✗ Reject
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => setSelectedReport(report)}
                      variant="outline"
                      size="sm"
                      className="border border-neonblue"
                    >
                      👁 View Details
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  </Card>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-darknavy/80 dark:bg-darknavy/80 bg-opacity-80 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <Card padding="lg" shadow="sm" className="relative w-11/12 md:w-3/4 lg:w-1/2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-neonblue dark:text-neonblue">Report Details</h3>
              <Button
                onClick={() => setSelectedReport(null)}
                variant="ghost"
                size="sm"
                className="text-neonblue hover:text-turquoise"
              >
                ✕
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-neonblue dark:text-neonblue">{selectedReport.title}</h4>
                <p className="text-sm text-turquoise dark:text-turquoise mt-1">{selectedReport.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Hazard Type:</span>
                  <span className="ml-2 capitalize">{selectedReport.hazardType.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="font-medium">Severity:</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getSeverityColor(selectedReport.severity)}`}>
                    {selectedReport.severity}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Reporter:</span>
                  <span className="ml-2">{selectedReport.reportedBy}</span>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{new Date(selectedReport.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <span className="font-medium">Location:</span>
                <p className="text-sm text-turquoise dark:text-turquoise mt-1">{selectedReport.location.address}</p>
              </div>
              {selectedReport.status === 'pending' && (
                <div>
                  <label className="block text-sm font-medium text-turquoise mb-2">
                    Verification Notes
                  </label>
                  <textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-neonblue rounded-md focus:outline-none focus:ring-2 focus:ring-neonblue bg-darknavy/60 text-lightgray placeholder:text-turquoise"
                    rows={3}
                    placeholder="Add notes for verification..."
                  />
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                {selectedReport.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleVerifyReport(selectedReport.id, 'verified')}
                      variant="primary"
                      size="md"
                      className="border border-green-400"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleVerifyReport(selectedReport.id, 'investigating')}
                      variant="secondary"
                      size="md"
                      className="border border-blue-400"
                    >
                      Investigate
                    </Button>
                    <Button
                      onClick={() => handleVerifyReport(selectedReport.id, 'rejected')}
                      variant="danger"
                      size="md"
                      className="border border-red-400"
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => setSelectedReport(null)}
                  variant="outline"
                  size="md"
                  className="border border-neonblue"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VerifyReports;
