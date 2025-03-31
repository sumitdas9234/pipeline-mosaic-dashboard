
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PlatformIssue } from '@/data/mockPlatformIssues';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface IssueDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  issue: PlatformIssue | null;
}

export function IssueDetailSheet({ isOpen, onClose, issue }: IssueDetailSheetProps) {
  if (!issue) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center justify-between">
            <span>Issue Details</span>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => window.open(`https://jira.example.com/browse/${issue.jiraTicket}`, '_blank')}
            >
              <span>{issue.jiraTicket}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </SheetTitle>
          <SheetDescription>
            {issue.title}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Severity</h4>
              <SeverityBadge severity={issue.severity} />
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
              <StatusBadge status={issue.status} />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
            <p className="text-sm text-gray-700">{issue.description || 'No description available.'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Affected Pipelines</h4>
            <p className="text-sm text-gray-700">{issue.affectedPipelines}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">First Occurrence</h4>
              <p className="text-sm text-gray-700">{issue.firstOccurrence}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Last Occurrence</h4>
              <p className="text-sm text-gray-700">{issue.lastOccurrence}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Assignee</h4>
            <p className="text-sm text-gray-700">{issue.assignee || 'Unassigned'}</p>
          </div>
          
          {issue.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
              <p className="text-sm text-gray-700">{issue.notes}</p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="default" onClick={onClose}>Close</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
