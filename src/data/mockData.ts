
import { Product, Pipeline, PipelineStats, Build } from '@/types';

export const products: Product[] = [
  {
    id: 'product-a',
    name: 'Product A',
    releases: [
      {
        id: 'release-1.1.0',
        name: '1.1.0',
        builds: [
          { 
            id: 'build-1000', 
            buildNumber: '1000', 
            date: '2023-06-10',
            status: 'passed',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-a/job/build-1000'
          },
          { 
            id: 'build-1001', 
            buildNumber: '1001', 
            date: '2023-06-11',
            status: 'passed',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-a/job/build-1001'
          },
          { 
            id: 'build-1006', 
            buildNumber: '1006', 
            date: '2023-06-12',
            status: 'inprogress',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-a/job/build-1006'
          },
        ]
      },
      {
        id: 'release-1.2.0',
        name: '1.2.0',
        builds: [
          { 
            id: 'build-1234', 
            buildNumber: '1234', 
            date: '2023-06-15',
            status: 'failed',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-a/job/build-1234'
          },
          { 
            id: 'build-1235', 
            buildNumber: '1235', 
            date: '2023-06-16',
            status: 'passed',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-a/job/build-1235'
          },
        ]
      }
    ]
  },
  {
    id: 'product-b',
    name: 'Product B',
    releases: [
      {
        id: 'release-2.2.1',
        name: '2.2.1',
        builds: [
          { 
            id: 'build-1002', 
            buildNumber: '1002', 
            date: '2023-06-10',
            status: 'failed',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-b/job/build-1002'
          },
          { 
            id: 'build-1003', 
            buildNumber: '1003', 
            date: '2023-06-11',
            status: 'failed',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-b/job/build-1003'
          },
        ]
      },
      {
        id: 'release-2.3.0',
        name: '2.3.0',
        builds: [
          { 
            id: 'build-1007', 
            buildNumber: '1007', 
            date: '2023-06-13',
            status: 'passed',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-b/job/build-1007'
          },
        ]
      },
      {
        id: 'release-2.3.0.1',
        name: '2.3.0.1',
        builds: [
          { 
            id: 'build-1008', 
            buildNumber: '1008', 
            date: '2023-06-14',
            status: 'passed',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-b/job/build-1008'
          },
        ]
      }
    ]
  },
  {
    id: 'product-c',
    name: 'Product C',
    releases: [
      {
        id: 'release-3.2.0',
        name: '3.2.0',
        builds: [
          { 
            id: 'build-1004', 
            buildNumber: '1004', 
            date: '2023-06-10',
            status: 'inprogress',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-c/job/build-1004'
          },
          { 
            id: 'build-1005', 
            buildNumber: '1005', 
            date: '2023-06-11',
            status: 'failed',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-c/job/build-1005'
          },
          { 
            id: 'build-1008', 
            buildNumber: '1008', 
            date: '2023-06-12',
            status: 'inprogress',
            commitDetails: [],
            artifacts: [],
            jenkinsUrl: 'https://jenkins.example.com/job/product-c/job/build-1008'
          },
        ]
      }
    ]
  }
];

