import React from 'react';
import { getStatusColor } from '../../utils/helpers';
import { hazardFormatters } from '../../utils/formatters';
import type { Status } from '../../types';

interface ReportStatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const ReportStatusBadge: React.FC<ReportStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const statusInfo = hazardFormatters.status(status);
  const colorClasses = getStatusColor(status);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full border
      ${colorClasses}
      ${sizeClasses[size]}
    `}>
      {showIcon && (
        <span className="mr-1">{statusInfo.icon}</span>
      )}
      {statusInfo.text}
    </span>
  );
};

export default ReportStatusBadge;
