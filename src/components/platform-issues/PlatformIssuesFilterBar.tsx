
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterBarProps {
  filters: {
    timeRange: string;
    product: string | null;
    severity: string | null;
  };
  updateFilters: (filters: any) => void;
  isLoading: boolean;
}

export function PlatformIssuesFilterBar({ filters, updateFilters, isLoading }: FilterBarProps) {
  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
  ];
  
  const products = [
    { value: 'Product A', label: 'Product A' },
    { value: 'Product B', label: 'Product B' },
    { value: 'Product C', label: 'Product C' },
  ];
  
  const severities = [
    { value: 'Critical', label: 'Critical' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[180px]">
        <div className="text-sm font-medium mb-2">Time Range</div>
        <Select
          disabled={isLoading}
          value={filters.timeRange}
          onValueChange={(value) => updateFilters({ timeRange: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 min-w-[180px]">
        <div className="text-sm font-medium mb-2">Product</div>
        <Select
          disabled={isLoading}
          value={filters.product || ''}
          onValueChange={(value) => updateFilters({ product: value || null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All products</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.value} value={product.value}>
                {product.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 min-w-[180px]">
        <div className="text-sm font-medium mb-2">Severity</div>
        <Select
          disabled={isLoading}
          value={filters.severity || ''}
          onValueChange={(value) => updateFilters({ severity: value || null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All severities</SelectItem>
            {severities.map((severity) => (
              <SelectItem key={severity.value} value={severity.value}>
                {severity.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-end">
        <Button
          variant="outline"
          onClick={() => updateFilters({
            timeRange: '30d',
            product: null,
            severity: null
          })}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
