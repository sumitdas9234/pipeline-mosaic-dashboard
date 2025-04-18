
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Activity, 
  BarChart2, 
  Clock,
  Check,
  X,
  Play,
  Bug
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: 'activity' | 'chart' | 'clock' | 'check' | 'x' | 'play' | 'bug';
  iconColor?: string;
  className?: string;
  isLoading?: boolean;
  subtext?: string;
  customContent?: React.ReactNode;
  onClick?: () => void;
  linkTo?: string; // Add link property
}

export function MetricCard({
  title,
  value,
  icon,
  iconColor,
  className,
  isLoading = false,
  subtext,
  customContent,
  onClick,
  linkTo
}: MetricCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (linkTo) {
      navigate(linkTo);
    }
  };
  
  const isClickable = Boolean(onClick || linkTo);

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
      case 'bug':
        return <Bug className={cn(iconClass, 'text-red-500')} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        'glass-card p-5 rounded-xl transition-all duration-300 animate-fade-in',
        isClickable && 'hover:bg-gray-50 cursor-pointer',
        className
      )}
      onClick={isClickable ? handleClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col w-full">
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
          {customContent && (
            <div className="w-full">{customContent}</div>
          )}
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
