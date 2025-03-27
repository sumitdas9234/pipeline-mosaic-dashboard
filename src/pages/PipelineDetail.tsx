
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
import { PipelineDetail, TestItem } from '@/types';
import { fetchPipelineDetail } from '@/data/mockPipelineDetails';
import { ChevronLeft, Clock, Calendar, User, Server, Play } from 'lucide-react';

const PipelineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pipeline, setPipeline] = useState<PipelineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } finally {
        setLoading(false);
      }
    };

    loadPipelineDetails();
  }, [id]);

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

  // Helper function to generate test progress percentage
  const getTestProgress = () => {
    if (pipeline.tests.total === 0) return 0;
    return (pipeline.tests.passed / pipeline.tests.total) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center text-primary mb-6 hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        {/* Pipeline Summary Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold">{pipeline.name}</h1>
            <StatusBadge status={pipeline.status} />
          </div>

          {pipeline.description && (
            <p className="text-gray-600 mb-6">{pipeline.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Pipeline Stats Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pipeline Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="font-medium">{pipeline.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium">{pipeline.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Owner:</span>
                  <span className="font-medium">{pipeline.owner}</span>
                </div>
                {pipeline.environment && (
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Environment:</span>
                    <span className="font-medium">{pipeline.environment}</span>
                  </div>
                )}
                {pipeline.trigger && (
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Trigger:</span>
                    <span className="font-medium">{pipeline.trigger}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Statistics Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Test Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progress:</span>
                    <span className="font-medium">
                      {pipeline.tests.passed}/{pipeline.tests.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-status-passed h-2.5 rounded-full"
                      style={{ width: `${getTestProgress()}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-xl font-semibold text-green-600">
                      {pipeline.tests.passed}
                    </div>
                    <div className="text-xs text-gray-600">Passed</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-xl font-semibold text-red-600">
                      {pipeline.tests.total - pipeline.tests.passed}
                    </div>
                    <div className="text-xs text-gray-600">Failed/Other</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pipeline History</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusHistory
                  history={pipeline.history || []}
                  className="w-full h-10 mb-4"
                />
                <div className="text-sm text-gray-600">
                  Recent pipeline executions shown as colored blocks. Hover for details.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Test List Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-white rounded-xl shadow overflow-hidden">
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
