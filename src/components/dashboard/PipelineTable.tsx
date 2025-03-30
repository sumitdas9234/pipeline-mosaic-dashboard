import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pipeline } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatusHistory } from '@/components/common/StatusHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
// Remove unused Tooltip imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Search, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showOnlyFailed, setShowOnlyFailed] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    { key: 'status', label: 'Status', className: 'w-45' }, // Increased width from w-32 to w-40
    { key: 'pipeline', label: 'Pipeline', className: '' },
    { key: 'testsetId', label: 'Testset ID', className: 'w-28' },
    { key: 'date', label: 'Date', className: 'w-32' },
    { key: 'duration', label: 'Duration', className: 'w-28' },
    { key: 'tests', label: 'Tests', className: 'w-36' },
    { key: 'history', label: 'History', className: 'w-48' },
    { key: 'owner', label: 'Owner', className: 'w-32' }
    // Removed Actions column
  ];

  const filteredPipelines = pipelines.filter(pipeline => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.testsetId.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || pipeline.status === statusFilter;
    const matchesFailed = !showOnlyFailed || pipeline.status === 'failed';
    return matchesSearch && matchesStatus && matchesFailed;
  });

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, showOnlyFailed, rowsPerPage]);

  const handleActionClick = (action: string, pipelineId: string) => {
    toast({
      title: `Action: ${action}`,
      description: `Triggered for pipeline ID: ${pipelineId}`,
    });
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
      return Array(rowsPerPage).fill(0).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {/* Updated skeleton columns count to 8 */}
          {Array(8).fill(0).map((_, cellIndex) => ( 
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
          {/* Updated colSpan to 8 */}
          <TableCell colSpan={8} className="text-center py-8 text-gray-500"> 
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
          {/* Pass failureType directly to StatusBadge */}
          <StatusBadge 
            status={pipeline.status} 
            failureType={pipeline.failureType} 
          />
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
        {/* Removed Actions TableCell */}
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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>{columns.map(col => <TableHead key={col.key} className={cn("py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider", col.className)}>{col.label}</TableHead>)}</TableRow>
          </TableHeader>
          <TableBody>
            {renderTableBody()}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 && renderPagination()}
    </div>
  );
}
