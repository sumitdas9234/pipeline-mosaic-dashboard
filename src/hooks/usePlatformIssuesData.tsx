
import { useCallback, useEffect, useState } from 'react';
import { fetchPlatformIssues, fetchPlatformIssuesTrend } from '@/data/mockPlatformIssues';

interface PlatformIssueFilters {
  timeRange: string;
  product: string | null;
  severity: string | null;
}

export function usePlatformIssuesData() {
  const [issues, setIssues] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [filters, setFilters] = useState<PlatformIssueFilters>({
    timeRange: '30d',
    product: null,
    severity: null,
  });
  const [isLoading, setIsLoading] = useState({
    issues: true,
    trend: true,
    filters: false,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, issues: true, trend: true }));
    
    try {
      const issuesData = await fetchPlatformIssues(filters);
      setIssues(issuesData);
      
      const trendData = await fetchPlatformIssuesTrend(filters.timeRange);
      setTrendData(trendData);
    } catch (error) {
      console.error('Error fetching platform issues data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, issues: false, trend: false }));
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = useCallback((newFilters: Partial<PlatformIssueFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    issues,
    trendData,
    filters,
    isLoading,
    updateFilters,
  };
}
