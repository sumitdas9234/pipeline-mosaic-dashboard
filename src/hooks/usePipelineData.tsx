import { useCallback, useEffect, useState } from 'react';
import { 
  fetchProducts, 
  fetchPipelines, 
  fetchPipelineStats 
} from '@/data/mockData';
import { 
  Product, 
  Pipeline, 
  PipelineStats,
  FilterOptions
} from '@/types';

const defaultFilters: FilterOptions = {
  productId: null,
  releaseId: null,
  buildId: null
};

export function usePipelineData(initialFilters: FilterOptions = defaultFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [loading, setLoading] = useState({
    products: true,
    pipelines: true,
    stats: true
  });

  // Fetch products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        
        // Set default product if available and not already set
        if (data.length > 0 && !filters.productId) {
          setFilters(prev => ({
            ...prev,
            productId: data[0].id,
            releaseId: data[0].releases.length > 0 ? data[0].releases[0].id : null,
            buildId: data[0].releases.length > 0 && data[0].releases[0].builds.length > 0 
              ? data[0].releases[0].builds[0].id 
              : null
          }));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    };

    loadProducts();
  }, []);

  // Fetch pipelines when filters change
  useEffect(() => {
    const loadPipelines = async () => {
      setLoading(prev => ({ ...prev, pipelines: true }));
      try {
        const data = await fetchPipelines(
          filters.productId,
          filters.releaseId,
          filters.buildId
        );
        setPipelines(data);
      } catch (error) {
        console.error('Error fetching pipelines:', error);
      } finally {
        setLoading(prev => ({ ...prev, pipelines: false }));
      }
    };

    loadPipelines();
  }, [filters]);

  // Fetch stats when filters change
  useEffect(() => {
    const loadStats = async () => {
      setLoading(prev => ({ ...prev, stats: true }));
      try {
        const data = await fetchPipelineStats(
          filters.productId,
          filters.releaseId,
          filters.buildId
        );
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    loadStats();
  }, [filters]);

  // Helper to update filters
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      
      // If product changes, reset release and build
      if (newFilters.productId && newFilters.productId !== prev.productId) {
        const selectedProduct = products.find(p => p.id === newFilters.productId);
        updated.releaseId = selectedProduct?.releases.length ? selectedProduct.releases[0].id : null;
        updated.buildId = selectedProduct?.releases.length && selectedProduct.releases[0].builds.length 
          ? selectedProduct.releases[0].builds[0].id 
          : null;
      }
      
      // If release changes, reset build
      if (newFilters.releaseId && newFilters.releaseId !== prev.releaseId) {
        const selectedProduct = products.find(p => p.id === updated.productId);
        const selectedRelease = selectedProduct?.releases.find(r => r.id === newFilters.releaseId);
        updated.buildId = selectedRelease?.builds.length ? selectedRelease.builds[0].id : null;
      }
      
      return updated;
    });
  }, [products]);

  // Helper to get available releases based on current product
  const getAvailableReleases = useCallback(() => {
    if (!filters.productId) return [];
    const product = products.find(p => p.id === filters.productId);
    return product ? product.releases : [];
  }, [filters.productId, products]);

  // Helper to get available builds based on current release
  const getAvailableBuilds = useCallback(() => {
    if (!filters.productId || !filters.releaseId) return [];
    const product = products.find(p => p.id === filters.productId);
    const release = product?.releases.find(r => r.id === filters.releaseId);
    return release ? release.builds : [];
  }, [filters.productId, filters.releaseId, products]);

  return {
    products,
    pipelines,
    stats,
    filters,
    loading,
    updateFilters,
    getAvailableReleases,
    getAvailableBuilds,
  };
}
