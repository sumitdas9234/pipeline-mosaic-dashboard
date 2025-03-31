
import React, { useState } from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PlatformIssue } from '@/data/mockPlatformIssues';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlatformIssuesTableProps {
  issues: PlatformIssue[];
  isLoading: boolean;
}

export function PlatformIssuesTable({ issues, isLoading }: PlatformIssuesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter issues based on search term
  const filteredIssues = issues.filter(issue => 
    issue.jiraTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.assignee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);
  
  const indexOfLastIssue = currentPage * rowsPerPage;
  const indexOfFirstIssue = indexOfLastIssue - rowsPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getSeverityStatus = (severity: PlatformIssue['severity']) => {
    switch (severity) {
      case 'P0':
        return 'failed';
      case 'P1':
        return 'failed';
      case 'P2':
        return 'inprogress';
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
      {/* Add search bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by ticket, title, assignee"
            className="pl-10 h-9 bg-gray-50 border-gray-100 text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jira Ticket</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Affected Pipelines</TableHead>
            <TableHead>First Occurrence</TableHead>
            <TableHead>Last Occurrence</TableHead>
            <TableHead>Assignee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentIssues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2 h-7">
                  {issue.jiraTicket}
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
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
              <TableCell>{issue.affectedPipelines}</TableCell>
              <TableCell>{issue.firstOccurrence}</TableCell>
              <TableCell>{issue.lastOccurrence}</TableCell>
              <TableCell>{issue.assignee || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination with Rows per page selector */}
      <div className="flex items-center justify-between py-4 px-6 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Rows per page:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1); // Reset to first page when changing rows per page
            }}
          >
            <SelectTrigger className="h-8 w-[70px] bg-gray-50 border-gray-100 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing {indexOfFirstIssue + 1} to {Math.min(indexOfLastIssue, filteredIssues.length)} of {filteredIssues.length} issues
        </div>
        
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Logic to show appropriate page numbers
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                  if (i === 4) return (
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                  if (i === 0) return (
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                } else {
                  if (i === 0) return (
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                  if (i === 4) return (
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                  pageNum = currentPage - 1 + i;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      onClick={() => handlePageChange(pageNum)}
                      isActive={pageNum === currentPage}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
