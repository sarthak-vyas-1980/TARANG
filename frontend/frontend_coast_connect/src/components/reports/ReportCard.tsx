import React from 'react';
import { MapPin, Calendar, User, MoreVertical } from 'lucide-react';
import { Card, Button } from '../ui';
import ReportStatusBadge from './ReportStatusBadge';
import { formatDate, hazardFormatters, locationFormatters } from '../../utils/formatters';
import { getSeverityColor } from '../../utils/helpers';
import type { Report } from '../../types';

interface ReportCardProps {
  report: Report;
  onView?: (report: Report) => void;
  onEdit?: (report: Report) => void;
  onDelete?: (report: Report) => void;
  onUpdateStatus?: (report: Report) => void;
  showActions?: boolean;
  currentUserId?: number;
  userRole?: string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
  showActions = true,
  currentUserId,
  userRole
}) => {
  const canEdit = currentUserId === report.reporterId;
  const canUpdateStatus = userRole === 'OFFICIAL' || userRole === 'ANALYST';
  const canDelete = canEdit || canUpdateStatus;

  const handleAction = (action: string) => {
    switch (action) {
      case 'view':
        onView?.(report);
        break;
      case 'edit':
        onEdit?.(report);
        break;
      case 'delete':
        onDelete?.(report);
        break;
      case 'updateStatus':
        onUpdateStatus?.(report);
        break;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {hazardFormatters.type(report.type)}
            </h3>
            <ReportStatusBadge status={report.status} />
          </div>
          
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
            {hazardFormatters.severity(report.severity).icon} {hazardFormatters.severity(report.severity).text} Severity
          </div>
        </div>

        {showActions && (
          <div className="ml-4">
            <div className="relative group">
              <Button variant="outline" size="sm">
                <MoreVertical size={16} />
              </Button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <button
                    onClick={() => handleAction('view')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View Details
                  </button>
                  
                  {canEdit && (
                    <button
                      onClick={() => handleAction('edit')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit Report
                    </button>
                  )}
                  
                  {canUpdateStatus && (
                    <button
                      onClick={() => handleAction('updateStatus')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Update Status
                    </button>
                  )}
                  
                  {canDelete && (
                    <>
                      <hr className="my-1" />
                      <button
                        onClick={() => handleAction('delete')}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete Report
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {report.description}
      </p>

      {/* Location */}
      {report.location && (
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin size={16} className="mr-2 flex-shrink-0" />
          <span className="truncate">
            {report.location.name} - {locationFormatters.coordinates(report.location.lat, report.location.lng)}
          </span>
        </div>
      )}

      {/* Reporter */}
      {report.reporter && (
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <User size={16} className="mr-2 flex-shrink-0" />
          <span>Reported by {report.reporter.name || report.reporter.email}</span>
        </div>
      )}

      {/* Date */}
      <div className="flex items-center text-sm text-gray-500">
        <Calendar size={16} className="mr-2 flex-shrink-0" />
        <span>{formatDate(report.createdAt)}</span>
      </div>

      {/* Quick Actions */}
      {showActions && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('view')}
            className="flex-1"
          >
            View Details
          </Button>
          
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('edit')}
            >
              Edit
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default ReportCard;
