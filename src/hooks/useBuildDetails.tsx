
import { useState } from 'react';
import { fetchBuildDetails } from '@/data/mockData';
import { Build } from '@/types';

export function useBuildDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [buildDetails, setBuildDetails] = useState<Build | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchDetails = async (buildId: string) => {
    setIsLoading(true);
    try {
      const details = await fetchBuildDetails(buildId);
      setBuildDetails(details);
      setIsSheetOpen(true);
    } catch (error) {
      console.error('Error fetching build details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return {
    isLoading,
    buildDetails,
    isSheetOpen,
    fetchDetails,
    closeSheet
  };
}
