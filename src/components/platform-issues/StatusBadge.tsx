
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

type IssueStatusType = 'Open' | 'In Progress' | 'Resolved';

interface StatusBadgeProps {
  status: IssueStatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'Resolved':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-600',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          label: 'Resolved'
        };
      case 'In Progress':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: 'In Progress'
        };
      case 'Open':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: 'Open'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-500',
          icon: null,
          label: status
        };
    }
  };

  const { bgColor, textColor, icon, label } = getStatusConfig();

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium gap-1 transition-colors text-xs px-2.5 py-1',
        bgColor,
        textColor,
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}