export const pipelines: Pipeline[] = [
  {
    id: 'pipeline-1',
    name: 'Vertex AI Full Suite Test',
    status: 'aborted',
    date: 'Mar 22, 05:01 PM',
    duration: '7m 33s',
    tests: { passed: 1, total: 4 },
    owner: 'system',
    productId: 'product-a',
    releaseId: 'release-1.1.0',
    buildId: 'build-1000',
    platformIssues: 3
  },
  {
    id: 'pipeline-2',
    name: 'BigQuery Full Suite Test',
    status: 'passed',
    date: 'Mar 22, 05:01 PM',
    duration: '6m 22s',
    tests: { passed: 4, total: 4 },
    owner: 'system',
    productId: 'product-a',
    releaseId: 'release-1.1.0',
    buildId: 'build-1000',
    platformIssues: 0
  },
  {
    id: 'pipeline-3',
    name: 'DataFlow Regression Test',
    status: 'passed',
    date: 'Mar 9, 05:01 PM',
    duration: '9m 47s',
    tests: { passed: 5, total: 5 },
    owner: 'system',
    productId: 'product-a',
    releaseId: 'release-1.1.0',
    buildId: 'build-1000',
    platformIssues: 1
  },
  {
    id: 'pipeline-4',
    name: 'Unity Integration Test',
    status: 'passed',
    date: 'May 15, 02:50 PM',
    duration: '5m 30s',
    tests: { passed: 4, total: 4 },
    owner: 'alex.smith',
    productId: 'product-a',
    releaseId: 'release-1.1.0',
    buildId: 'build-1000',
    platformIssues: 2
  },
  {
    id: 'pipeline-5',
    name: 'API Integration Test',
    status: 'failed',
    date: 'May 16, 03:30 PM',
    duration: '4m 12s',
    tests: { passed: 2, total: 6 },
    owner: 'system',
    productId: 'product-b',
    releaseId: 'release-2.2.1',
    buildId: 'build-1002',
    platformIssues: 4
  },
  {
    id: 'pipeline-6',
    name: 'Storage Performance Test',
    status: 'inprogress',
    date: 'May 16, 04:50 PM',
    duration: '8m 05s',
    tests: { passed: 3, total: 7 },
    owner: 'jane.doe',
    productId: 'product-c',
    releaseId: 'release-3.2.0',
    buildId: 'build-1004',
    platformIssues: 1
  },
  {
    id: 'pipeline-7',
    name: 'Security Compliance Test',
    status: 'pending',
    date: 'May 17, 09:15 AM',
    duration: '-',
    tests: { passed: 0, total: 8 },
    owner: 'system',
    productId: 'product-a',
    releaseId: 'release-1.2.0',
    buildId: 'build-1234',
    platformIssues: 0
  },
  {
    id: 'pipeline-8',
    name: 'Cloud Functions Integration',
    status: 'passed',
    date: 'May 18, 10:30 AM',
    duration: '3m 45s',
    tests: { passed: 12, total: 12 },
    owner: 'emma.johnson',
    productId: 'product-a',
    releaseId: 'release-1.1.0',
    buildId: 'build-1001',
    platformIssues: 0
  },
  {
    id: 'pipeline-9',
    name: 'Spanner Database Tests',
    status: 'failed',
    date: 'May 18, 11:15 AM',
    duration: '6m 20s',
    tests: { passed: 7, total: 15 },
    owner: 'system',
    productId: 'product-b',
    releaseId: 'release-2.2.1',
    buildId: 'build-1002',
    platformIssues: 3
  },
  {
    id: 'pipeline-10',
    name: 'Cloud Run Deployment',
    status: 'inprogress',
    date: 'May 18, 01:45 PM',
    duration: '15m 10s',
    tests: { passed: 5, total: 18 },
    owner: 'david.miller',
    productId: 'product-c',
    releaseId: 'release-3.2.0',
    buildId: 'build-1004',
    platformIssues: 2
  },
  {
    id: 'pipeline-11',
    name: 'Authentication Service Test',
    status: 'aborted',
    date: 'May 19, 09:30 AM',
    duration: '2m 15s',
    tests: { passed: 3, total: 10 },
    owner: 'system',
    productId: 'product-a',
    releaseId: 'release-1.2.0',
    buildId: 'build-1234',
    platformIssues: 5
  },
  {
    id: 'pipeline-12',
    name: 'Payment Gateway Integration',
    status: 'passed',
    date: 'May 19, 10:45 AM',
    duration: '7m 30s',
    tests: { passed: 14, total: 14 },
    owner: 'sarah.parker',
    productId: 'product-b',
    releaseId: 'release-2.3.0',
    buildId: 'build-1007',
    platformIssues: 0
  },
  {
    id: 'pipeline-13',
    name: 'User Profile Service',
    status: 'failed',
    date: 'May 19, 02:15 PM',
    duration: '4m 50s',
    tests: { passed: 6, total: 12 },
    owner: 'system',
    productId: 'product-c',
    releaseId: 'release-3.2.0',
    buildId: 'build-1005',
    platformIssues: 2
  },
  {
    id: 'pipeline-14',
    name: 'Search Functionality Test',
    status: 'pending',
    date: 'May 20, 08:30 AM',
    duration: '-',
    tests: { passed: 0, total: 8 },
    owner: 'john.smith',
    productId: 'product-a',
    releaseId: 'release-1.1.0',
    buildId: 'build-1006',
    platformIssues: 1
  },
  {
    id: 'pipeline-15',
    name: 'GraphQL API Testing',
    status: 'passed',
    date: 'May 20, 11:20 AM',
    duration: '5m 15s',
    tests: { passed: 9, total: 9 },
    owner: 'system',
    productId: 'product-b',
    releaseId: 'release-2.3.0.1',
    buildId: 'build-1008',
    platformIssues: 0
  },
  {
    id: 'pipeline-16',
    name: 'File Upload Service',
    status: 'inprogress',
    date: 'May 20, 02:40 PM',
    duration: '12m 30s',
    tests: { passed: 4, total: 11 },
    owner: 'lisa.wong',
    productId: 'product-c',
    releaseId: 'release-3.2.0',
    buildId: 'build-1008',
    platformIssues: 3
  },
  {
    id: 'pipeline-17',
    name: 'Notification Service',
    status: 'passed',
    date: 'May 21, 09:10 AM',
    duration: '3m 45s',
    tests: { passed: 7, total: 7 },
    owner: 'system',
    productId: 'product-a',
    releaseId: 'release-1.2.0',
    buildId: 'build-1235',
    platformIssues: 0
  },
  {
    id: 'pipeline-18',
    name: 'Analytics Dashboard',
    status: 'failed',
    date: 'May 21, 11:35 AM',
    duration: '8m 20s',
    tests: { passed: 5, total: 13 },
    owner: 'mark.johnson',
    productId: 'product-b',
    releaseId: 'release-2.2.1',
    buildId: 'build-1003',
    platformIssues: 4
  },
  {
    id: 'pipeline-19',
    name: 'User Authentication Flow',
    status: 'aborted',
    date: 'May 21, 03:50 PM',
    duration: '1m 40s',
    tests: { passed: 1, total: 6 },
    owner: 'system',
    productId: 'product-c',
    releaseId: 'release-3.2.0',
    buildId: 'build-1004',
    platformIssues: 2
  },
  {
    id: 'pipeline-20',
    name: 'Mobile API Compatibility',
    status: 'passed',
    date: 'May 22, 10:05 AM',
    duration: '6m 15s',
    tests: { passed: 10, total: 10 },
    owner: 'james.wilson',
    productId: 'product-a',
    releaseId: 'release-1.1.0',
    buildId: 'build-1000',
    platformIssues: 1
  },
  {
    id: 'pipeline-21',
    name: 'Load Balancer Configuration',
    status: 'inprogress',
    date: 'May 22, 01:30 PM',
    duration: '25m 10s',
    tests: { passed: 3, total: 8 },
    owner: 'system',
    productId: 'product-b',
    releaseId: 'release-2.3.0',
    buildId: 'build-1007',
    platformIssues: 2
  },
  {
    id: 'pipeline-22',
    name: 'Database Migration Tests',
    status: 'pending',
    date: 'May 22, 04:15 PM',
    duration: '-',
    tests: { passed: 0, total: 5 },
    owner: 'olivia.green',
    productId: 'product-c',
    releaseId: 'release-3.2.0',
    buildId: 'build-1005',
    platformIssues: 0
  }
];

