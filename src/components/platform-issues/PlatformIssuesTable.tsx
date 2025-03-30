
import React from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PlatformIssue } from '@/data/mockPlatformIssues';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlatformIssuesTableProps {
  issues: PlatformIssue[];
  isLoading: boolean;
}

export function PlatformIssuesTable({ issues, isLoading }: PlatformIssuesTableProps) {
  const getSeverityStatus = (severity: PlatformIssue['severity']) => {
    switch (severity) {
      case 'Critical':
        return 'failed';
      case 'High':
        return 'failed';
      case 'Medium':
        return 'inprogress';
      case 'Low':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const getIssueStatus = (status: PlatformIssue['status']) => {
    switch (status) {
      case 'Open':
        return 'failed';
      case 'In Progress':
        return 'inprogress';
      case 'Resolved':
        return 'passed';
      case 'Closed':
        return 'passed';
      default:
        return 'pending';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <p className="text-sm text-muted-foreground">Loading issues...</p>
      </div>
    );
  }

  if (!issues || issues.length === 0) {
    return (
      <div className="p-8 flex justify-center">
        <p className="text-sm text-muted-foreground">No platform issues found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Jira Ticket</TableHead>
            <TableHead>Affected Pipelines</TableHead>
            <TableHead>First Occurrence</TableHead>
            <TableHead>Last Occurrence</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Assignee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell className="font-medium">{issue.id}</TableCell>
              <TableCell className="max-w-md truncate">{issue.title}</TableCell>
              <TableCell>
                <StatusBadge 
                  status={getSeverityStatus(issue.severity)} 
                  failureType={issue.severity}
                />
              </TableCell>
              <TableCell>
                <StatusBadge 
                  status={getIssueStatus(issue.status)}
                  failureType={issue.status}
                />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2 h-7">
                  {issue.jiraTicket}
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
              <TableCell>{issue.affectedPipelines}</TableCell>
              <TableCell>{issue.firstOccurrence}</TableCell>
              <TableCell>{issue.lastOccurrence}</TableCell>
              <TableCell>{issue.product}</TableCell>
              <TableCell>{issue.assignee || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
