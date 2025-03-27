
import React from 'react';
import { cn } from '@/lib/utils';
import { Product, Release, Build } from '@/types';
import { ChevronDown } from 'lucide-react';

interface FilterBarProps {
  products: Product[];
  selectedProductId: string | null;
  selectedReleaseId: string | null;
  selectedBuildId: string | null;
  availableReleases: Release[];
  availableBuilds: Build[];
  onProductChange: (productId: string) => void;
  onReleaseChange: (releaseId: string) => void;
  onBuildChange: (buildId: string) => void;
  className?: string;
  isLoading?: boolean;
}

export function FilterBar({
  products,
  selectedProductId,
  selectedReleaseId,
  selectedBuildId,
  availableReleases,
  availableBuilds,
  onProductChange,
  onReleaseChange,
  onBuildChange,
  className,
  isLoading = false
}: FilterBarProps) {
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onProductChange(e.target.value);
  };

  const handleReleaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onReleaseChange(e.target.value);
  };

  const handleBuildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onBuildChange(e.target.value);
  };

  const getProductName = (productId: string | null) => {
    if (!productId) return '';
    const product = products.find(p => p.id === productId);
    return product ? product.name : '';
  };

  const getReleaseName = (releaseId: string | null) => {
    if (!releaseId) return '';
    const release = availableReleases.find(r => r.id === releaseId);
    return release ? release.name : '';
  };

  const getBuildNumber = (buildId: string | null) => {
    if (!buildId) return '';
    const build = availableBuilds.find(b => b.id === buildId);
    return build ? build.buildNumber : '';
  };

  // Common select styling
  const selectClass = 'h-10 py-2 pl-3 pr-8 appearance-none bg-white border border-gray-200 rounded-lg text-sm leading-5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-crystal-primary focus:border-transparent transition-colors duration-200';
  const selectWrapperClass = 'relative';
  const iconWrapperClass = 'pointer-events-none absolute inset-y-0 right-0 flex items-center px-2';

  return (
    <div 
      className={cn(
        'flex flex-wrap md:flex-nowrap gap-4 mb-6 animate-fade-in',
        className
      )}
      style={{ animationDelay: '100ms' }}
    >
      <div className={selectWrapperClass}>
        <select
          value={selectedProductId || ''}
          onChange={handleProductChange}
          disabled={isLoading || products.length === 0}
          className={cn(
            selectClass,
            'w-full md:w-52'
          )}
        >
          {products.length === 0 ? (
            <option value="">No products</option>
          ) : (
            products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))
          )}
        </select>
        <div className={iconWrapperClass}>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className={selectWrapperClass}>
        <select
          value={selectedReleaseId || ''}
          onChange={handleReleaseChange}
          disabled={isLoading || availableReleases.length === 0}
          className={cn(
            selectClass,
            'w-full md:w-52'
          )}
        >
          {availableReleases.length === 0 ? (
            <option value="">No releases</option>
          ) : (
            availableReleases.map(release => (
              <option key={release.id} value={release.id}>
                {release.name}
              </option>
            ))
          )}
        </select>
        <div className={iconWrapperClass}>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className={selectWrapperClass}>
        <select
          value={selectedBuildId || ''}
          onChange={handleBuildChange}
          disabled={isLoading || availableBuilds.length === 0}
          className={cn(
            selectClass,
            'w-full md:w-52'
          )}
        >
          {availableBuilds.length === 0 ? (
            <option value="">No builds</option>
          ) : (
            availableBuilds.map(build => (
              <option key={build.id} value={build.id}>
                {build.buildNumber}
              </option>
            ))
          )}
        </select>
        <div className={iconWrapperClass}>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
