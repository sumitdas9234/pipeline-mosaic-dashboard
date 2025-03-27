
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function DashboardHeader({
  title,
  description,
  className
}: DashboardHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h1 className="text-2xl font-semibold mb-1 animate-slide-in">
        {title}
      </h1>
      {description && (
        <p className="text-gray-500 animate-slide-in" style={{ animationDelay: '50ms' }}>
          {description}
        </p>
      )}
    </div>
  );
}
