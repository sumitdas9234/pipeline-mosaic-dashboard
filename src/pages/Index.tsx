
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { usePipelineData } from '@/hooks/usePipelineData';
import { FilterBar } from '@/components/dashboard/FilterBar';

const Index = () => {
  const { 
    products, 
    filters, 
    loading, 
    updateFilters, 
    getAvailableReleases, 
    getAvailableBuilds 
  } = usePipelineData();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="container mx-auto py-6 px-4">
          <FilterBar 
            products={products}
            selectedProductId={filters.productId}
            selectedReleaseId={filters.releaseId}
            selectedBuildId={filters.buildId}
            availableReleases={getAvailableReleases()}
            availableBuilds={getAvailableBuilds()}
            onProductChange={(productId) => updateFilters({ productId })}
            onReleaseChange={(releaseId) => updateFilters({ releaseId })}
            onBuildChange={(buildId) => updateFilters({ buildId })}
            isLoading={loading.products}
          />
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default Index;
