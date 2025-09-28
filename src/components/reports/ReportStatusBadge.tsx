import React from 'react';
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import type { ReportStatus } from '../../types/report.types';

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

const STATUS_CONFIG: Record<ReportStatus, { color: string; text: string; icon: React.ElementType }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending', icon: Clock },
  verified: { color: 'bg-green-100 text-green-800', text: 'Verified', icon: CheckCircle },
  rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected', icon: XCircle },
  investigating: { color: 'bg-blue-100 text-blue-800', text: 'Investigating', icon: Eye },
};

const ReportStatusBadge: React.FC<ReportStatusBadgeProps> = ({ status }) => {
  const { color, text, icon: Icon } = STATUS_CONFIG[status] || STATUS_CONFIG['pending'];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {text}
    </span>
  );
};

export default ReportStatusBadge;
