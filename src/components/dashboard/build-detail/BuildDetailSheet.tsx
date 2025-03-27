
import React from 'react';
import { 
  Sheet,
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Check, X, Play } from 'lucide-react';
import { Build } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductInfoCard } from './ProductInfoCard';
import { BuildStatsTab } from './BuildStatsTab';
import { CommitsTab } from './CommitsTab';
import { ArtifactsTab } from './ArtifactsTab';
import { PieChart, GitCommit, Archive } from 'lucide-react';

interface BuildDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  build: Build | null;
  pipelineStats: {
    passed: number;
    failed: number;
    inprogress: number;
  } | null;
}

export function BuildDetailSheet({ isOpen, onClose, build, pipelineStats }: BuildDetailSheetProps) {
  if (!build) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <Check className="h-5 w-5 text-status-passed" />;
      case 'failed':
        return <X className="h-5 w-5 text-status-failed" />;
      case 'inprogress':
        return <Play className="h-5 w-5 text-status-inprogress" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'inprogress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Extract product and release info from build ID
  const extractProductInfo = () => {
    const buildIdParts = build.id.split('-');
    return {
      product: buildIdParts[0] || 'Unknown',
      release: buildIdParts[1] || 'Unknown'
    };
  };

  const productInfo = extractProductInfo();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[95%] sm:w-[600px] lg:w-[50%] xl:w-[45%] overflow-y-auto font-sans">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center space-x-2">
            <span>Build {build.buildNumber}</span>
            <Badge className={getStatusColor(build.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(build.status)}
                {build.status.charAt(0).toUpperCase() + build.status.slice(1)}
              </span>
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Build created on {build.date}
          </SheetDescription>
        </SheetHeader>

        {/* Product Info Card */}
        <ProductInfoCard productInfo={productInfo} />

        {/* Tabs Navigation */}
        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Stats</span>
            </TabsTrigger>
            <TabsTrigger value="commits" className="flex items-center gap-2">
              <GitCommit className="h-4 w-4" />
              <span>Commits</span>
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              <span>Artifacts</span>
            </TabsTrigger>
          </TabsList>

          {/* Stats Tab Content */}
          <TabsContent value="stats" className="space-y-6">
            <BuildStatsTab build={build} pipelineStats={pipelineStats} />
          </TabsContent>

          {/* Commits Tab Content */}
          <TabsContent value="commits" className="space-y-6">
            <CommitsTab commitDetails={build.commitDetails} />
          </TabsContent>

          {/* Artifacts Tab Content */}
          <TabsContent value="artifacts" className="space-y-6">
            <ArtifactsTab artifacts={build.artifacts} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
