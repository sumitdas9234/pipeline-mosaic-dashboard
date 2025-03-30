
import React from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { PlatformIssuesTrend } from './PlatformIssuesTrend';
import { PlatformIssuesTable } from './PlatformIssuesTable';
import { PlatformIssuesFilterBar } from './PlatformIssuesFilterBar';
import { usePlatformIssuesData } from '@/hooks/usePlatformIssuesData';

export function PlatformIssuesDashboard() {
  const { 
    issues, 
    trendData, 
    isLoading, 
    filters, 
    updateFilters 
  } = usePlatformIssuesData();

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader 
        title="Platform Issues" 
        description="Track and manage platform issues across all pipelines"
      />

      <div className="mb-6">
        <PlatformIssuesFilterBar 
          filters={filters}
          updateFilters={updateFilters}
          isLoading={isLoading.filters}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <PlatformIssuesTrend 
          data={trendData} 
          isLoading={isLoading.trend}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <PlatformIssuesTable 
          issues={issues} 
          isLoading={isLoading.issues} 
        />
      </div>
    </div>
  );
}
