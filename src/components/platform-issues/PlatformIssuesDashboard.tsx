
import React from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { PlatformIssuesTable } from './PlatformIssuesTable';
import { PlatformIssuesFilterBar } from './PlatformIssuesFilterBar';
import { usePlatformIssuesData } from '@/hooks/usePlatformIssuesData';
import { MetricCard } from '@/components/common/MetricCard';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export function PlatformIssuesDashboard() {
  const { 
    issues, 
    trendData, 
    isLoading, 
    filters, 
    updateFilters,
    metricData
  } = usePlatformIssuesData();

  return (
    <div className="w-[90%] mx-auto py-8">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* P0/P1/P2 Metrics Card */}
        <MetricCard
          title="Jira Priority Requests"
          value={metricData?.priorityCount || 0}
          icon="bug"
          isLoading={isLoading.metrics}
          customContent={
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div className="flex flex-col items-center">
                <span className="font-medium text-red-600">{metricData?.p0Count || 0}</span>
                <span className="text-xs text-gray-500">P0</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium text-orange-500">{metricData?.p1Count || 0}</span>
                <span className="text-xs text-gray-500">P1</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium text-yellow-500">{metricData?.p2Count || 0}</span>
                <span className="text-xs text-gray-500">P2</span>
              </div>
            </div>
          }
        />

        {/* Open Jira Requests Trend Card */}
        <MetricCard
          title="Open Jira Requests Trend"
          value={metricData?.openRequests || 0}
          icon="chart"
          isLoading={isLoading.metrics}
          customContent={
            <div className="mt-4 h-16">
              {trendData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData.slice(-14)} // Show last 14 days
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <Line 
                      type="monotone" 
                      dataKey="active" 
                      stroke="#8B5CF6" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                    <XAxis dataKey="date" hide />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem'
                      }} 
                      formatter={(value) => [`${value} requests`, 'Open']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          }
        />

        {/* Infra Errors Count Card */}
        <MetricCard
          title="Infrastructure Errors"
          value={metricData?.infraErrors || 0}
          icon="x"
          iconColor="text-red-500"
          isLoading={isLoading.metrics}
          subtext="Last 30 days"
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
