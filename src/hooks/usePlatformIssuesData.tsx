
import { useCallback, useEffect, useState } from 'react';
import { fetchPlatformIssues, fetchPlatformIssuesTrend, fetchPlatformMetrics } from '@/data/mockPlatformIssues';

interface PlatformIssueFilters {
  timeRange: string;
  product: string | null;
  severity: string | null;
}

interface PlatformMetrics {
  priorityCount: number;
  p0Count: number;
  p1Count: number;
  p2Count: number;
  openRequests: number;
  infraErrors: number;
}

export function usePlatformIssuesData() {
  const [issues, setIssues] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [metricData, setMetricData] = useState<PlatformMetrics | null>(null);
  const [filters, setFilters] = useState<PlatformIssueFilters>({
    timeRange: '30d',
    product: null,
    severity: null,
  });
  const [isLoading, setIsLoading] = useState({
    issues: true,
    trend: true,
    filters: false,
    metrics: true,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, issues: true, trend: true, metrics: true }));
    
    try {
      const issuesData = await fetchPlatformIssues(filters);
      setIssues(issuesData);
      
      const trendData = await fetchPlatformIssuesTrend(filters.timeRange);
      setTrendData(trendData);
      
      const metrics = await fetchPlatformMetrics(filters.timeRange);
      setMetricData(metrics);
    } catch (error) {
      console.error('Error fetching platform issues data:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, issues: false, trend: false, metrics: false }));
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
    metricData,
    filters,
    isLoading,
    updateFilters,
  };
}