export const calculatePipelineStats = (filteredPipelines: Pipeline[]): PipelineStats => {
  // Get unique builds
  const uniqueBuilds = new Set(filteredPipelines.map(p => p.buildId));
  
  // Calculate success rate
  const passedPipelines = filteredPipelines.filter(p => p.status === 'passed').length;
  const successRate = filteredPipelines.length > 0 
    ? Math.round((passedPipelines / filteredPipelines.length) * 100) 
    : 0;
  
  // Get latest build date (assuming we want the most recent)
  let latestBuild = '';
  if (filteredPipelines.length > 0) {
    const sortedPipelines = [...filteredPipelines].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    latestBuild = sortedPipelines[0].buildId;
  }
  
  // Calculate total platform issues
  const platformIssues = filteredPipelines.reduce((total, pipeline) => 
    total + (pipeline.platformIssues || 0), 0);

  // Count status
  const statusCounts = {
    passed: filteredPipelines.filter(p => p.status === 'passed').length,
    failed: filteredPipelines.filter(p => p.status === 'failed').length,
    inprogress: filteredPipelines.filter(p => p.status === 'inprogress' || p.status === 'pending').length,
  };
  
  return {
    totalBuilds: uniqueBuilds.size,
    successRate,
    latestBuild,
    platformIssues,
    status: statusCounts
  };
};

