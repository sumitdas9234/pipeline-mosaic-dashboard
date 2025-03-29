import { Product, Pipeline, PipelineStats, Build, Status, Testcase } from '@/types'; // Added Testcase import
import { faker } from '@faker-js/faker'; // Using faker for more realistic data

// --- Constants ---
const PRODUCT_ID = 'product-a';
const PRODUCT_NAME = 'Product A';
const RELEASES = [
  { id: 'release-1.1.0', name: '1.1.0' },
  { id: 'release-1.2.0', name: '1.2.0' },
];
const BUILDS_PER_RELEASE = 15;
const PIPELINES_PER_BUILD = 15;
// Define all possible statuses for history generation first
const ALL_POSSIBLE_STATUSES: Status[] = ['passed', 'failed', 'aborted', 'pending', 'inprogress'];
// Define allowed statuses for *new* pipelines
const ALLOWED_PIPELINE_STATUSES: Status[] = ['passed', 'failed', 'inprogress'];
const BUILD_ID_MIN = 1675;
const BUILD_ID_MAX = 1960;
const TESTSET_ID_MIN = 156785;
const TESTSET_ID_MAX = 176543;


// --- Helper Functions ---

// Generate random status history
const generateRandomHistory = (baseStatus: Status, length = 20): Status[] => {
  const history: Status[] = [];
  // Define statuses valid for historical runs (excluding inprogress/pending)
  const historicalStatuses: Status[] = ['passed', 'failed', 'aborted'];
  const bias = 0.6; // 60% chance to be the base status (for historical part)

  // Generate the historical part (length - 1 elements)
  for (let i = 0; i < length - 1; i++) {
    // Bias towards the *current* status for some consistency, but pick only from historical ones
    if (Math.random() < bias && historicalStatuses.includes(baseStatus)) {
       history.push(baseStatus);
    } else {
      // Pick a random valid historical status
      history.push(faker.helpers.arrayElement(historicalStatuses));
    }
  }

  // Ensure the last element matches the current pipeline status
  history.push(baseStatus);

  return history;
};

// Generate random commit details
const generateCommitDetails = () => ({
  commitId: faker.git.commitSha(),
  repositoryUrl: faker.internet.url({ appendSlash: false, protocol: 'https' }) + '/' + faker.lorem.slug(),
  branch: faker.git.branch(),
  author: `${faker.person.fullName()} <${faker.internet.email()}>`,
});

// Generate random artifact details
const generateArtifactDetails = (productName: string, buildNumber: string) => {
  const name = faker.helpers.arrayElement(['api-service', 'web-frontend', 'data-processor', 'auth-service', 'notification-service']);
  const sanitizedProductName = productName.toLowerCase().replace(/\s+/g, '-');
  return {
    name,
    imageUrl: `container-registry.com/${sanitizedProductName}/${name}:${buildNumber}-${faker.git.commitSha({ length: 8 })}`,
    shaDigest: `sha256:${faker.string.hexadecimal({ length: 64, prefix: '', casing: 'lower' })}`,
  };
};

// Generate enhanced build data (commit details, artifacts)
const generateEnhancedBuildData = (productName: string, buildNumber: string) => {
  const baseUrl = 'https://jenkins.example.com';
  const sanitizedProductName = productName.toLowerCase().replace(/\s+/g, '-');
  const commitCount = faker.number.int({ min: 1, max: 3 });
  const artifactCount = faker.number.int({ min: 1, max: 3 });

  return {
    commitDetails: Array.from({ length: commitCount }, generateCommitDetails),
    artifacts: Array.from({ length: artifactCount }, () => generateArtifactDetails(productName, buildNumber)),
    jenkinsUrl: `${baseUrl}/job/${sanitizedProductName}/job/build-${buildNumber}`,
  };
};

// Generate a specified number of unique builds within the defined range for a release
const generateBuilds = (releaseId: string, count: number): Build[] => {
  const builds: Build[] = [];
  const generatedNumbers = new Set<number>();

  // Ensure we don't request more unique builds than available in the range
  const maxPossibleBuilds = BUILD_ID_MAX - BUILD_ID_MIN + 1;
  const buildsToGenerate = Math.min(count, maxPossibleBuilds);

  while (generatedNumbers.size < buildsToGenerate) {
    generatedNumbers.add(faker.number.int({ min: BUILD_ID_MIN, max: BUILD_ID_MAX }));
  }

  generatedNumbers.forEach(buildNum => {
    const buildNumberStr = buildNum.toString();
    const buildId = `build-${buildNumberStr}`;
    // Build status can still be passed/failed/inprogress
    const status = faker.helpers.arrayElement(['passed', 'failed', 'inprogress'] as const);
    const enhancedData = generateEnhancedBuildData(PRODUCT_NAME, buildNumberStr);
    // Correctly structure the pushed object
    builds.push({
      id: buildId,
      buildNumber: buildNumberStr,
      date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
      status: status,
      ...enhancedData,
    });
  }); // Close forEach loop correctly
  return builds;
};

