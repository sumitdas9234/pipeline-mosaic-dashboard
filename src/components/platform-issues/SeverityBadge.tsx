
import React from 'react';
import { cn } from '@/lib/utils';
import { CircleAlert } from 'lucide-react';

type SeverityType = 'P0' | 'P1' | 'P2';

interface SeverityBadgeProps {
  severity: SeverityType;
  className?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export function SeverityBadge({ 
  severity, 
  className,
  size = 'md',
  showIcon = true
}: SeverityBadgeProps) {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'P0':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          icon: showIcon ? <CircleAlert className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} /> : null,
          label: 'P0'
        };
      case 'P1':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-500',
          icon: showIcon ? <CircleAlert className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} /> : null,
          label: 'P1'
        };
      case 'P2':
        return {
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-600',
          icon: showIcon ? <CircleAlert className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} /> : null,
          label: 'P2'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-500',
          icon: showIcon ? <CircleAlert className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} /> : null,
          label: severity
        };
    }
  };

  const { bgColor, textColor, icon, label } = getSeverityConfig();
  
  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : 'text-xs px-2.5 py-1';

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium gap-1 transition-colors',
        bgColor,
        textColor,
        sizeClasses,
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}
