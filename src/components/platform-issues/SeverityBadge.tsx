
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

type SeverityType = 'P0' | 'P1' | 'P2';

interface SeverityBadgeProps {
  severity: SeverityType;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'P0':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: 'P0'
        };
      case 'P1':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-500',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: 'P1'
        };
      case 'P2':
        return {
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-600',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: 'P2'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-500',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: severity
        };
    }
  };

  const { bgColor, textColor, icon, label } = getSeverityConfig();

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
