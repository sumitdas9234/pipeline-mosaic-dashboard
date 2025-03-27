
import React from 'react';
import { 
  Sheet,
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Check, X, Play, ExternalLink, GitBranch, GitCommit, Package, PieChart, Archive } from 'lucide-react';
import { Build } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart as RechartsPieChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  // Extract product and release info from build ID format (assuming format like product-release-build)
  const extractProductInfo = () => {
    const buildIdParts = build.id.split('-');
    return {
      product: buildIdParts[0] || 'Unknown',
      release: buildIdParts[1] || 'Unknown'
    };
  };

  const productInfo = extractProductInfo();

  const chartData = pipelineStats ? [
    { name: 'Passed', value: pipelineStats.passed, color: '#10B981' }, // Green for pass
    { name: 'Failed', value: pipelineStats.failed, color: '#EF4444' }, // Red for fail
    { name: 'In Progress', value: pipelineStats.inprogress, color: '#F97316' } // Amber for in progress
  ].filter(item => item.value > 0) : [];

  const chartConfig = {
    passed: { 
      color: '#10B981',
      label: 'Passed'
    },
    failed: { 
      color: '#EF4444',
      label: 'Failed'
    },
    inprogress: { 
      color: '#F97316',
      label: 'In Progress'
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent, 
    index 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-sans"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90%] sm:w-[540px] lg:w-[40%] overflow-y-auto font-sans">
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
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Product</span>
                <span className="font-medium">{productInfo.product}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Release</span>
                <span className="font-medium">{productInfo.release}</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
            {pipelineStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pipeline Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px] w-full">
                    <ChartContainer config={chartConfig}>
                      <RechartsPieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={100}
                          innerRadius={50}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                      </RechartsPieChart>
                    </ChartContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-status-passed"></div>
                      <span className="text-sm">Passed: {pipelineStats.passed}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-status-failed"></div>
                      <span className="text-sm">Failed: {pipelineStats.failed}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-status-inprogress"></div>
                      <span className="text-sm">In Progress: {pipelineStats.inprogress}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Jenkins URL */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">CI/CD</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span>Jenkins Pipeline:</span>
                  <a 
                    href={build.jenkinsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-crystal-primary hover:underline flex items-center gap-1"
                  >
                    View pipeline
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commits Tab Content */}
          <TabsContent value="commits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Commit Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {build.commitDetails.map((commit, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <GitCommit className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{commit.commitId.substring(0, 8)}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4" />
                          <span>{commit.branch}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Repository:</span>
                          <a 
                            href={commit.repositoryUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-crystal-primary hover:underline flex items-center gap-1"
                          >
                            {commit.repositoryUrl.split('/').pop()}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Author:</span>
                          <span>{commit.author}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Artifacts Tab Content */}
          <TabsContent value="artifacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Artifacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {build.artifacts.map((artifact, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{artifact.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="break-all">
                          <span className="font-medium">Image:</span>{' '}
                          <span className="bg-gray-100 p-1 rounded">{artifact.imageUrl}</span>
                        </div>
                        <div>
                          <span className="font-medium">Digest:</span>{' '}
                          <span className="bg-gray-100 p-1 rounded">{artifact.shaDigest.substring(0, 16)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
