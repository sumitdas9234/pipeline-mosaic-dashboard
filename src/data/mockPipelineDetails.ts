
import { PipelineDetail, Status, TestItem } from '@/types';

// Helper function to generate log content based on test status
const generateLogContent = (testName: string, status: Status): string => {
  const baseLog = `Running test: ${testName}\nInitializing test environment...\nSetting up dependencies...\n`;
  
  switch (status) {
    case 'passed':
      return `${baseLog}Test executed successfully.\nAll assertions passed.\nTest completed in 2.34s\n`;
    case 'failed':
      return `${baseLog}ERROR: Assertion failed at line 42\nExpected: true\nActual: false\nTest failed after 1.87s\n`;
    case 'aborted':
      return `${baseLog}WARNING: Test execution aborted by user\nCleanup routines executed\nTest aborted after 0.95s\n`;
    case 'pending':
      return `${baseLog}Test queued and waiting for resources...\n`;
    case 'inprogress':
      return `${baseLog}Test currently running...\nExecuting step 2 of 5...\n`;
    default:
      return baseLog;
  }
};

// Generate test items for a pipeline
const generateTestItems = (pipelineId: string, totalTests: number, passedTests: number) => {
  const testItems: TestItem[] = [];
  const statuses: Status[] = ['passed', 'failed', 'aborted', 'pending', 'inprogress'];
  
  for (let i = 1; i <= totalTests; i++) {
    // Determine status - ensure correct number of passed tests
    let status: Status;
    if (i <= passedTests) {
      status = 'passed';
    } else {
      // For failed tests, randomly choose a non-passed status
      const nonPassedStatuses = statuses.filter(s => s !== 'passed');
      status = nonPassedStatuses[Math.floor(Math.random() * nonPassedStatuses.length)];
    }
    
    const testName = `Test-${pipelineId}-${i}`;
    
    testItems.push({
      id: `test-${pipelineId}-${i}`,
      name: testName,
      status,
      duration: `${(Math.random() * 5).toFixed(2)}s`,
      logs: generateLogContent(testName, status),
      step: i,
      testRunUrl: `https://jenkins.example.com/job/test-${pipelineId}/${i}`,
      description: `Description for ${testName}`
    });
  }
  
  return testItems;
};

// Generate detailed test cases like in the image
const generateDetailedTestCases = (pipelineId: string): TestItem[] => {
  return [
    {
      id: `test-${pipelineId}-1`,
      name: 'TestbedDeployment',
      status: 'passed',
      duration: '1m 34s',
      logs: 'Testbed deployment logs...',
      step: 1,
      testRunUrl: 'jenkins-history',
      description: 'Testbed Deployment'
    },
    {
      id: `test-${pipelineId}-2`,
      name: 'InstallK8s',
      status: 'passed',
      duration: '1m 28s',
      logs: 'K8s installation logs...',
      step: 2,
      testRunUrl: 'jenkins-history',
      description: 'K8S install - v1.31.0'
    },
    {
      id: `test-${pipelineId}-3`,
      name: 'PWXInstall',
      status: 'passed',
      duration: '1m 55s',
      logs: 'PWX installation logs...',
      step: 3,
      testRunUrl: 'jenkins-history',
      description: 'Install 3.2.2 Portworx on a Kubernetes cluster'
    },
    {
      id: `test-${pipelineId}-4`,
      name: 'VCenterCleanup',
      status: 'passed',
      duration: '0s',
      logs: 'VCenter cleanup logs...',
      step: 4,
      testRunUrl: 'jenkins-history',
      description: 'Destroy all resources for a given stack on vCenter'
    }
  ];
};

// Function to fetch pipeline detail by ID
export const fetchPipelineDetail = (id: string): Promise<PipelineDetail> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockPipeline = MOCK_PIPELINE_DETAILS.find(pipeline => pipeline.id === id);
      
      if (mockPipeline) {
        resolve(mockPipeline);
      } else {
        // If no matching pipeline is found, create a generic one
        const genericPipeline: PipelineDetail = {
          id,
          name: `Pipeline ${id}`,
          status: 'passed',
          date: new Date().toISOString().split('T')[0],
          duration: '3m 45s',
          tests: { passed: 8, total: 10 },
          owner: 'System',
          productId: 'default-product',
          releaseId: 'default-release',
          buildId: 'default-build',
          testsetId: 'default-testset',
          history: ['passed', 'passed', 'failed', 'passed', 'passed'],
          description: 'Generic pipeline',
          environment: 'Production',
          trigger: 'Manual',
          startTime: '2023-08-01T10:00:00',
          endTime: '2023-08-01T10:03:45',
          testItems: generateTestItems(id, 10, 8),
          suiteId: '1089922',
          user: 'System User'
        };
        resolve(genericPipeline);
      }
    }, 500);
  });
};

