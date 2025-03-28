
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatusHistory } from '@/components/common/StatusHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PipelineDetail, TestItem } from '@/types';
import { fetchPipelineDetail } from '@/data/mockPipelineDetails';
import { ChevronLeft, Calendar, User, Server, Play, Info, BugIcon, MessageSquare, Tag, CheckIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PipelineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pipeline, setPipeline] = useState<PipelineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadPipelineDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchPipelineDetail(id);
        setPipeline(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching pipeline details:', err);
        setError('Failed to load pipeline details.');
        toast({
          title: "Error",
          description: "Failed to load pipeline details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadPipelineDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !pipeline) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <h2 className="text-2xl font-semibold mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Pipeline not found'}</p>
            <Link to="/">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center text-primary mb-6 hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        {/* Suite ID Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Suite UID: {pipeline.suiteId}</h1>
          <div className="border-b border-gray-200 my-4"></div>
        </div>

        {/* Overview Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left column - Details table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="grid grid-cols-2 text-sm">
                  <div className="border-b border-r border-gray-100 p-3 bg-gray-50 font-medium">User</div>
                  <div className="border-b border-gray-100 p-3">{pipeline.owner}</div>
                  
                  <div className="border-b border-r border-gray-100 p-3 bg-gray-50 font-medium">Product</div>
                  <div className="border-b border-gray-100 p-3">{pipeline.name.split(' ')[0]}</div>
                  
                  <div className="border-b border-r border-gray-100 p-3 bg-gray-50 font-medium">Branch</div>
                  <div className="border-b border-gray-100 p-3">{pipeline.branch || 'N/A'}</div>
                  
                  <div className="border-b border-r border-gray-100 p-3 bg-gray-50 font-medium">Description</div>
                  <div className="border-b border-gray-100 p-3">{pipeline.description || 'N/A'}</div>
                  
                  <div className="border-b border-r border-gray-100 p-3 bg-gray-50 font-medium">Name</div>
                  <div className="border-b border-gray-100 p-3">{pipeline.name.includes('-') ? pipeline.name.split('-').slice(1).join('-') : pipeline.name}</div>
                  
                  <div className="border-b border-r border-gray-100 p-3 bg-gray-50 font-medium">TestType</div>
                  <div className="border-b border-gray-100 p-3">{pipeline.testType || 'N/A'}</div>
                </div>
                
                <div className="grid grid-cols-2 text-sm">
                  <div className="border-b border-r border-gray-100 p-3 bg-gray-50 font-medium">Status</div>
                  <div className="border-b border-gray-100 p-3">
                    <StatusBadge status={pipeline.status} size="sm" />
                  </div>
                  
                  <div className="border-b border-r border-gray-100 p-3 bg-gray-50 font-medium">Start Time</div>
                  <div className="border-b border-gray-100 p-3">{pipeline.startTime || 'N/A'}</div>
                  
                  <div className="border-b border-r border-gray-100 p-3 bg-gray-50 font-medium">End Time</div>
                  <div className="border-b border-gray-100 p-3">{pipeline.endTime || 'N/A'}</div>
                  
                  <div className="border-r border-gray-100 p-3 bg-gray-50 font-medium">Last Success</div>
                  <div className="p-3">
                    {pipeline.lastSuccess ? (
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {pipeline.lastSuccess}
                      </span>
                    ) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Pass/Total stats */}
            <div className="flex flex-col justify-center items-center">
              <div className="flex gap-12 mb-4">
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-600">
                    {pipeline.tests.passed}
                  </div>
                  <div className="text-sm text-gray-500 uppercase mt-1">PASS</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-500">
                    {pipeline.tests.total}
                  </div>
                  <div className="text-sm text-gray-500 uppercase mt-1">TOTAL</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bugs & Comments Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Bugs & Comments</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">
                Add / Update
              </Button>
              <span className="text-gray-400">|</span>
              <Button variant="outline" size="sm" className="text-xs">
                Create Jira
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-2 text-sm">
              <div className="border-b border-r border-gray-100 p-3 bg-gray-50 font-medium flex items-center">
                <BugIcon className="w-4 h-4 mr-2" />
                Bugs
              </div>
              <div className="border-b border-gray-100 p-3">
                {pipeline.bugs && pipeline.bugs.length > 0 ? pipeline.bugs.join(', ') : 'N/A'}
              </div>
              
              <div className="border-r border-gray-100 p-3 bg-gray-50 font-medium flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Comments
              </div>
              <div className="p-3">
                {pipeline.comments && pipeline.comments.length > 0 ? pipeline.comments.join(', ') : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-4 mb-8">
          <Accordion type="single" collapsible className="bg-white rounded-lg shadow">
            <AccordionItem value="testbed-details">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 font-medium">
                <div className="flex items-center text-sm">
                  <Info className="w-4 h-4 mr-2" />
                  Testbed Details
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 border-t border-gray-100">
                <div className="pl-6 text-sm">
                  {pipeline.testbedDetails || 'No testbed details available'}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="bg-white rounded-lg shadow">
            <AccordionItem value="tags">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 font-medium">
                <div className="flex items-center text-sm">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 border-t border-gray-100">
                <div className="pl-6 text-sm">
                  {pipeline.tags && pipeline.tags.length > 0 ? 
                    pipeline.tags.map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-1 mr-2 mb-2 bg-gray-100 rounded-lg text-xs">{tag}</span>
                    )) : 
                    'No tags available'
                  }
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="bg-white rounded-lg shadow">
            <AccordionItem value="testcases-count">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 font-medium">
                <div className="flex items-center text-sm">
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Testcases Execution Count
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 border-t border-gray-100">
                <div className="pl-6 text-sm">
                  Total test cases executed: {pipeline.testCaseCount || pipeline.testItems.length}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* TestCases Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">TestCases</h2>
          
          <div className="flex gap-2 mb-4 flex-wrap">
            <div className="bg-white rounded-full px-3 py-1 text-xs border border-gray-200 flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M3 4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3z" />
                </svg>
              </div>
              <span>Jenkins</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 text-xs border border-gray-200 flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M3 4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3z" />
                </svg>
              </div>
              <span>JenkinsConsole</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 text-xs border border-gray-200 flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M3 4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3z" />
                </svg>
              </div>
              <span>AetosLogs</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 text-xs border border-gray-200 flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M3 4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3z" />
                </svg>
              </div>
              <span>KubeConfig</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 text-xs border border-gray-200 flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M3 4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3z" />
                </svg>
              </div>
              <span>Blue Ocean</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 text-xs border border-gray-200 flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M3 4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3z" />
                </svg>
              </div>
              <span>Stats</span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 text-xs border border-gray-200 flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M3 4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3z" />
                </svg>
              </div>
              <span>KubeDashboard</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-16 text-xs font-medium">Step</TableHead>
                  <TableHead className="text-xs font-medium">Testcase</TableHead>
                  <TableHead className="w-8 text-center text-xs font-medium">T</TableHead>
                  <TableHead className="text-xs font-medium">Description</TableHead>
                  <TableHead className="w-8 text-center text-xs font-medium">T</TableHead>
                  <TableHead className="text-xs font-medium">TestRunURL</TableHead>
                  <TableHead className="w-24 text-xs font-medium">Duration</TableHead>
                  <TableHead className="w-24 text-xs font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pipeline.testItems.map((test) => (
                  <TableRow key={test.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm">{test.step || '-'}</TableCell>
                    <TableCell className="text-sm font-medium">
                      {test.name}
                      {test.testRunUrl && (
                        <span className="text-xs text-blue-600 ml-2">({test.testRunUrl})</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="w-5 h-5 rounded-full bg-gray-200 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-sm">{test.description || '-'}</TableCell>
                    <TableCell className="text-center">
                      <div className="w-5 h-5 rounded-full bg-gray-200 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-sm text-blue-600 hover:underline">
                      {test.testRunUrl ? (
                        <span className="cursor-pointer">{test.testRunUrl}</span>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-sm">{test.duration}</TableCell>
                    <TableCell>
                      <StatusBadge status={test.status} size="sm" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Test Logs - Accordion style */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Logs</h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Accordion type="multiple" className="w-full">
              {pipeline.testItems.map((test) => (
                <TestAccordionItem key={test.id} test={test} />
              ))}
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
};

interface TestAccordionItemProps {
  test: TestItem;
}

const TestAccordionItem: React.FC<TestAccordionItemProps> = ({ test }) => {
  return (
    <AccordionItem value={test.id} className="border-b border-gray-100">
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 w-full">
          <StatusBadge status={test.status} size="sm" />
          <span className="font-medium">{test.name}</span>
          <span className="ml-auto text-sm text-gray-500">{test.duration}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-4 py-3 bg-gray-900 text-gray-200 font-mono text-sm rounded-md overflow-x-auto whitespace-pre">
          {test.logs}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PipelineDetailPage;
