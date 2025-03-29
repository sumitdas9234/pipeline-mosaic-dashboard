import React from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatusHistory } from '@/components/common/StatusHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Added Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Added Select
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TestItem, Status } from '@/types'; // Added Status type
import { ExternalLink, ChevronDown, ChevronRight, Search } from 'lucide-react'; // Added Search Icon
import { cn } from '@/lib/utils';

interface PipelineTestCasesTableProps {
  testItems: TestItem[];
}

const ALL_STATUSES = 'all'; // Constant for "All Statuses" option

export const PipelineTestCasesTable: React.FC<PipelineTestCasesTableProps> = ({ testItems }) => {
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<Status | typeof ALL_STATUSES>(ALL_STATUSES);

  const toggleAccordion = (id: string) => {
    // Use DOM manipulation to click the hidden trigger
    document.getElementById(`accordion-trigger-${id}`)?.click();
    // Update state if you manage it here
    setOpenAccordion(openAccordion === id ? null : id);
  };

  // Filtered test items based on search and status
  const filteredTestItems = React.useMemo(() => {
    return testItems.filter(item => {
      const searchMatch = searchTerm === '' ||
                          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const statusMatch = statusFilter === ALL_STATUSES || item.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [testItems, searchTerm, statusFilter]);

  // Get unique statuses from the current items for the filter dropdown
  const availableStatuses = React.useMemo(() => {
    const statuses = new Set(testItems.map(item => item.status));
    return [ALL_STATUSES, ...Array.from(statuses)] as (Status | typeof ALL_STATUSES)[];
  }, [testItems]); // Add semicolon here

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
           <span className="text-sm text-gray-600">Status:</span>
           <Select
             value={statusFilter}
             onValueChange={(value: Status | typeof ALL_STATUSES) => setStatusFilter(value)}
           >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {availableStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status === ALL_STATUSES ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-600 tracking-wider w-10"></TableHead> {/* For Chevron */}
            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-600 tracking-wider">Testcase</TableHead>
            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-600 tracking-wider">Description</TableHead>
            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-600 tracking-wider">History</TableHead>
            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-600 tracking-wider w-20">Run URL</TableHead>
            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-600 tracking-wider w-24">Duration</TableHead>
            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-600 tracking-wider w-24">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTestItems.length > 0 ? (
            filteredTestItems.map((test) => { // Start map callback with {
              return ( // Explicit return
                <React.Fragment key={test.id}>
                  <TableRow
                    className="hover:bg-gray-50/80 cursor-pointer border-b border-gray-100 group"
                    onClick={() => toggleAccordion(test.id)}
                  >
                    <TableCell className="py-3 px-4 align-middle">
                       {/* Chevron Indicator */}
                       {openAccordion === test.id ? (
                          <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                       ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                       )}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm font-medium text-gray-800 align-middle">
                      {test.name}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-gray-600 align-middle">{test.description || '-'}</TableCell>
                    <TableCell className="py-3 px-4 align-middle">
                      <StatusHistory
                        history={test.history || [test.status, test.status === 'passed' ? 'failed' : 'passed', test.status]}
                        className="min-w-32"
                      />
                    </TableCell>
                    <TableCell className="py-3 px-4 align-middle">
                      {test.testRunUrl ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs text-blue-600 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(test.testRunUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1 inline-block" />
                          View
                        </Button>
                      ) : <span className="text-gray-400">-</span>}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-gray-600 align-middle">{test.duration}</TableCell>
                    <TableCell className="py-3 px-4 align-middle">
                      <StatusBadge status={test.status} size="sm" />
                    </TableCell>
                  </TableRow>
                  {/* Accordion Row for Logs */}
                  <TableRow className={cn(openAccordion !== test.id && 'hidden')}>
                    <TableCell colSpan={7} className="p-0 border-t border-gray-200">
                      <div className="px-6 py-4 bg-gray-950 text-gray-200 font-mono text-xs rounded-b-md overflow-x-auto whitespace-pre-wrap">
                        {test.logs || 'No logs available.'}
                      </div>
                      {/* Keep hidden trigger */}
                       <Accordion type="single" collapsible className="w-full hidden">
                          <AccordionItem value={test.id} className="border-0">
                            <AccordionTrigger id={`accordion-trigger-${test.id}`} />
                            <AccordionContent></AccordionContent>
                          </AccordionItem>
                       </Accordion>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ); // End return
            }) // End map callback with }
          ) : ( // Else part of ternary
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                No test cases found matching your criteria.
              </TableCell>
            </TableRow>
          )} {/* End ternary */}
        </TableBody>
      </Table>
    </div>
  );
};
