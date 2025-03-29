import React from 'react';
import { Button } from '@/components/ui/button';
import { BugIcon, MessageSquare } from 'lucide-react';

export const PipelineActionsBar: React.FC = () => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Test Results</h2>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <BugIcon className="h-4 w-4 mr-2" />
          Add Bug
        </Button>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Add Comment
        </Button>
      </div>
    </div>
  );
};
