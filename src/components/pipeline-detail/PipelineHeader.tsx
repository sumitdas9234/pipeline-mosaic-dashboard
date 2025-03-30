
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Removed CardFooter
import { StatusBadge } from '@/components/common/StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator'; // Added Separator
import { PipelineDetail } from '@/types';
import { 
  FileText, GitBranch, Hash, CheckIcon, Info, User, 
  BugIcon, MessageSquare, Clock, Tag, Calendar /* Added Calendar */ 
} from 'lucide-react';

interface PipelineHeaderProps {
  pipeline: PipelineDetail;
}

// Helper component for metadata items
const MetadataItem: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium">{value || '-'}</div>
    </div>
  </div>
);

export const PipelineHeader: React.FC<PipelineHeaderProps> = ({ pipeline }) => {
  const overallStatus = pipeline.testItems.some(test => test.status === 'failed') ? 'failed' : pipeline.status;
  const passedTests = pipeline.testItems.filter(test => test.status === 'passed').length;
  const totalTests = pipeline.testItems.length;
  const passPercentage = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <Card className="mb-8 shadow-sm overflow-hidden"> {/* Added overflow-hidden */}
      <CardHeader className="bg-gray-50/50 p-4 border-b"> {/* Added background and padding */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-semibold"> {/* Adjusted size */}
              Test Suite ID: {pipeline.suiteId}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{pipeline.name}</p> {/* Added pipeline name */}
          </div>
          <StatusBadge status={overallStatus} size="lg" />
        </div>
        {pipeline.description && (
           <p className="text-xs text-gray-500 mt-2">{pipeline.description}</p>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-4"> {/* Added padding and spacing */}
        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3">
          <MetadataItem icon={GitBranch} label="Branch" value={pipeline.branch || 'main'} />
          <MetadataItem icon={Hash} label="Test Type" value={pipeline.testType || 'Standard'} />
          <MetadataItem icon={User} label="Owner" value={pipeline.owner} />
          <MetadataItem icon={Calendar} label="Last Success" value={pipeline.lastSuccess || 'N/A'} />
          <MetadataItem icon={Clock} label="Start Time" value={pipeline.startTime || 'N/A'} />
          <MetadataItem icon={Clock} label="Duration" value={pipeline.duration || 'N/A'} />
          <MetadataItem icon={Info} label="Testbed" value={pipeline.testbedDetails || 'N/A'} />
        </div>

        <Separator /> 

        {/* Progress Section */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Test Pass Rate</span>
            <span className="text-sm font-semibold">{passPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={passPercentage} className="h-2.5" /> {/* Made progress bar thicker */}
          <div className="text-xs text-gray-500 mt-1 text-right">
            {passedTests} of {totalTests} tests passed
          </div>
        </div>

        <Separator />

        {/* Issues & Tags Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bugs */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <BugIcon className="h-4 w-4 text-gray-500" />
              <h4 className="text-sm font-medium">Bugs</h4>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              {pipeline.bugs && pipeline.bugs.length > 0 
                ? pipeline.bugs.map((bug, i) => <div key={i}>{bug}</div>) 
                : 'No bugs reported'}
            </div>
          </div>

          {/* Comments */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <h4 className="text-sm font-medium">Comments</h4>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              {pipeline.comments && pipeline.comments.length > 0 
                ? pipeline.comments.map((comment, i) => <div key={i}>{comment}</div>) 
                : 'No comments'}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Tag className="h-4 w-4 text-gray-500" />
              <h4 className="text-sm font-medium">Tags</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pipeline.tags && pipeline.tags.length > 0 ? 
                pipeline.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs font-normal">
                    {tag}
                  </Badge>
                )) : 
                <span className="text-xs text-gray-500">No tags</span>
              }
            </div>
          </div>
        </div>
      </CardContent>
      {/* Removed CardFooter */}
    </Card>
  );
};