// Mock pipeline details
export const MOCK_PIPELINE_DETAILS: PipelineDetail[] = [
  {
    id: 'pipe-001',
    name: 'Stork Backup CSI Functional Tests',
    status: 'passed',
    date: '2023-03-27',
    duration: '12m 45s',
    tests: { passed: 4, total: 4 },
    owner: 'pwx-bat',
    productId: 'prod-001',
    releaseId: 'rel-001',
    buildId: 'build-001',
    testsetId: 'ts-001',
    history: ['passed', 'passed', 'passed', 'failed', 'passed'],
    description: 'Stork Backup CSI Functional Tests',
    environment: 'Production',
    trigger: 'Automated',
    startTime: '2023-03-27 9:31:23 AM',
    endTime: '2023-03-27 12:23:25 PM',
    testItems: generateDetailedTestCases('pipe-001'),
    suiteId: '1089922',
    user: 'pwx-bat',
    branch: '3.2.2',
    testType: 'BAT',
    lastSuccess: '1091358 (Mar 28, 2023, 12:20:08 PM)',
    bugs: ['N/A'],
    comments: ['N/A'],
    testbedDetails: 'backup-csi-k8s-1-28-0-996 (Deleted)',
    tags: ['functional', 'csi', 'backup'],
    testCaseCount: 4
  },
  {
    id: 'pipe-002',
    name: 'Frontend Unit Tests',
    status: 'failed',
    date: '2023-08-02',
    duration: '2m 30s',
    tests: { passed: 18, total: 20 },
    owner: 'John Doe',
    productId: 'prod-002',
    releaseId: 'rel-002',
    buildId: 'build-002',
    testsetId: 'ts-002',
    history: ['failed', 'passed', 'passed', 'passed', 'passed'],
    description: 'Run unit tests for frontend components',
    environment: 'Development',
    trigger: 'Pull Request',
    startTime: '2023-08-02T12:15:00',
    endTime: '2023-08-02T12:17:30',
    testItems: generateTestItems('pipe-002', 20, 18),
    suiteId: '1089923'
  },
  {
    id: 'pipe-003',
    name: 'Database Migration Tests',
    status: 'inprogress',
    date: '2023-08-03',
    duration: '4m 10s',
    tests: { passed: 7, total: 15 },
    owner: 'Sarah Johnson',
    productId: 'prod-003',
    releaseId: 'rel-003',
    buildId: 'build-003',
    testsetId: 'ts-003',
    history: ['inprogress', 'passed', 'passed', 'failed', 'aborted'],
    description: 'Validate database migration scripts',
    environment: 'Staging',
    trigger: 'Manual',
    startTime: '2023-08-03T14:30:00',
    endTime: '2023-08-03T14:34:10',
    testItems: generateTestItems('pipe-003', 15, 7),
    suiteId: '1089924'
  },
  {
    id: 'pipe-004',
    name: 'Security Scans',
    status: 'aborted',
    date: '2023-08-04',
    duration: '10m 00s',
    tests: { passed: 5, total: 25 },
    owner: 'Mike Williams',
    productId: 'prod-001',
    releaseId: 'rel-004',
    buildId: 'build-004',
    testsetId: 'ts-004',
    history: ['aborted', 'failed', 'failed', 'passed', 'passed'],
    description: 'Run security vulnerability scans',
    environment: 'Production',
    trigger: 'Scheduled',
    startTime: '2023-08-04T01:00:00',
    endTime: '2023-08-04T01:10:00',
    testItems: generateTestItems('pipe-004', 25, 5),
    suiteId: '1089925'
  },
  {
    id: 'pipe-005',
    name: 'End-to-End Tests',
    status: 'pending',
    date: '2023-08-05',
    duration: 'Pending',
    tests: { passed: 0, total: 30 },
    owner: 'Emily Chen',
    productId: 'prod-002',
    releaseId: 'rel-005',
    buildId: 'build-005',
    testsetId: 'ts-005',
    history: ['pending', 'passed', 'passed', 'passed', 'failed'],
    description: 'Run E2E tests for critical user journeys',
    environment: 'Test',
    trigger: 'Deployment',
    startTime: 'Pending',
    endTime: 'Pending',
    testItems: generateTestItems('pipe-005', 30, 0),
    suiteId: '1089926'
  }
];
