// src/pages/MapView.tsx
import React, { useMemo, useRef, useState } from 'react';
import { MapPin, Filter, Layers, RotateCcw, Maximize2 } from 'lucide-react';
import { useReportsContext } from '../contexts/ReportsContext';
import HazardMap from '../components/map/HazardMap';

const MapView: React.FC = () => {
  const { reports, getReportsByStatus } = useReportsContext();

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'investigating' | 'rejected'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [showLegend, setShowLegend] = useState(true);

  // Filtered reports memo
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
      return matchesStatus && matchesSeverity;
    });
  }, [reports, statusFilter, severityFilter]);

  // Status counts for dropdown labels
  const statusCounts = {
    all: reports.length,
    pending: getReportsByStatus('pending').length,
    verified: getReportsByStatus('verified').length,
    investigating: getReportsByStatus('investigating').length,
    rejected: getReportsByStatus('rejected').length,
  };

  const resetView = () => {
    setStatusFilter('all');
    setSeverityFilter('all');
  };

  // Optional: expose focusAll/flyTo bounds later via events or a map hook
  const focusAllRef = useRef<HTMLButtonElement>(null);
  const focusAll = () => {
    // Intentionally left as a no-op to keep the prototype simple
    // Could be implemented via a custom map hook to fit bounds to filteredReports
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-blue-500" />
              Interactive Hazard Map
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time visualization of ocean hazard reports with social media correlation
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <Layers className="w-4 h-4 mr-1" />
              Legend
            </button>
            <button
              onClick={resetView}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset View
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status ({statusCounts.all})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="verified">Verified ({statusCounts.verified})</option>
              <option value="investigating">Investigating ({statusCounts.investigating})</option>
              <option value="rejected">Rejected ({statusCounts.rejected})</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button
            ref={focusAllRef}
            onClick={focusAll}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Maximize2 className="w-4 h-4 mr-1" />
            Fit to Results
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden border bg-white">
        <HazardMap reports={filteredReports} height="70vh" />
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#dc2626' }} />
              <span>Verified • Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#ea580c' }} />
              <span>Verified • High</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#ca8a04' }} />
              <span>Verified • Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#16a34a' }} />
              <span>Verified • Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#7c3aed' }} />
              <span>Pending (All severities)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#2563eb' }} />
              <span>Investigating</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#6b7280' }} />
              <span>Rejected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
