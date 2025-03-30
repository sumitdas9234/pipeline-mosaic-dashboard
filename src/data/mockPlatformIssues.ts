import { faker } from '@faker-js/faker';
import { FailureType } from '@/types';

export interface PlatformIssue {
  id: string;
  title: string;
  severity: FailureType; // Updated to use FailureType
  status: FailureType; // Updated to use FailureType
  jiraTicket: string;
  affectedPipelines: number;
  firstOccurrence: string;
  lastOccurrence: string;
  product: string;
  assignee: string | null;
}

export interface TrendDataPoint {
  date: string;
  count: number;
  active: number;
  resolved: number;
}

export interface PlatformMetrics {
  priorityCount: number;
  p0Count: number;
  p1Count: number;
  p2Count: number;
  openRequests: number;
  infraErrors: number;
}

// Generate mock platform issues
const generateMockIssues = (count: number): PlatformIssue[] => {
  const issues: PlatformIssue[] = [];
  const severities: PlatformIssue['severity'][] = ['Critical', 'High', 'Medium', 'Low'];
  const statuses: PlatformIssue['status'][] = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const products = ['Product A', 'Product B', 'Product C'];

  for (let i = 0; i < count; i++) {
    const severity = faker.helpers.arrayElement(severities);
    const status = faker.helpers.arrayElement(statuses);
    const firstOccurrence = faker.date.past({ years: 1 }).toISOString().split('T')[0];
    const lastOccurrence = faker.date.between({ 
      from: firstOccurrence, 
      to: new Date() 
    }).toISOString().split('T')[0];

    issues.push({
      id: `PI-${1000 + i}`,
      title: faker.lorem.sentence({ min: 3, max: 8 }).replace('.', ''),
      severity,
      status,
      jiraTicket: `PLAT-${faker.number.int({ min: 1000, max: 9999 })}`,
      affectedPipelines: faker.number.int({ min: 1, max: 20 }),
      firstOccurrence,
      lastOccurrence,
      product: faker.helpers.arrayElement(products),
      assignee: faker.datatype.boolean() 
        ? faker.person.fullName() 
        : null,
    });
  }

  return issues;
};

// Generate trend data for platform issues over time
const generateTrendData = (days: number): TrendDataPoint[] => {
  const data: TrendDataPoint[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Generate some realistic trend data with weekends having fewer issues
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Base values that will be adjusted
    let baseValue = faker.number.int({ min: 5, max: 15 });
    
    // Reduce values for weekends
    if (isWeekend) {
      baseValue = Math.max(1, Math.floor(baseValue * 0.6));
    }
    
    // Add some overall trend (slight increase over time)
    const trendFactor = 1 + (i / days * 0.5); // 50% increase over the period
    baseValue = Math.floor(baseValue * trendFactor);
    
    // Add some noise
    const noise = faker.number.int({ min: -2, max: 2 });
    const count = Math.max(1, baseValue + noise);
    
    // Calculate active and resolved (subset of count)
    const active = Math.floor(count * faker.number.float({ min: 0.4, max: 0.8 }));
    const resolved = count - active;
    
    data.push({
      date: date.toISOString().split('T')[0],
      count,
      active,
      resolved
    });
  }
  
  return data;
};

// Create mock data
const MOCK_PLATFORM_ISSUES = generateMockIssues(50);
const MOCK_TREND_DATA = {
  '7d': generateTrendData(7),
  '30d': generateTrendData(30),
  '90d': generateTrendData(90),
};

// Mock API function to fetch platform issues
export const fetchPlatformIssues = async (filters: any): Promise<PlatformIssue[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, faker.number.int({ min: 300, max: 800 })));
  
  let filteredIssues = [...MOCK_PLATFORM_ISSUES];
  
  if (filters.product) {
    filteredIssues = filteredIssues.filter(issue => issue.product === filters.product);
  }
  
  if (filters.severity) {
    filteredIssues = filteredIssues.filter(issue => issue.severity === filters.severity);
  }

  return filteredIssues;
};

// Mock API function to fetch trend data
export const fetchPlatformIssuesTrend = async (timeRange: string): Promise<TrendDataPoint[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, faker.number.int({ min: 200, max: 600 })));
  
  // Return trend data for the selected time range
  if (timeRange === '7d') return MOCK_TREND_DATA['7d'];
  if (timeRange === '90d') return MOCK_TREND_DATA['90d'];
  
  // Default to 30 days
  return MOCK_TREND_DATA['30d'];
};

// New function to fetch platform metrics
export const fetchPlatformMetrics = async (timeRange: string): Promise<PlatformMetrics> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, faker.number.int({ min: 300, max: 800 })));
  
  // Generate mock metrics data
  const p0Count = faker.number.int({ min: 3, max: 12 });
  const p1Count = faker.number.int({ min: 8, max: 25 });
  const p2Count = faker.number.int({ min: 15, max: 40 });
  
  return {
    priorityCount: p0Count + p1Count + p2Count,
    p0Count,
    p1Count,
    p2Count,
    openRequests: faker.number.int({ min: 20, max: 60 }),
    infraErrors: faker.number.int({ min: 5, max: 18 })
  };
};
