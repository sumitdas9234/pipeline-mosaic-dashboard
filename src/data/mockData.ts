import { Product, Pipeline, PipelineStats, Build } from '@/types';

// Add type definition for Status if not already defined
type Status = 'passed' | 'failed' | 'aborted' | 'pending' | 'inprogress';

// Helper function to generate random status history
const generateRandomHistory = (baseStatus: 'passed' | 'failed' | 'aborted' | 'pending' | 'inprogress', length = 20) => {
  const statuses: ('passed' | 'failed' | 'aborted' | 'pending' | 'inprogress')[] = ['passed', 'failed', 'aborted', 'pending', 'inprogress'];
  const history = [];
  
  // Make the history somewhat biased towards the current status
  const bias = 0.5; // 50% chance to be the base status
  
  for (let i = 0; i < length; i++) {
    if (Math.random() < bias) {
      history.push(baseStatus);
    } else {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      history.push(randomStatus);
    }
  }
  
  return history;
};

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

// Helper function to generate pipelines for a build
const generateBuildPipelines = (buildId: string, productId: string, releaseId: string): Pipeline[] => {
  const pipelineNames = [
    'API Integration Test',
    'UI Test Suite',
    'Performance Test',
    'Security Scan',
    'Database Migration Test',
    'Load Test',
    'Smoke Test',
    'End-to-End Test',
    'Unit Test Suite',
    'Regression Test'
  ];

  return pipelineNames.map((name, index) => {
    // Ensure at least 5 pipelines are failed and properly type the status
    const status: Status = index < 5 ? 'failed' : (['passed', 'inprogress'] as const)[Math.floor(Math.random() * 2)];
    
    // Generate a random 5-digit number for testsetId
    const testsetId = Math.floor(10000 + Math.random() * 90000).toString();
    
    return {
      id: `pipeline-${buildId}-${index + 1}`,
      name,
      status,
      testsetId,
      date: new Date().toISOString().split('T')[0],
      duration: `${Math.floor(Math.random() * 10) + 1}m ${Math.floor(Math.random() * 60)}s`,
      tests: { 
        passed: Math.floor(Math.random() * 10),
        total: 10
      },
      owner: 'system',
      productId,
      releaseId,
      buildId,
      platformIssues: Math.floor(Math.random() * 5),
      history: generateRandomHistory(status as 'passed' | 'failed' | 'aborted' | 'pending' | 'inprogress')
    };
  });
};

// Update the pipelines array
export const pipelines: Pipeline[] = products.flatMap(product =>
  product.releases.flatMap(release =>
    release.builds.flatMap(build =>
      generateBuildPipelines(build.id, product.id, release.id)
    )
  )
);

export const calculatePipelineStats = (filteredPipelines: Pipeline[]): PipelineStats => {
  // Get unique builds
  const uniqueBuilds = new Set(filteredPipelines.map(p => p.buildId));
  
  // Calculate success rate using total pipelines (should be 10)
  const totalPipelines = 10; // Fixed number of pipelines per build
  const passedPipelines = filteredPipelines.filter(p => p.status === 'passed').length;
  const successRate = Math.round((passedPipelines / totalPipelines) * 100);
  
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
    failed: Math.max(5, filteredPipelines.filter(p => p.status === 'failed').length),
    inprogress: filteredPipelines.filter(p => p.status === 'inprogress' || p.status === 'pending').length,
  };
  
  return {
    totalBuilds: totalPipelines, // Changed from uniqueBuilds.size to totalPipelines
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
