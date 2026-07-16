// ============================================================
// Metrics types — shared between server and client
// ============================================================

export interface IMetricsSummaryPackages {
  totalDelivered: number;
  avgPerRoute: number;
  avgPerDeliveryPoint: number;
  packagesPerHour: number;
}

export interface IMetricsSummaryRoutes {
  totalCompleted: number;
  avgDurationMin: number;
  avgDistanceKm: number;
  completionRate: number;
}

export interface IMetricsSummaryDeliveries {
  totalScheduled: number;
  totalDelivered: number;
  avgTimeToDeliverHours: number;
}

export interface IDebtSummary {
  totalCredits: number;
  totalPayments: number;
  netDebt: number;
  pendingCount: number;
  collectionRate: number;
  periodStart: string;
  periodEnd: string;
}

export interface IDebtTrendPeriod {
  label: string;
  totalCredits: number;
  totalPayments: number;
  netDebt: number;
}

export interface IDebtTrend {
  periods: IDebtTrendPeriod[];
  collectionRate: number;
}

export interface IRevenueReal {
  revenueReal: number;
  revenueProjected: number;
  paidDeliveries: number;
  pendingDeliveries: number;
  totalDeliveries: number;
  periodStart: string;
  periodEnd: string;
}

export interface IMetricsSummaryRevenue {
  total: number;
  formatted: string;
  revenueReal?: number;
  revenueProjected?: number;
}

export interface IMetricsSummary {
  period: { from: string; to: string };
  packages: IMetricsSummaryPackages;
  routes: IMetricsSummaryRoutes;
  deliveries: IMetricsSummaryDeliveries;
  revenue: IMetricsSummaryRevenue;
}

export interface IEvolutionDatasets {
  packagesDelivered: number[];
  routesCompleted: number[];
  activeHours: number[];
  revenue: number[];
  revenueReal?: number[];
  revenueProjected?: number[];
}

export interface IMetricsEvolution {
  period: { from: string; to: string };
  groupBy: string;
  labels: string[];
  datasets: IEvolutionDatasets;
}

export interface IMetricsInsights {
  period: { from: string; to: string };
  bestDay: string | null;
  bestDayPackages: number;
  avgPackagesPerDay: number;
  avgRoutesPerDay: number;
  completionRateAvg: number;
  totalActiveHours: number;
  totalRevenue: number;
  totalRevenueFormatted: string;
  revenuePerHour: number;
  collectionRate?: number;
}