// Generate pipelines for a specific build
const generateBuildPipelines = (buildId: string, productId: string, releaseId: string, count: number): Pipeline[] => {
  const pipelines: Pipeline[] = [];
  for (let i = 0; i < count; i++) {
    const pipelineIndex = i + 1;
    // Use only allowed statuses
    const status = faker.helpers.arrayElement(ALLOWED_PIPELINE_STATUSES);
    const testsPassed = faker.number.int({ min: 0, max: 100 });
    const testsTotal = testsPassed + faker.number.int({ min: 0, max: 20 }); // Total is always >= passed

    pipelines.push({
      id: `pipeline-${buildId}-${pipelineIndex}`,
      name: `pipeline-${pipelineIndex}`,
      status: status, // Assign restricted status
      // Generate Testset ID within the specified range
      testsetId: faker.number.int({ min: TESTSET_ID_MIN, max: TESTSET_ID_MAX }).toString(),
      date: faker.date.recent({ days: 1 }).toISOString().split('T')[0], // Pipelines run recently
      duration: `${faker.number.int({ min: 0, max: 59 })}m ${faker.number.int({ min: 0, max: 59 })}s`,
      tests: {
        passed: testsPassed,
        total: testsTotal,
      },
      owner: faker.helpers.arrayElement(['system', 'dev-team', 'qa-team']),
      productId: productId,
      releaseId: releaseId,
      buildId: buildId,
      platformIssues: status === 'failed' ? faker.number.int({ min: 0, max: 5 }) : 0, // Issues more likely on failure
      history: generateRandomHistory(status),
      // Add optional fields from Pipeline type
      suiteId: `suite-${faker.string.alphanumeric(5)}`,
      branch: faker.git.branch(),
      description: faker.lorem.sentence(),
      lastSuccess: status === 'passed' ? faker.date.recent({ days: 7 }).toISOString() : undefined,
      startTime: faker.date.recent({ days: 1 }).toISOString(),
      // Ensure endTime is after startTime for completed statuses
      endTime: status !== 'inprogress' && status !== 'pending'
        ? faker.date.soon({ days: 1, refDate: pipelines[pipelines.length - 1]?.startTime ?? new Date() }).toISOString()
        : undefined,
    });
  }
  return pipelines;
};

// --- Generate Mock Data ---

// Generate builds for each release using the new random range logic
const generatedBuilds: { [releaseId: string]: Build[] } = {};
RELEASES.forEach(release => {
  generatedBuilds[release.id] = generateBuilds(release.id, BUILDS_PER_RELEASE);
});

// Define the single product with its releases and generated builds
export const products: Product[] = [
  {
    id: PRODUCT_ID,
    name: PRODUCT_NAME,
    releases: RELEASES.map(release => ({
      id: release.id,
      name: release.name,
      builds: generatedBuilds[release.id],
    })),
  },
];

// Generate pipelines for all builds across all releases
export const pipelines: Pipeline[] = products.flatMap(product =>
  product.releases.flatMap(release =>
    release.builds.flatMap(build =>
      generateBuildPipelines(build.id, product.id, release.id, PIPELINES_PER_BUILD)
    )
  )
);

// --- Generate Mock Testcases ---

// Modify function to accept pipeline status
const generateTestcasesForTestset = (testsetId: string, pipelineStatus: Status): Testcase[] => {
  const testcaseCount = faker.number.int({ min: 5, max: 25 });
  const testcases: Testcase[] = [];
  // Define allowed statuses for non-passed/non-failed pipelines
  const randomTestcaseStatuses: Status[] = ['passed', 'failed', 'inprogress', 'pending'];
  let hasFailed = false; // Track if a failed testcase was added for a failed pipeline

  for (let i = 0; i < testcaseCount; i++) {
    const testcaseId = `tc-${testsetId}-${i + 1}`;
    let status: Status;

    if (pipelineStatus === 'passed') {
      status = 'passed'; // Force passed if pipeline passed
    } else if (pipelineStatus === 'failed') {
      // Ensure at least one test fails if the pipeline failed
      if (i === testcaseCount - 1 && !hasFailed) { // If last testcase and none failed yet
        status = 'failed';
      } else {
        status = faker.helpers.arrayElement(randomTestcaseStatuses);
        if (status === 'failed') hasFailed = true;
      }
    } else {
      // For 'inprogress' pipelines, allow random statuses
      status = faker.helpers.arrayElement(randomTestcaseStatuses);
    }

    testcases.push({
      testcaseId: testcaseId,
      testsetId: testsetId,
      name: `Test Case ${faker.lorem.words(3)}`,
      status: status,
      duration: `${faker.number.int({ min: 0, max: 5 })}m ${faker.number.int({ min: 0, max: 59 })}s`,
      logs: faker.internet.url() + '/logs',
      step: i + 1,
      testRunUrl: faker.internet.url() + '/testrun/' + testcaseId,
      description: faker.lorem.sentence(),
      history: generateRandomHistory(status), // Generate history based on current status
    });
  }
  return testcases;
};

