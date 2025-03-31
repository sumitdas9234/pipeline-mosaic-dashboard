export type FailureType = 'Infra error' | 'k8s install error' | 'Product install error' | 'Test error' | 
  'P0' | 'P1' | 'P2' | 'Open' | 'In Progress' | 'Resolved';
export type Status = 'passed' | 'failed' | 'aborted' | 'pending' | 'inprogress';

export interface Pipeline {
  id: string;
  name: string;
  status: Status;
  date: string;
  duration: string;
  tests: { passed: number; total: number };
  owner: string;
  productId: string;
  releaseId: string;
  buildId: string;
  platformIssues?: number;
  history?: Status[]; // Added history field
  testsetId: string; // Add this new field
  suiteId?: string; // Add suite ID
  branch?: string; // Add branch information
  description?: string; // Add description
  lastSuccess?: string; // Add last success information
  startTime?: string; // Add specific start time
  endTime?: string; // Add specific end time
  failureType?: FailureType; // Add specific failure type for failed status
}

export interface Product {
  id: string;
  name: string;
  releases: Release[];
}

export interface Release {
  id: string;
  name: string;
  builds: Build[];
}

export interface Build {
  id: string;
  buildNumber: string;
  date: string;
  status: 'passed' | 'failed' | 'inprogress';
  commitDetails: {
    commitId: string;
    repositoryUrl: string;
    branch: string;
    author: string;
  }[];
  artifacts: {
    name: string;
    imageUrl: string;
    shaDigest: string;
  }[];
  jenkinsUrl: string;
}

export interface PipelineStats {
  totalBuilds: number;
  successRate: number;
  latestBuild: string;
  platformIssues: number;
  status: {
    passed: number;
    failed: number;
    aborted: number; // Add aborted count
    pending: number; // Add pending count
    inprogress: number;
  };
  relevantTotalPipelines?: number; // Add total relevant for success rate
}

export interface FilterOptions {
  productId: string | null;
  releaseId: string | null;
  buildId: string | null;
}

// TestItem interface needed for mockPipelineDetails.ts
export interface TestItem {
  id: string;
  name: string;
  status: Status;
  duration: string;
  logs: string;
  step?: number;
  testRunUrl?: string;
  description?: string;
  history?: Status[];
}

// Renamed from TestItem and added specific IDs
export interface Testcase {
  testcaseId: string; // Unique ID for the testcase
  testsetId: string; // ID linking to the parent Pipeline/Testset
  name: string;
  status: Status;
  duration: string;
  logs: string;
  step?: number; // Add step number for ordering
  testRunUrl?: string; // Add URL for test details
  description?: string; // Add description
  history?: Status[]; // Add history for test execution
}

// Update PipelineDetail to use Testcase type and add testItems
export interface PipelineDetail extends Pipeline {
  description?: string;
  testItems: TestItem[]; // Add this field
  environment?: string;
  trigger?: string;
  startTime?: string;
  endTime?: string;
  user?: string; // Add user who ran the pipeline
  testType?: string; // Add test type
  bugs?: string[]; // Add bugs information
  comments?: string[]; // Add comments
  testbedDetails?: string; // Add testbed details
  tags?: string[]; // Add tags
  testCaseCount?: number; // Add test case count
}
