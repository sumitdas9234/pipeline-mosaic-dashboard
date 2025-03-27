
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
}

export interface PipelineStats {
  totalBuilds: number;
  successRate: number;
  latestBuild: string;
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
