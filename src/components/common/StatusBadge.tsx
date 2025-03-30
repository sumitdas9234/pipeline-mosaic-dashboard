
import React from 'react';
import { cn } from '@/lib/utils';
import { Status, FailureType } from '@/types'; // Import FailureType
import { CheckCircle, XCircle, Clock, AlertTriangle, PlayCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: Status;
  failureType?: FailureType; // Add optional failureType prop
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({ 
  status, 
  className, 
  size = 'md',
  showIcon = true,
  failureType // Destructure failureType here to use it
}: StatusBadgeProps) {
  // Define getStatusConfig to accept failureType
  const getStatusConfig = (currentFailureType?: FailureType) => { 
    switch (status) {
      case 'passed':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-status-passed',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          label: 'Passed'
        };
      case 'failed':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-status-failed',
          icon: <XCircle className="w-3.5 h-3.5" />,
          // Use the passed currentFailureType
          label: currentFailureType ? currentFailureType : 'Failed' 
        };
      case 'aborted':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-status-aborted',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: 'Aborted'
        };
      case 'pending':
        return {
          bgColor: 'bg-amber-100',
          textColor: 'text-status-pending',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: 'Pending'
        };
      case 'inprogress':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-status-inprogress',
          icon: <PlayCircle className="w-3.5 h-3.5" />,
          label: 'In Progress'
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

  // Call getStatusConfig with the failureType prop
  const { bgColor, textColor, icon, label } = getStatusConfig(failureType); 
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium gap-1 transition-colors',
        bgColor,
        textColor,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && icon}
      {label}
    </span>
  );
}
