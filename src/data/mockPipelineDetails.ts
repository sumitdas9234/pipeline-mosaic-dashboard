
import { PipelineDetail, Status } from '@/types';

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
  const testItems = [];
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
      logs: generateLogContent(testName, status)
    });
  }
  
  return testItems;
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
          testItems: generateTestItems(id, 10, 8)
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
    name: 'API Integration Tests',
    status: 'passed',
    date: '2023-08-01',
    duration: '3m 45s',
    tests: { passed: 12, total: 12 },
    owner: 'Jane Smith',
    productId: 'prod-001',
    releaseId: 'rel-001',
    buildId: 'build-001',
    testsetId: 'ts-001',
    history: ['passed', 'passed', 'passed', 'failed', 'passed'],
    description: 'Run integration tests for the API endpoints',
    environment: 'Staging',
    trigger: 'Automated',
    startTime: '2023-08-01T10:00:00',
    endTime: '2023-08-01T10:03:45',
    testItems: generateTestItems('pipe-001', 12, 12)
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
    testItems: generateTestItems('pipe-002', 20, 18)
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
    testItems: generateTestItems('pipe-003', 15, 7)
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
    testItems: generateTestItems('pipe-004', 25, 5)
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
    testItems: generateTestItems('pipe-005', 30, 0)
  }
];
