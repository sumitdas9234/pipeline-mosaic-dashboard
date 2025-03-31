import React from 'react';
import { DashboardHeader } from '../layout/DashboardHeader';
import { FilterBar } from './FilterBar';
import { MetricCard } from '../common/MetricCard';
import { PipelineTable } from './PipelineTable';
import { usePipelineData } from '@/hooks/usePipelineData';
import { useBuildDetails } from '@/hooks/useBuildDetails';
import { BuildDetailSheet } from './build-detail/BuildDetailSheet';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Bug, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  
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

  const {
    isLoading: isBuildLoading,
    buildDetails,
    isSheetOpen,
    fetchDetails,
    closeSheet
  } = useBuildDetails();

  const handleProductChange = (productId: string) => {
    updateFilters({ productId });
  };

  const handleReleaseChange = (releaseId: string) => {
    updateFilters({ releaseId });
  };

  const handleBuildChange = (buildId: string) => {
    updateFilters({ buildId });
  };

  const handleBuildCardClick = () => {
    if (filters.buildId) {
      fetchDetails(filters.buildId);
    }
  };

  const availableReleases = getAvailableReleases();
  const availableBuilds = getAvailableBuilds();

  const getSelectedBuildInfo = () => {
    if (!filters.buildId) return { buildNumber: null, date: null };
    const build = availableBuilds.find(b => b.id === filters.buildId);
    return build ? { buildNumber: build.buildNumber, date: build.date } : { buildNumber: null, date: null };
  };

  const { buildNumber, date } = getSelectedBuildInfo();

  const calculateCurrentBuildStats = () => {
    const counts = { passed: 0, failed: 0, inprogress: 0, aborted: 0, pending: 0, total: 0 };
    if (filters.buildId && pipelines) {
      pipelines.forEach(p => {
        counts.total++;
        if (p.status === 'passed') counts.passed++;
        else if (p.status === 'failed') counts.failed++;
        else if (p.status === 'inprogress') counts.inprogress++;
        else if (p.status === 'aborted') counts.aborted++;
        else if (p.status === 'pending') counts.pending++;
      });
    }
    return counts;
  };

  const currentBuildStats = calculateCurrentBuildStats();

  const calculatePlatformIssues = () => {
    let platformIssueCount = 0;
    if (filters.buildId && pipelines) {
      pipelines.forEach(p => {
        if (p.status === 'failed' && 
            (p.failureType === 'Infra error' || 
             p.failureType === 'k8s install error' || 
             p.failureType === 'Product install error')) {
          platformIssueCount++;
        }
      });
    }
    return platformIssueCount;
  };

  const currentPlatformIssues = calculatePlatformIssues();

  const currentBuildSuccessRate = currentBuildStats.total > 0
    ? Math.round((currentBuildStats.passed / currentBuildStats.total) * 100)
    : 0;

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Platform Issues"
          value={currentPlatformIssues} 
          icon="bug"
          isLoading={loading.pipelines}
          linkTo="/platform-issues"
          customContent={
            <div className="mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1 mb-2">
                <span className="bg-red-100 text-red-500 px-2 py-0.5 rounded text-xs">
                  {currentPlatformIssues === 0 ? 'No platform issues' : `${currentPlatformIssues} platform issues found`}
                </span>
              </div>
            </div>
          }
        />
        
        <MetricCard
          title="Total Coverage"
          value={`${currentBuildSuccessRate}%`}
          icon="chart"
          isLoading={loading.pipelines}
          customContent={
            <div className="mt-2 space-y-1">
              <Progress
                value={currentBuildSuccessRate}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{currentBuildStats.passed} passed</span>
                <span>of {currentBuildStats.total} total</span>
              </div>
            </div>
          }
        />
        
        <MetricCard
          title="Latest Build"
          value={buildNumber || '-'}
          icon="clock"
          isLoading={loading.stats}
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={handleBuildCardClick}
          customContent={
            <div className="mt-2 w-full">
              <div className="flex items-center gap-1 mb-2">
                <span className="bg-crystal-lighter/20 text-crystal-primary px-2 py-0.5 rounded text-xs">
                  {Math.floor(Math.random() * 5) + 1} artifacts
                </span>
                <span className="bg-green-100 text-green-500 px-2 py-0.5 rounded text-xs">
                  {availableBuilds.length || 0} builds
                </span>
              </div>
              <div className="flex justify-between items-center">
                {date && (
                  <span className="text-xs text-gray-500">Built on {date}</span>
                )}
              </div>
            </div>
          }
        />
        
        <div className="glass-card p-5 rounded-xl">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Current Build Status: <span>{buildNumber || '-'}</span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center bg-green-50 py-2 px-3 rounded-lg">
              <span className="font-semibold text-lg text-status-passed">
                {currentBuildStats.passed}
              </span>
              <span className="text-xs text-gray-500">Passed</span>
            </div>

            <div className="flex flex-col items-center bg-red-50 py-2 px-3 rounded-lg">
              <span className="font-semibold text-lg text-status-failed">
                {currentBuildStats.failed}
              </span>
              <span className="text-xs text-gray-500">Failed</span>
            </div>

            <div className="flex flex-col items-center bg-blue-50 py-2 px-3 rounded-lg">
              <span className="font-semibold text-lg text-status-inprogress">
                {currentBuildStats.inprogress + currentBuildStats.pending}
              </span>
              <span className="text-xs text-gray-500">Running</span>
            </div>
          </div>
        </div>
      </div>
      
      <PipelineTable 
        pipelines={pipelines} 
        isLoading={loading.pipelines}
      />

      <BuildDetailSheet
        isOpen={isSheetOpen}
        onClose={closeSheet}
        build={buildDetails}
        pipelineStats={currentBuildStats}
      />
    </div>
  );
}
