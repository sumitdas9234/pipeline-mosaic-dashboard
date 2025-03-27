
import React from 'react';
import { DashboardHeader } from '../layout/DashboardHeader';
import { FilterBar } from './FilterBar';
import { MetricCard } from '../common/MetricCard';
import { PipelineTable } from './PipelineTable';
import { usePipelineData } from '@/hooks/usePipelineData';
import { Progress } from '@/components/ui/progress';
import { Bug, Clock } from 'lucide-react';

export function Dashboard() {
  const {
    products,
    pipelines,
    stats,
    filters,
    loading,
    updateFilters,
    getAvailableReleases,
    getAvailableBuilds,
  } = usePipelineData();

  const handleProductChange = (productId: string) => {
    updateFilters({ productId });
  };

  const handleReleaseChange = (releaseId: string) => {
    updateFilters({ releaseId });
  };

  const handleBuildChange = (buildId: string) => {
    updateFilters({ buildId });
  };

  const availableReleases = getAvailableReleases();
  const availableBuilds = getAvailableBuilds();

  // Get selected build number and date for display
  const getSelectedBuildInfo = () => {
    if (!filters.buildId) return { buildNumber: null, date: null };
    const build = availableBuilds.find(b => b.id === filters.buildId);
    return build ? { buildNumber: build.buildNumber, date: build.date } : { buildNumber: null, date: null };
  };

  const { buildNumber, date } = getSelectedBuildInfo();

  return (
    <div className="p-6 w-[90%] mx-auto">
      <DashboardHeader 
        title="Pipeline Dashboard" 
        description="Monitor and manage your build pipelines"
      />
      
      <FilterBar
        products={products}
        selectedProductId={filters.productId}
        selectedReleaseId={filters.releaseId}
        selectedBuildId={filters.buildId}
        availableReleases={availableReleases}
        availableBuilds={availableBuilds}
        onProductChange={handleProductChange}
        onReleaseChange={handleReleaseChange}
        onBuildChange={handleBuildChange}
        isLoading={loading.products}
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Platform Issues"
          value={stats?.platformIssues || 0}
          icon="bug"
          isLoading={loading.stats}
          customContent={
            <div className="mt-2 text-xs text-gray-500">
              <div className="font-mono">
                {stats?.platformIssues === 0 ? 'No issues detected' : `${stats?.platformIssues} issues found`}
              </div>
            </div>
          }
        />
        
        <MetricCard
          title="Success Rate"
          value={`${stats?.successRate || 0}%`}
          icon="chart"
          isLoading={loading.stats}
          customContent={
            <div className="mt-2">
              <Progress 
                value={(stats?.status.passed || 0) / (stats?.totalBuilds || 1) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1 font-mono">
                <span>{stats?.status.passed || 0} passed</span>
                <span>of {stats?.totalBuilds || 0} total</span>
              </div>
            </div>
          }
        />
        
        <MetricCard
          title="Latest Build"
          value={buildNumber || '-'}
          icon="clock"
          isLoading={loading.stats}
          customContent={
            <div className="mt-2 w-full">
              <div className="flex items-center gap-1 mb-2">
                <span className="bg-crystal-lighter/20 text-crystal-primary px-2 py-0.5 rounded font-mono text-xs">
                  {Math.floor(Math.random() * 5) + 1} artifacts
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono">Total Builds: {availableBuilds.length || 0}</span>
                {date && (
                  <span className="text-xs text-gray-500 font-mono">Built on {date}</span>
                )}
              </div>
            </div>
          }
        />
        
        <div className="glass-card p-5 rounded-xl">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Current Build Status: <span className="font-mono">{buildNumber || '-'}</span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center bg-green-50 py-2 px-3 rounded-lg">
              <span className="font-semibold text-lg text-status-passed font-mono">
                {stats?.status.passed || 0}
              </span>
              <span className="text-xs text-gray-500">Passed</span>
            </div>
            
            <div className="flex flex-col items-center bg-red-50 py-2 px-3 rounded-lg">
              <span className="font-semibold text-lg text-status-failed font-mono">
                {stats?.status.failed || 0}
              </span>
              <span className="text-xs text-gray-500">Failed</span>
            </div>
            
            <div className="flex flex-col items-center bg-blue-50 py-2 px-3 rounded-lg">
              <span className="font-semibold text-lg text-status-inprogress font-mono">
                {stats?.status.inprogress || 0}
              </span>
              <span className="text-xs text-gray-500">In Progress</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pipelines Table */}
      <PipelineTable 
        pipelines={pipelines} 
        isLoading={loading.pipelines}
      />
    </div>
  );
}
