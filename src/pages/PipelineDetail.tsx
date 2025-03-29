
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
// Import Pipeline and Testcase types separately
import { Pipeline, Testcase } from '@/types';
// Import the correct fetch functions from mockData
import { fetchPipelines, fetchTestcases } from '@/data/mockData';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { PipelineHeader } from '@/components/pipeline-detail/PipelineHeader';
import { PipelineActionsBar } from '@/components/pipeline-detail/PipelineActionsBar';
import { PipelineLogLinks } from '@/components/pipeline-detail/PipelineLogLinks';
import { PipelineTestCasesTable } from '@/components/pipeline-detail/PipelineTestCasesTable';

const PipelineDetailPage: React.FC = () => {
  const { id: pipelineId } = useParams<{ id: string }>(); // Rename id to pipelineId for clarity
  const [pipeline, setPipeline] = useState<Pipeline | null>(null); // State for pipeline data
  const [testcases, setTestcases] = useState<Testcase[]>([]); // State for testcase data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!pipelineId) {
        setError('Pipeline ID is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setPipeline(null); // Reset state
      setTestcases([]);

      try {
        // 1. Fetch the specific pipeline using its ID
        // We need a way to fetch a single pipeline by ID. Let's assume fetchPipelines can handle this for now,
        // or we might need to add a dedicated fetchPipelineById function later.
        // For simplicity, let's filter the result of fetchPipelines.
        const allPipelines = await fetchPipelines(); // Fetch all (inefficient for real API)
        const foundPipeline = allPipelines.find(p => p.id === pipelineId);

        if (!foundPipeline) {
          throw new Error('Pipeline not found');
        }
        setPipeline(foundPipeline);

        // 2. Fetch testcases using the testsetId from the found pipeline
        const fetchedTestcases = await fetchTestcases(foundPipeline.testsetId);
        setTestcases(fetchedTestcases);

      } catch (err: any) {
        console.error('Error loading pipeline details:', err);
        setError(err.message || 'Failed to load pipeline details.');
        toast({
          title: "Error",
          description: "Failed to load pipeline details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData(); // Call the renamed function
  }, [pipelineId, toast]); // Use the renamed route parameter in the dependency array

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 w-[90%] mx-auto px-4 py-8">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center text-primary mb-6 hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        {/* Use the new components */}
        {/* Pass pipeline data to header */}
        <PipelineHeader pipeline={pipeline} />
        <PipelineActionsBar />
        {/* Log links might need pipeline data too, adjust if necessary */}
        <PipelineLogLinks />
        {/* Pass fetched testcases to the table using the correct prop name */}
        <PipelineTestCasesTable testcases={testcases} />
      </main>
    </div>
  );
};

export default PipelineDetailPage;