// Generate testcases for every pipeline/testset, passing the pipeline status
export const mockTestcases: Testcase[] = pipelines.flatMap(pipeline =>
  generateTestcasesForTestset(pipeline.testsetId, pipeline.status)
);

// --- Update Pipeline Test Counts Based on Generated Testcases ---
// This loop now correctly reflects the potentially forced testcase statuses
pipelines.forEach(pipeline => {
  const associatedTestcases = mockTestcases.filter(tc => tc.testsetId === pipeline.testsetId);
  const passedCount = associatedTestcases.filter(tc => tc.status === 'passed').length;
  pipeline.tests = {
    passed: passedCount,
    total: associatedTestcases.length,
  };
});
// --- End Update ---


// --- Data Calculation & Fetching ---

export const calculatePipelineStats = (filteredPipelines: Pipeline[]): PipelineStats => {
  if (filteredPipelines.length === 0) {
    return {
      totalBuilds: 0,
      successRate: 0,
      latestBuild: 'N/A',
      platformIssues: 0,
      status: { passed: 0, failed: 0, aborted: 0, pending: 0, inprogress: 0 },
    };
  }

  const buildIds = new Set(filteredPipelines.map(p => p.buildId));

  // Calculate counts based *only* on the pipelines passed into this function
  // Use ALL_POSSIBLE_STATUSES for calculating the full status breakdown
  const statusCounts = ALL_POSSIBLE_STATUSES.reduce((acc, status) => {
    acc[status] = filteredPipelines.filter(p => p.status === status).length;
    return acc;
  }, {} as Record<Status, number>);


  // Calculate total relevant pipelines (passed, failed, inprogress) from the counts
  const relevantTotalPipelines = statusCounts.passed + statusCounts.failed + statusCounts.inprogress;

  // Calculate success rate based on relevant total
  const successRate = relevantTotalPipelines > 0 ? Math.round((statusCounts.passed / relevantTotalPipelines) * 100) : 0;

  // Find the latest build *represented in the filtered data*
  let latestBuildId = 'N/A';
  if (filteredPipelines.length > 0) {
    // Find the build associated with the most recent pipeline date
    const sortedPipelines = [...filteredPipelines].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    latestBuildId = sortedPipelines[0].buildId;
  }

  const platformIssues = filteredPipelines.reduce((total, pipeline) =>
    total + (pipeline.platformIssues || 0), 0);

  // Removed duplicated statusCounts calculation

  return {
    totalBuilds: buildIds.size, // Count unique builds represented
    successRate,
    latestBuild: latestBuildId, // Show the ID of the latest build in the filtered set
    platformIssues,
    status: statusCounts, // Use the correctly calculated statusCounts
    relevantTotalPipelines: relevantTotalPipelines, // Include the relevant total
  };
};


// --- Mock API Functions ---

// Function to fetch testcases for a specific testset ID
export const fetchTestcases = async (testsetId: string): Promise<Testcase[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, faker.number.int({ min: 109876, max: 139876 })));
  return mockTestcases.filter(tc => tc.testsetId === testsetId);
};

export const fetchProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, faker.number.int({ min: 100, max: 400 })));
  return products;
};

export const fetchPipelines = async (
  productId: string | null = null,
  releaseId: string | null = null,
  buildId: string | null = null
): Promise<Pipeline[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, faker.number.int({ min: 200, max: 600 })));

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

  return result;
};

export const fetchPipelineStats = async (
  productId: string | null = null,
  releaseId: string | null = null,
  buildId: string | null = null
): Promise<PipelineStats> => {
   // Simulate API delay
   await new Promise(resolve => setTimeout(resolve, faker.number.int({ min: 150, max: 450 })));
   const filteredPipelines = await fetchPipelines(productId, releaseId, buildId);
   return calculatePipelineStats(filteredPipelines);
};

export const fetchBuildDetails = async (buildId: string): Promise<Build | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, faker.number.int({ min: 250, max: 550 })));

  try {
    // Find the build within the generated products data
    for (const product of products) {
      for (const release of product.releases) {
        const build = release.builds.find(b => b.id === buildId);
        if (build) {
          // Return the found build data (already contains enhanced details)
          return build;
        }
      }
    }
    console.warn(`Build details not found for buildId: ${buildId}`);
    return null; // Build not found
  } catch (error) {
    console.error('Error fetching build details:', error);
    return null;
  }
};
