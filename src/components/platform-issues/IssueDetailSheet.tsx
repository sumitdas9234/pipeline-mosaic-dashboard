
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PlatformIssue } from '@/data/mockPlatformIssues';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface IssueDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  issue: PlatformIssue | null;
}

export function IssueDetailSheet({ isOpen, onClose, issue }: IssueDetailSheetProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!issue) {
    return null;
  }

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call to Jira
    setTimeout(() => {
      toast.success(`Comment added to ${issue.jiraTicket} successfully`);
      setComment('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Issue Details</SheetTitle>
          <SheetDescription>
            {issue.title}
          </SheetDescription>
          <a 
            href={`https://jira.example.com/browse/${issue.jiraTicket}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors gap-1"
          >
            {issue.jiraTicket}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
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

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Add Comment</h4>
            <div className="space-y-3">
              <Textarea 
                placeholder="Add your comment to this Jira ticket..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <Button 
                variant="default" 
                onClick={handleCommentSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                <MessageSquare className="mr-1" />
                {isSubmitting ? 'Submitting...' : 'Submit Comment'}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