// Helper function to generate a random commit ID
const generateCommitId = () => {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < 40; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper function to generate a random SHA digest
const generateShaDigest = () => {
  const chars = 'abcdef0123456789';
  let result = 'sha256:';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper to generate random repository details
const getRepositoryDetails = (productName: string) => {
  const repos = [
    'github.com/myorg/frontend-web',
    'github.com/myorg/backend-api',
    'github.com/myorg/data-service',
    'github.com/myorg/auth-service',
    'github.com/myorg/notification-service'
  ];
  
  const branches = [
    'main',
    'develop',
    'feature/auth-improvements',
    'hotfix/security-patch',
    'release/v2.0'
  ];
  
  const authors = [
    'John Doe <john.doe@example.com>',
    'Jane Smith <jane.smith@example.com>',
    'Mike Johnson <mike.johnson@example.com>',
    'Sarah Williams <sarah.williams@example.com>',
    'Alex Brown <alex.brown@example.com>'
  ];
  
  return {
    commitId: generateCommitId(),
    repositoryUrl: `https://${repos[Math.floor(Math.random() * repos.length)]}`,
    branch: branches[Math.floor(Math.random() * branches.length)],
    author: authors[Math.floor(Math.random() * authors.length)]
  };
};

// Helper to generate random artifact details
const getArtifactDetails = (productName: string, buildNumber: string) => {
  const artifactNames = [
    'api-service',
    'web-frontend',
    'data-processor',
    'auth-service',
    'notification-service'
  ];
  
  const name = artifactNames[Math.floor(Math.random() * artifactNames.length)];
  const sanitizedProductName = productName.toLowerCase().replace(/\s+/g, '-');
  const commitId = generateCommitId().substring(0, 8);
  
  return {
    name,
    imageUrl: `container-registry.com/${sanitizedProductName}/${name}:${buildNumber}-${commitId}`,
    shaDigest: generateShaDigest()
  };
};

// Helper to generate enhanced build data
const generateEnhancedBuildData = (productName: string, buildNumber: string, status: 'passed' | 'failed' | 'inprogress') => {
  const baseUrl = 'https://jenkins.example.com';
  const sanitizedProductName = productName.toLowerCase().replace(/\s+/g, '-');
  
  // Generate 1-3 commit details
  const commitCount = Math.floor(Math.random() * 3) + 1;
  const commitDetails = [];
  for (let i = 0; i < commitCount; i++) {
    commitDetails.push(getRepositoryDetails(productName));
  }
  
  // Generate 1-3 artifacts
  const artifactCount = Math.floor(Math.random() * 3) + 1;
  const artifacts = [];
  for (let i = 0; i < artifactCount; i++) {
    artifacts.push(getArtifactDetails(productName, buildNumber));
  }
  
  return {
    commitDetails,
    artifacts,
    jenkinsUrl: `${baseUrl}/job/${sanitizedProductName}/job/build-${buildNumber}`
  };
};

export const fetchProducts = async (): Promise<Product[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(products);
    }, 300);
  });
};

export const fetchPipelines = async (
  productId: string | null = null,
  releaseId: string | null = null,
  buildId: string | null = null
): Promise<Pipeline[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let result = [...pipelines];
      
      if (productId) {
        result = result.filter(pipeline => pipeline.productId === productId);
      }
      
      if (releaseId) {
        result = result.filter(pipeline => pipeline.releaseId === releaseId);
      }
      
      if (buildId) {
        result = result.filter(pipeline => pipeline.buildId === buildId);
      }
      
      resolve(result);
    }, 500);
  });
};

export const fetchPipelineStats = async (
  productId: string | null = null,
  releaseId: string | null = null,
  buildId: string | null = null
): Promise<PipelineStats> => {
  return new Promise(resolve => {
    setTimeout(async () => {
      const filteredPipelines = await fetchPipelines(productId, releaseId, buildId);
      resolve(calculatePipelineStats(filteredPipelines));
    }, 300);
  });
};

export const fetchBuildDetails = async (buildId: string): Promise<Build | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    // Find the product that contains this build
    for (const product of products) {
      for (const release of product.releases) {
        const build = release.builds.find(b => b.id === buildId);
        if (build) {
          const enhancedData = generateEnhancedBuildData(
            product.name,
            build.buildNumber,
            build.status
          );
          
          return {
            ...build,
            ...enhancedData
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching build details:', error);
    return null;
  }
};
