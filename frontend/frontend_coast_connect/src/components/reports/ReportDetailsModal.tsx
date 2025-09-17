import React from 'react';
import { X, MapPin, Calendar, User, Clock } from 'lucide-react';
import { Modal, Button } from '../ui';
import ReportStatusBadge from './ReportStatusBadge';
import { dateFormatters, hazardFormatters, locationFormatters } from '../../utils/formatters';
import { getSeverityColor } from '../../utils/helpers';
import type { Report } from '../../types';

interface ReportDetailsModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (report: Report) => void;
  onUpdateStatus?: (report: Report) => void;
  currentUserId?: number;
  userRole?: string;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  isOpen,
  onClose,
  onEdit,
  onUpdateStatus,
  currentUserId,
  userRole
}) => {
  if (!report) return null;

  const canEdit = currentUserId === report.reporterId;
  const canUpdateStatus = userRole === 'OFFICIAL' || userRole === 'ANALYST';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {hazardFormatters.type(report.type)}
            </h2>
            <ReportStatusBadge status={report.status} />
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Severity */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getSeverityColor(report.severity)}`}>
            {hazardFormatters.severity(report.severity).icon} {hazardFormatters.severity(report.severity).text} Severity
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {report.description}
          </p>
        </div>

        {/* Location */}
        {report.location && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{report.location.name}</p>
                  <p className="text-sm text-gray-600">
                    {locationFormatters.coordinates(report.location.lat, report.location.lng)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Lat: {report.location.lat.toFixed(6)}, Lng: {report.location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reporter Information */}
        {report.reporter && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Reporter</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <User size={20} className="text-gray-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    {report.reporter.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-600">{report.reporter.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-gray-600">Created:</span>
              <span className="font-medium">{dateFormatters.short(report.createdAt)}</span>
            </div>
            
            {report.updatedAt !== report.createdAt && (
              <div className="flex items-center space-x-3 text-sm">
                <Clock size={16} className="text-gray-500" />
                <span className="text-gray-600">Last updated:</span>
                <span className="font-medium">{dateFormatters.short(report.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          {canEdit && onEdit && (
            <Button variant="outline" onClick={() => onEdit(report)}>
              Edit Report
            </Button>
          )}
          
          {canUpdateStatus && onUpdateStatus && (
            <Button variant="primary" onClick={() => onUpdateStatus(report)}>
              Update Status
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReportDetailsModal;
