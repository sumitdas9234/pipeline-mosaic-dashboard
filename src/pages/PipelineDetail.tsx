
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
import { ChevronLeft, Calendar, User, Server, Play, Info, BugIcon, MessageSquare, Tag, CheckIcon, ExternalLink, Clock, Hash, GitBranch, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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

        {/* Suite ID Header with Status Badge */}
        <div className="mb-8 flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-4 mb-2 md:mb-0">
            <h1 className="text-2xl font-bold">Suite {pipeline.suiteId}</h1>
            <StatusBadge status={pipeline.status} size="lg" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-sm">
              <Clock className="h-4 w-4 mr-2" />
              {pipeline.startTime || 'N/A'}
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <User className="h-4 w-4 mr-2" />
              {pipeline.owner}
            </Button>
          </div>
        </div>

        {/* Overview Card */}
        <Card className="mb-8 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 border-b px-6 py-4">
            <CardTitle className="text-lg font-medium">Pipeline Overview</CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Pipeline Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Column 1: Basic Info */}
              <div className="p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">Basic Information</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">{pipeline.name}</div>
                      <div className="text-xs text-gray-500">{pipeline.description || 'No description'}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <GitBranch className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Branch</div>
                      <div className="text-xs text-gray-500">{pipeline.branch || 'main'}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <Hash className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Test Type</div>
                      <div className="text-xs text-gray-500">{pipeline.testType || 'Standard'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Column 2: Execution Info */}
              <div className="p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">Execution Info</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Timing</div>
                      <div className="text-xs text-gray-500">
                        Start: {pipeline.startTime || 'N/A'}<br/>
                        End: {pipeline.endTime || 'N/A'}<br/>
                        Duration: {pipeline.duration || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <CheckIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Test Count</div>
                      <div className="text-xs text-gray-500">
                        Total test cases: {pipeline.testCaseCount || pipeline.testItems.length}<br/>
                        Passed: {pipeline.tests.passed}<br/>
                        Last Success: {pipeline.lastSuccess || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Column 3: Additional Details */}
              <div className="p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">Additional Details</h3>
                
                {/* Bugs & Comments */}
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <BugIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Bugs</div>
                      <div className="text-xs text-gray-500">
                        {pipeline.bugs && pipeline.bugs.length > 0 
                          ? pipeline.bugs.map((bug, i) => <div key={i}>{bug}</div>) 
                          : 'No bugs reported'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Comments</div>
                      <div className="text-xs text-gray-500">
                        {pipeline.comments && pipeline.comments.length > 0 
                          ? pipeline.comments.map((comment, i) => <div key={i}>{comment}</div>) 
                          : 'No comments'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <Info className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Testbed Details</div>
                      <div className="text-xs text-gray-500">
                        {pipeline.testbedDetails || 'No testbed details'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="px-5 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium mr-3">Tags:</span>
                {pipeline.tags && pipeline.tags.length > 0 ? 
                  pipeline.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-100">
                      {tag}
                    </Badge>
                  )) : 
                  <span className="text-sm text-gray-500">No tags</span>
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Bar */}
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

        {/* Log Links */}
        <div className="flex gap-2 mb-6 flex-wrap">
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
        
        {/* Test Cases Table with Accordion for Logs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs font-medium">Testcase</TableHead>
                <TableHead className="text-xs font-medium">Description</TableHead>
                <TableHead className="w-20 text-xs font-medium">Run URL</TableHead>
                <TableHead className="w-24 text-xs font-medium">Duration</TableHead>
                <TableHead className="w-24 text-xs font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pipeline.testItems.map((test) => (
                <React.Fragment key={test.id}>
                  <TableRow className="hover:bg-gray-50 cursor-pointer" onClick={() => document.getElementById(`accordion-${test.id}`)?.click()}>
                    <TableCell className="text-sm font-medium">
                      {test.name}
                    </TableCell>
                    <TableCell className="text-sm">{test.description || '-'}</TableCell>
                    <TableCell>
                      {test.testRunUrl ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-xs text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(test.testRunUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-sm">{test.duration}</TableCell>
                    <TableCell>
                      <StatusBadge status={test.status} size="sm" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} className="p-0 border-b">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={test.id} className="border-0">
                          <AccordionTrigger 
                            id={`accordion-${test.id}`}
                            className="hidden"
                          />
                          <AccordionContent>
                            <div className="px-4 py-3 bg-gray-900 text-gray-200 font-mono text-sm rounded-md overflow-x-auto whitespace-pre">
                              {test.logs}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default PipelineDetailPage;
