import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pipeline } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatusHistory } from '@/components/common/StatusHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Search, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'; // Added MoreHorizontal
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added DropdownMenu components
import { useToast } from '@/components/ui/use-toast'; // Added useToast

interface PipelineTableProps {
  pipelines: Pipeline[];
  isLoading?: boolean;
  className?: string;
}

export function PipelineTable({
  pipelines,
  isLoading = false,
  className
}: PipelineTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize toast
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showOnlyFailed, setShowOnlyFailed] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPipelines = pipelines.filter(pipeline => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.testsetId.includes(searchTerm); // Include testsetId in search
    const matchesStatus = statusFilter === 'all' || pipeline.status === statusFilter;
    const matchesFailed = !showOnlyFailed || pipeline.status === 'failed';
    return matchesSearch && matchesStatus && matchesFailed;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPipelines.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPipelines = filteredPipelines.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (pipelineId: string) => {
    navigate(`/pipeline/${pipelineId}`);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, showOnlyFailed, rowsPerPage]);

  // Removed MouseEvent type, as onSelect provides a standard Event
  const handleActionClick = (action: string, pipelineId: string) => {
    // e.stopPropagation(); // No longer needed here, DropdownMenu handles it
    toast({
      title: `Action: ${action}`,
      description: `Triggered for pipeline ID: ${pipelineId}`,
    });
    // Add actual action logic here (e.g., API call)
  };


  const renderProgressBar = (passed: number, total: number) => {
    const percentage = total > 0 ? (passed / total) * 100 : 0;

    return (
      <div className="flex items-center gap-2">
        <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-status-passed rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">
          {passed}/{total}
        </span>
      </div>
    );
  };

  const renderTableBody = () => {
    if (isLoading) {
      // Keep existing skeleton loader
      return Array(rowsPerPage).fill(0).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {Array(9).fill(0).map((_, cellIndex) => ( // Increased colspan for Actions
            <TableCell key={`cell-${index}-${cellIndex}`} className="py-3 px-4">
              <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (paginatedPipelines.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={9} className="text-center py-8 text-gray-500"> {/* Increased colspan */}
            {filteredPipelines.length === 0 && (searchTerm || statusFilter !== 'all' || showOnlyFailed) ?
              'No pipelines match your filters' :
              'No pipelines available'}
          </TableCell>
        </TableRow>
      );
    }

    return paginatedPipelines.map(pipeline => (
      <TableRow
        key={pipeline.id}
        className="pipeline-row cursor-pointer hover:bg-gray-50/80 border-b border-gray-100"
        onClick={() => handleRowClick(pipeline.id)}
      >
        <TableCell className="py-3 px-4">
          <StatusBadge status={pipeline.status} />
        </TableCell>
        <TableCell className="py-3 px-4 font-medium text-gray-800">
          {pipeline.name}
        </TableCell>
        <TableCell className="py-3 px-4 font-mono text-sm text-gray-600">
          {pipeline.testsetId}
        </TableCell>
        <TableCell className="py-3 px-4 text-sm text-gray-500">
          {pipeline.date}
        </TableCell>
        <TableCell className="py-3 px-4 text-sm text-gray-600">
          {pipeline.duration}
        </TableCell>
        <TableCell className="py-3 px-4">
          {renderProgressBar(pipeline.tests.passed, pipeline.tests.total)}
        </TableCell>
        <TableCell className="py-3 px-4">
          <StatusHistory
            history={pipeline.history || []}
            className="min-w-44"
          />
        </TableCell>
        <TableCell className="py-3 px-4 text-sm text-gray-500">
          {pipeline.owner}
        </TableCell>
        {/* Actions Column */}
        <TableCell className="py-3 px-4 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()} // Prevent row click
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            {/* Removed onClick stopPropagation from Content */}
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={pipeline.status !== 'failed'}
                // Pass only action and ID to handler
                onSelect={() => handleActionClick('Retry', pipeline.id)}
                className={cn(pipeline.status !== 'failed' && "text-gray-400 cursor-not-allowed")}
              >
                Retry
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={pipeline.status !== 'failed'}
                 // Pass only action and ID to handler
                onSelect={() => handleActionClick('Triage', pipeline.id)}
                 className={cn(pipeline.status !== 'failed' && "text-gray-400 cursor-not-allowed")}
             >
                Triage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  const renderPagination = () => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Rows per page:</span>
        <Select
          value={rowsPerPage.toString()}
          onValueChange={(value) => setRowsPerPage(Number(value))}
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

      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-500">
          {filteredPipelines.length > 0 ? `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredPipelines.length)}` : '0'} of {filteredPipelines.length}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-gray-50 border-gray-100"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-gray-50 border-gray-100"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn('bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden animate-fade-in', className)} style={{ animationDelay: '200ms' }}>
      {/* Filter Bar */}
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3">
         <div className="relative md:w-64">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
           <Input
             placeholder="Search by name, owner, testset ID"
             className="pl-10 h-9 bg-gray-50 border-gray-100 text-sm"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>
         <div className="flex gap-4 items-center flex-wrap">
           <div className="flex items-center gap-2">
             <Switch
               checked={!showOnlyFailed}
               onCheckedChange={(checked) => setShowOnlyFailed(!checked)}
               id="show-all-switch"
             />
             <label htmlFor="show-all-switch" className="text-sm text-gray-600">Show all</label>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-sm text-gray-600">Status:</span>
             <Select
               value={statusFilter}
               onValueChange={(value) => setStatusFilter(value)}
             >
               <SelectTrigger className="h-9 w-[150px] bg-gray-50 border-gray-100 text-sm">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Statuses</SelectItem>
                 <SelectItem value="passed">Passed</SelectItem>
                 <SelectItem value="failed">Failed</SelectItem>
                 <SelectItem value="aborted">Aborted</SelectItem>
                 <SelectItem value="pending">Pending</SelectItem>
                 <SelectItem value="inprogress">In Progress</SelectItem>
               </SelectContent>
             </Select>
           </div>
         </div>
       </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Status</TableHead>
              <TableHead className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pipeline</TableHead>
              <TableHead className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Testset ID</TableHead>
              <TableHead className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Date</TableHead>
              <TableHead className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Duration</TableHead>
              <TableHead className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">Tests</TableHead>
              <TableHead className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">History</TableHead>
              <TableHead className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Owner</TableHead>
              <TableHead className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 text-right">Actions</TableHead> {/* Added Actions Header */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderTableBody()}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {totalPages > 0 && renderPagination()}
    </div>
  );
}
