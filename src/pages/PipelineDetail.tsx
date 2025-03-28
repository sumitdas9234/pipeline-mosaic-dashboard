
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatusHistory } from '@/components/common/StatusHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PipelineDetail, TestItem } from '@/types';
import { fetchPipelineDetail } from '@/data/mockPipelineDetails';
import { 
  ChevronLeft, Calendar, User, Server, Play, Info, 
  BugIcon, MessageSquare, Tag, CheckIcon, ExternalLink, 
  Clock, Hash, GitBranch, FileText, FileCode, Database, Terminal
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

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
        <main className="flex-1 w-[90%] mx-auto px-4 py-8">
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
        <main className="flex-1 w-[90%] mx-auto px-4 py-8">
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

  // Determine overall status for the suite badge
  const overallStatus = pipeline.testItems.some(test => test.status === 'failed') 
    ? 'failed' 
    : pipeline.status;
    
  // Calculate pass percentage for progress bar
  const passedTests = pipeline.testItems.filter(test => test.status === 'passed').length;
  const totalTests = pipeline.testItems.length;
  const passPercentage = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 w-[90%] mx-auto px-4 py-8">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center text-primary mb-6 hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        {/* Test Suite Header */}
        <Card className="mb-8 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              Test Suite ID: {pipeline.suiteId}
            </CardTitle>
            <StatusBadge status={overallStatus} size="lg" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {/* Column 1: Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500">Pipeline Information</h3>
                
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
              
              {/* Column 2: Test Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500">Test Details</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <CheckIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Test Count</div>
                      <div className="text-xs text-gray-500">
                        Total test cases: {pipeline.testCaseCount || pipeline.testItems.length}<br/>
                        Last Success: {pipeline.lastSuccess || 'N/A'}
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

                  <div className="flex gap-3 items-start">
                    <User className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Owner</div>
                      <div className="text-xs text-gray-500">{pipeline.owner}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Column 3: Bugs & Comments */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500">Issues & Notes</h3>
                
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
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 pb-2 flex-col items-start gap-4">
            <div className="w-full">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Test Pass Rate:</span>
                  <span className="font-medium">{passPercentage.toFixed(0)}%</span>
                </div>
                <div className="text-xs text-gray-500">
                  {passedTests} of {totalTests} tests passed
                </div>
              </div>
              <Progress value={passPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="flex gap-2 items-start">
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
              
              <div className="flex gap-2 items-start">
                <Tag className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="w-full">
                  <div className="text-sm font-medium mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {pipeline.tags && pipeline.tags.length > 0 ? 
                      pipeline.tags.map((tag, index) => (
                        <Badge key={index} variant="subtle" className="text-xs">
                          {tag}
                        </Badge>
                      )) : 
                      <span className="text-xs text-gray-500">No tags</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
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

        {/* Log Links as Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <FileCode className="h-3.5 w-3.5" />
            Jenkins
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Terminal className="h-3.5 w-3.5" />
            Jenkins Console
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Server className="h-3.5 w-3.5" />
            Aetos Logs
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Database className="h-3.5 w-3.5" />
            KubeConfig
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Play className="h-3.5 w-3.5" />
            Blue Ocean
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            Stats
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Server className="h-3.5 w-3.5" />
            KubeDashboard
          </Button>
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
                <TableHead className="w-32 text-xs font-medium">History</TableHead>
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
                    <TableCell>
                      <StatusHistory 
                        history={test.history || [test.status, test.status === 'passed' ? 'failed' : 'passed', test.status]} 
                        className="min-w-32"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} className="p-0 border-b">
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
