export type AnalyticsEventType =
  | 'USER_REGISTERED'
  | 'USER_LOGIN'
  | 'WHITEBOARD_CREATED'
  | 'WHITEBOARD_EDITED'
  | 'AI_GENERATION_STARTED'
  | 'AI_GENERATION_SUCCESS'
  | 'AI_GENERATION_FAILED'
  | 'PPT_GENERATED'
  | 'MCQ_GENERATED'
  | 'MINDMAP_GENERATED'
  | 'STUDY_NOTES_GENERATED'
  | 'CONTENT_DOWNLOADED'
  | 'LIMIT_REACHED'
  | 'UPGRADE_VIEWED'
  | 'PAYMENT_STARTED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'PLAN_UPGRADED'
  | 'WEBSITE_VISIT';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  eventType: AnalyticsEventType;
  feature?: string;
  metadata?: Record<string, any>;
  tokensUsed?: number;
  creditsUsed?: number;
  timestamp: string; // ISO string
  sessionId?: string;
}

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | '7d'
  | '30d'
  | '90d'
  | 'this_month'
  | 'prev_month'
  | 'this_year'
  | 'custom';

export interface MetricWithComparison {
  value: number;
  previousValue: number;
  percentageChange: number; // e.g. +12.4 or -5.2
  trend: 'up' | 'down' | 'neutral';
  isPositive: boolean;
}

export interface OverviewMetrics {
  totalUsers: MetricWithComparison;
  activeUsers: MetricWithComparison; // DAU/period active
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalAIGenerations: MetricWithComparison;
  paidUsers: MetricWithComparison;
  freeUsers: MetricWithComparison;
  totalRevenue: MetricWithComparison;
  conversionRate: MetricWithComparison;
  totalTokensUsed: MetricWithComparison;
}

export interface UserGrowthDataPoint {
  date: string;
  formattedDate: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
}

export interface AIUsageMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: number;
  requestsToday: number;
  requestsThisWeek: number;
  requestsThisMonth: number;
  avgGenerationsPerUser: number;
  totalTokensConsumed: number;
  avgTokensPerUser: number;
  timeSeries: { date: string; requests: number; tokens: number; success: number; failed: number }[];
}

export interface FeatureUsageMetric {
  featureId: string;
  featureName: string;
  count: number;
  percentage: number;
  category: string;
}

export interface TokenAnalyticsData {
  totalConsumed: number;
  consumedToday: number;
  consumedThisWeek: number;
  consumedThisMonth: number;
  avgCreditsPerUser: number;
  remainingCreditsTotal: number;
  usersNearLimit: UserLimitAlert[]; // >80%
  usersAtLimit: UserLimitAlert[]; // 100%
}

export interface UserLimitAlert {
  userId: string;
  userName: string;
  userEmail: string;
  tokensUsed: number;
  tokensTotal: number;
  percentageUsed: number;
  plan: string;
  lastActive: string;
}

export interface ConversionFunnelStage {
  id: string;
  name: string;
  count: number;
  conversionFromFirst: number; // % of total visitors
  dropOffRate: number; // % drop from previous stage
}

export interface SystemHealthItem {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'error';
  latencyMs: number;
  lastChecked: string;
  details: string;
}

export interface UserAnalyticsRecord {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  plan: 'free' | 'premium';
  lastActive: string;
  aiGenerationsCount: number;
  pptCount: number;
  mcqCount: number;
  mindmapCount: number;
  studyNotesCount: number;
  tokensUsed: number;
  tokensRemaining: number;
  paymentStatus: 'paid' | 'unpaid' | 'failed' | 'refunded';
  totalRevenueGenerated: number;
  accountStatus: 'active' | 'inactive' | 'suspended';
  preferredLanguage?: string;
  recentEvents: AnalyticsEvent[];
}
