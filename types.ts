export enum TestStatus {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  duration?: number;
  logs: string[];
}

export interface Defect {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  screenshotUrl?: string; // Placeholder URL
}

export interface TestRunReport {
  id: string;
  url: string;
  timestamp: Date;
  score: number;
  passedCount: number;
  failedCount: number;
  duration: number; // in seconds
  cases: TestCase[];
  defects: Defect[];
}

export interface AnalyticsData {
  name: string;
  pass: number;
  fail: number;
}