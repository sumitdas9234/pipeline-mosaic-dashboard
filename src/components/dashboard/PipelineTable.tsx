import React, { useState, useEffect } from 'react';
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
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showOnlyFailed, setShowOnlyFailed] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPipelines = pipelines.filter(pipeline => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pipeline.status === statusFilter;
    const matchesFailed = !showOnlyFailed || pipeline.status === 'failed';
    return matchesSearch && matchesStatus && matchesFailed;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPipelines.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPipelines = filteredPipelines.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, showOnlyFailed, rowsPerPage]);

  const renderProgressBar = (passed: number, total: number) => {
    const percentage = total > 0 ? (passed / total) * 100 : 0;
    
    return (
      <div className="flex items-center gap-2">
        <div className="progress-bar w-24">
          <div 
            className="progress-fill bg-status-passed"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm">
          {passed}/{total}
        </span>
      </div>
    );
  };

  const renderTableBody = () => {
    if (isLoading) {
      return Array(4).fill(0).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {Array(7).fill(0).map((_, cellIndex) => ( // Updated to 7 cells for the new column
            <TableCell key={`cell-${index}-${cellIndex}`}>
              <div className="animate-pulse bg-gray-100 h-4 rounded w-3/4" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (filteredPipelines.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8 text-gray-500"> {/* Updated colspan to 7 */}
            {searchTerm || statusFilter !== 'all' || showOnlyFailed ? 
              'No pipelines match your filters' : 
              'No pipelines available'}
          </TableCell>
        </TableRow>
      );
    }

    return paginatedPipelines.map(pipeline => (
      <TableRow 
        key={pipeline.id}
        className="pipeline-row"
      >
        <TableCell>
          <StatusBadge status={pipeline.status} />
        </TableCell>
        <TableCell className="font-medium">
          {pipeline.name}
        </TableCell>
        <TableCell className="font-mono text-sm">
          {pipeline.testsetId}
        </TableCell>
        <TableCell className="text-gray-500">
          {pipeline.date}
        </TableCell>
        <TableCell>
          {pipeline.duration}
        </TableCell>
        <TableCell>
          {renderProgressBar(pipeline.tests.passed, pipeline.tests.total)}
        </TableCell>
        <TableCell>
          <StatusHistory 
            history={pipeline.history || []} 
            className="min-w-44" // Ensure minimum width for history visualization
          />
        </TableCell>
        <TableCell className="text-gray-500">
          {pipeline.owner}
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
          <SelectTrigger className="h-8 w-[70px] bg-gray-50 border-gray-100">
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
          {startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredPipelines.length)} of {filteredPipelines.length}
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
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn('bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden animate-fade-in', className)} style={{ animationDelay: '200ms' }}>
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search by name or ID"
            className="pl-10 h-9 bg-gray-50 border-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Switch 
              checked={!showOnlyFailed} 
              onCheckedChange={(checked) => setShowOnlyFailed(!checked)} 
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300"
            />
            <span className="text-sm text-gray-500">Show all</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 py-0 pl-3 pr-8 appearance-none bg-gray-50 border border-gray-100 rounded-md text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-crystal-primary focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="aborted">Aborted</option>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Status</TableHead>
              <TableHead>Pipeline</TableHead>
              <TableHead className="w-28">Testset ID</TableHead>
              <TableHead className="w-36">Date</TableHead>
              <TableHead className="w-28">Duration</TableHead>
              <TableHead className="w-36">Tests</TableHead>
              <TableHead className="w-48">History</TableHead>
              <TableHead className="w-32">Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderTableBody()}
          </TableBody>
        </Table>
      </div>
      {renderPagination()}
    </div>
  );
}
