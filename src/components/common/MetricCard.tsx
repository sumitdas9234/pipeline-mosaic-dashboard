
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Activity, 
  BarChart2, 
  Clock,
  Check,
  X,
  Play
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: 'activity' | 'chart' | 'clock' | 'check' | 'x' | 'play';
  iconColor?: string;
  className?: string;
  isLoading?: boolean;
  subtext?: string;
}

export function MetricCard({
  title,
  value,
  icon,
  iconColor,
  className,
  isLoading = false,
  subtext
}: MetricCardProps) {
  const renderIcon = () => {
    const iconClass = cn(
      'w-5 h-5',
      iconColor
    );
    
    switch (icon) {
      case 'activity':
        return <Activity className={cn(iconClass, 'text-purple-500')} />;
      case 'chart':
        return <BarChart2 className={cn(iconClass, 'text-green-500')} />;
      case 'clock':
        return <Clock className={cn(iconClass, 'text-blue-500')} />;
      case 'check':
        return <Check className={cn(iconClass, 'text-status-passed')} />;
      case 'x':
        return <X className={cn(iconClass, 'text-status-failed')} />;
      case 'play':
        return <Play className={cn(iconClass, 'text-status-inprogress')} />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      'glass-card p-5 rounded-xl transition-all duration-300 animate-fade-in',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-2 flex items-baseline">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-2xl font-semibold">{value}</span>
                {subtext && (
                  <span className="text-xs text-gray-500 ml-1">{subtext}</span>
                )}
              </div>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-2 bg-gray-50 rounded-lg">
            {renderIcon()}
          </div>
        )}
      </div>
    </div>
  );
}
