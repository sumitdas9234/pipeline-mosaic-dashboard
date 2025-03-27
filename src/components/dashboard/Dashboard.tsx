
import React from 'react';
import { DashboardHeader } from '../layout/DashboardHeader';
import { FilterBar } from './FilterBar';
import { MetricCard } from '../common/MetricCard';
import { PipelineTable } from './PipelineTable';
import { usePipelineData } from '@/hooks/usePipelineData';

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

  // Get selected build number for display
  const getSelectedBuildNumber = () => {
    if (!filters.buildId) return null;
    const build = availableBuilds.find(b => b.id === filters.buildId);
    return build ? build.buildNumber : null;
  };

  const selectedBuildNumber = getSelectedBuildNumber();

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
          title="Total Builds"
          value={stats?.totalBuilds || 0}
          icon="activity"
          isLoading={loading.stats}
        />
        
        <MetricCard
          title="Success Rate"
          value={`${stats?.successRate || 0}%`}
          icon="chart"
          isLoading={loading.stats}
        />
        
        <MetricCard
          title="Latest Build"
          value={selectedBuildNumber || '-'}
          icon="clock"
          isLoading={loading.stats}
        />
        
        <div className="glass-card p-5 rounded-xl">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Current Build Status: {selectedBuildNumber || '-'}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center bg-green-50 py-2 px-3 rounded-lg">
              <span className="font-semibold text-lg text-status-passed">
                {stats?.status.passed || 0}
              </span>
              <span className="text-xs text-gray-500">Passed</span>
            </div>
            
            <div className="flex flex-col items-center bg-red-50 py-2 px-3 rounded-lg">
              <span className="font-semibold text-lg text-status-failed">
                {stats?.status.failed || 0}
              </span>
              <span className="text-xs text-gray-500">Failed</span>
            </div>
            
            <div className="flex flex-col items-center bg-blue-50 py-2 px-3 rounded-lg">
              <span className="font-semibold text-lg text-status-inprogress">
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
