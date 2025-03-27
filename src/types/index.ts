
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
    inprogress: number;
  };
}

export interface FilterOptions {
  productId: string | null;
  releaseId: string | null;
  buildId: string | null;
}

// New interfaces for the pipeline details page
export interface TestItem {
  id: string;
  name: string;
  status: Status;
  duration: string;
  logs: string;
}

export interface PipelineDetail extends Pipeline {
  description?: string;
  testItems: TestItem[];
  environment?: string;
  trigger?: string;
  startTime?: string;
  endTime?: string;
}
