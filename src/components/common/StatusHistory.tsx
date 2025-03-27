
import React from 'react';
import { Status } from '@/types';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StatusHistoryProps {
  history: Status[];
  className?: string;
}

export function StatusHistory({ history, className }: StatusHistoryProps) {
  if (!history || history.length === 0) {
    return <div className="text-gray-400 text-sm italic">No history</div>;
  }

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'passed':
        return 'bg-status-passed';
      case 'failed':
        return 'bg-status-failed';
      case 'aborted':
        return 'bg-status-aborted';
      case 'pending':
        return 'bg-status-pending';
      case 'inprogress':
        return 'bg-status-inprogress';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case 'passed':
        return 'Passed';
      case 'failed':
        return 'Failed';
      case 'aborted':
        return 'Aborted';
      case 'pending':
        return 'Pending';
      case 'inprogress':
        return 'In Progress';
      default:
        return status;
    }
  };

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {history.map((status, index) => (
        <TooltipProvider key={index} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`h-5 w-1.5 rounded-sm ${getStatusColor(status)} cursor-pointer transition-opacity hover:opacity-80`}
                aria-label={`Build ${index + 1}: ${getStatusLabel(status)}`}
              />
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="text-xs">
              <p>Build {index + 1}: {getStatusLabel(status)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
