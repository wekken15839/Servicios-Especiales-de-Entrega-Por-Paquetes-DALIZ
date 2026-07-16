import mongoose from 'mongoose';
import Route from '../routes/route.model.js';
import CreditTransaction from '../fiados/credit-transaction.model.js';
import {
  IMetricsSummary,
  IMetricsEvolution,
  IMetricsInsights,
  IRevenueReal,
} from './metrics.types.js';
import { AppError } from '../../shared/errors/app-error.js';
import { PRICE_PER_PACKAGE } from '../../shared/constants.js';
import { getDebtSummary } from '../fiados/fiados.service.js';

const formatLocalDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatCOP = (amount: number): string =>
  '$' + amount.toLocaleString('es-CO') + ' COP';

const baseStats = () => ({
  totalRoutes: { $sum: 1 },
  totalActiveDuration: { $sum: { $ifNull: ['$activeDuration', 0] } },
  totalDeliveriesScheduled: { $sum: { $size: '$waypoints' } },
  totalDeliveriesDelivered: {
    $sum: {
      $size: {
        $filter: {
          input: '$waypoints',
          as: 'wp',
          cond: '$$wp.visited',
        },
      },
    },
  },
  totalPackages: {
    $sum: {
      $reduce: {
        input: '$waypoints',
        initialValue: 0,
        in: {
          $cond: {
            if: '$$this.visited',
            then: { $add: ['$$value', { $ifNull: ['$$this.packagesDelivered', 0] }] },
            else: '$$value',
          },
        },
      },
    },
  },
  totalDistance: { $sum: { $ifNull: ['$totalDistance', 0] } },
  totalTimeToDeliver: {
    $sum: {
      $cond: {
        if: { $and: [{ $ifNull: ['$completedAt', null] }, { $ifNull: ['$startedAt', null] }] },
        then: { $subtract: ['$completedAt', '$startedAt'] },
        else: 0,
      },
    },
  },
  routesWithTime: {
    $sum: {
      $cond: {
        if: { $and: [{ $ifNull: ['$completedAt', null] }, { $ifNull: ['$startedAt', null] }] },
        then: 1,
        else: 0,
      },
    },
  },
});

const buildBasePipeline = (userId: string, from: Date, to: Date) => [
  { $match: { userId: new mongoose.Types.ObjectId(userId) } },
  { $match: { status: 'completed', completedAt: { $gte: from, $lte: to } } },
];

const computeSummaryFromAgg = (result: any, from: Date, to: Date): IMetricsSummary => {
  const r = result[0] || {
    totalRoutes: 0, totalActiveDuration: 0, totalDeliveriesScheduled: 0,
    totalDeliveriesDelivered: 0, totalPackages: 0, totalDistance: 0,
    totalTimeToDeliver: 0, routesWithTime: 0,
  };

  const totalRoutes = r.totalRoutes;
  const totalPackages = r.totalPackages;
  const totalDeliveriesDelivered = r.totalDeliveriesDelivered;
  const totalDeliveriesScheduled = r.totalDeliveriesScheduled;
  const totalActiveMinutes = r.totalActiveDuration;
  const totalActiveHours = totalActiveMinutes / 60;
  const totalDistance = r.totalDistance || 0;
  const totalRevenue = totalPackages * PRICE_PER_PACKAGE;

  const avgPerRoute = totalRoutes > 0 ? Math.round((totalPackages / totalRoutes) * 10) / 10 : 0;
  const avgPerDeliveryPoint = totalDeliveriesDelivered > 0
    ? Math.round((totalPackages / totalDeliveriesDelivered) * 10) / 10
    : 0;
  const packagesPerHour = totalActiveHours > 0
    ? Math.round((totalPackages / totalActiveHours) * 10) / 10
    : 0;
  const avgDurationMin = totalRoutes > 0 ? Math.round(totalActiveMinutes / totalRoutes) : 0;
  const avgDistanceKm = totalRoutes > 0
    ? Math.round((totalDistance / totalRoutes) * 10) / 10
    : 0;
  const completionRate = totalDeliveriesScheduled > 0
    ? Math.round((totalDeliveriesDelivered / totalDeliveriesScheduled) * 1000) / 10
    : 0;

  const totalTimeMs = r.totalTimeToDeliver || 0;
  const routesWithTime = r.routesWithTime || 0;
  const avgTimeToDeliverHours = routesWithTime > 0
    ? Math.round((totalTimeMs / routesWithTime / 3600000) * 10) / 10
    : 0;

  return {
    period: { from: formatLocalDate(from), to: formatLocalDate(to) },
    packages: { totalDelivered: totalPackages, avgPerRoute, avgPerDeliveryPoint, packagesPerHour },
    routes: { totalCompleted: totalRoutes, avgDurationMin, avgDistanceKm, completionRate },
    deliveries: { totalScheduled: totalDeliveriesScheduled, totalDelivered: totalDeliveriesDelivered, avgTimeToDeliverHours },
    revenue: { total: totalRevenue, formatted: formatCOP(totalRevenue) },
  };
};

export const getMetricsSummary = async (userId: string, from: Date, to: Date): Promise<IMetricsSummary> => {
  const result = await Route.aggregate([
    ...buildBasePipeline(userId, from, to),
    { $group: { _id: null, ...baseStats() } },
  ]);

  const summary = computeSummaryFromAgg(result, from, to);

  // Extend with real revenue from debt data
  const debt = await getDebtSummary(userId, from, to);
  const revenueProjected = summary.revenue.total;
  const revenueReal = revenueProjected + debt.totalPayments - debt.totalCredits;

  return {
    ...summary,
    revenue: {
      ...summary.revenue,
      revenueReal,
      revenueProjected,
    },
  };
};

export const getMetricsEvolution = async (
  userId: string,
  from: Date,
  to: Date,
  groupBy: string
): Promise<IMetricsEvolution> => {
  let dateFormat = '%Y-%m-%d';
  if (groupBy === 'week') dateFormat = '%Y-W%V';
  else if (groupBy === 'month') dateFormat = '%Y-%m';
  else groupBy = 'day';

  const result = await Route.aggregate([
    ...buildBasePipeline(userId, from, to),
    {
      $addFields: {
        computedDate: { $dateToString: { format: dateFormat, date: '$completedAt' } },
        visitedWaypoints: {
          $size: { $filter: { input: '$waypoints', as: 'wp', cond: '$$wp.visited' } },
        },
        totalPackages: {
          $reduce: {
            input: '$waypoints',
            initialValue: 0,
            in: {
              $cond: {
                if: '$$this.visited',
                then: { $add: ['$$value', { $ifNull: ['$$this.packagesDelivered', 0] }] },
                else: '$$value',
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: '$computedDate',
        packagesDelivered: { $sum: '$totalPackages' },
        routesCompleted: { $sum: 1 },
        activeHours: {
          $sum: {
            $divide: [{ $ifNull: ['$activeDuration', 0] }, 60],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const labels = result.map((r: any) => r._id);

  // Aggregate CreditTransaction by same period format for revenueReal computation
  const creditResult = await CreditTransaction.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: from, $lte: to } } },
    {
      $group: {
        _id: {
          period: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          type: '$type',
        },
        total: { $sum: '$amount' },
      },
    },
  ]);

  // Build a map of period → { credits, payments }
  const creditByPeriod = new Map<string, { credits: number; payments: number }>();
  for (const row of creditResult) {
    const period = row._id.period;
    if (!creditByPeriod.has(period)) {
      creditByPeriod.set(period, { credits: 0, payments: 0 });
    }
    const entry = creditByPeriod.get(period)!;
    if (row._id.type === 'credit') {
      entry.credits += row.total;
    } else if (row._id.type === 'payment') {
      entry.payments += Math.abs(row.total);
    }
  }

  const revenue: number[] = [];
  const revenueRealArr: number[] = [];
  const revenueProjectedArr: number[] = [];

  for (const r of result) {
    const projected = r.packagesDelivered * PRICE_PER_PACKAGE;
    revenue.push(projected);
    revenueProjectedArr.push(projected);

    const periodCredit = creditByPeriod.get(r._id);
    const payments = periodCredit?.payments ?? 0;
    const credits = periodCredit?.credits ?? 0;
    revenueRealArr.push(projected + payments - credits);
  }

  return {
    period: { from: formatLocalDate(from), to: formatLocalDate(to) },
    groupBy,
    labels,
    datasets: {
      packagesDelivered: result.map((r: any) => r.packagesDelivered),
      routesCompleted: result.map((r: any) => r.routesCompleted),
      activeHours: result.map((r: any) => Math.round(r.activeHours * 10) / 10),
      revenue,
      revenueReal: revenueRealArr,
      revenueProjected: revenueProjectedArr,
    },
  };
};

export const getMetricsInsights = async (userId: string, from: Date, to: Date): Promise<IMetricsInsights> => {
  const summaryResult = await Route.aggregate([
    ...buildBasePipeline(userId, from, to),
    { $group: { _id: null, ...baseStats() } },
  ]);

  const summary = computeSummaryFromAgg(summaryResult, from, to);

  const totalDays = Math.max(
    1,
    Math.ceil((to.getTime() - from.getTime()) / 86400000)
  );

  const bestDayResult = await Route.aggregate([
    ...buildBasePipeline(userId, from, to),
    {
      $addFields: {
        completedDate: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
        totalPackages: {
          $reduce: {
            input: '$waypoints',
            initialValue: 0,
            in: {
              $cond: {
                if: '$$this.visited',
                then: { $add: ['$$value', { $ifNull: ['$$this.packagesDelivered', 0] }] },
                else: '$$value',
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: '$completedDate',
        packagesDelivered: { $sum: '$totalPackages' },
      },
    },
    { $sort: { packagesDelivered: -1 } },
    { $limit: 1 },
  ]);

  const bestDay = bestDayResult.length > 0 ? bestDayResult[0]._id : null;
  const bestDayPackages = bestDayResult.length > 0 ? bestDayResult[0].packagesDelivered : 0;

  const totalActiveHours = Math.round(summary.routes.totalCompleted > 0
    ? (summaryResult[0]?.totalActiveDuration || 0) / 60 * 10
    : 0) / 10;

  const totalRevenue = summary.revenue.total;

  // Get collection rate from debt data
  const debt = await getDebtSummary(userId, from, to);

  return {
    period: { from: formatLocalDate(from), to: formatLocalDate(to) },
    bestDay,
    bestDayPackages,
    avgPackagesPerDay: Math.round((summary.packages.totalDelivered / totalDays) * 10) / 10,
    avgRoutesPerDay: Math.round((summary.routes.totalCompleted / totalDays) * 10) / 10,
    completionRateAvg: summary.routes.completionRate,
    totalActiveHours,
    totalRevenue,
    totalRevenueFormatted: formatCOP(totalRevenue),
    revenuePerHour: totalActiveHours > 0
      ? Math.round((totalRevenue / totalActiveHours) * 10) / 10
      : 0,
    collectionRate: debt.collectionRate,
  };
};

export const getRealRevenue = async (
  userId: string,
  from: Date,
  to: Date,
): Promise<IRevenueReal> => {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  // Phase 1: aggregate completed Route deliveries
  const routeResult = await Route.aggregate([
    { $match: { userId: objectUserId, status: 'completed', completedAt: { $gte: from, $lte: to } } },
    { $unwind: '$waypoints' },
    { $match: { 'waypoints.visited': true } },
    {
      $group: {
        _id: null,
        totalDeliveries: { $sum: 1 },
        deliveryIds: { $addToSet: '$waypoints.deliveryId' },
      },
    },
  ]);

  const totalDeliveries = routeResult.length > 0 ? routeResult[0].totalDeliveries : 0;
  const deliveryIds: mongoose.Types.ObjectId[] = routeResult.length > 0
    ? routeResult[0].deliveryIds
    : [];

  // Phase 2a: aggregate CreditTransaction by type in period
  const creditResult = await CreditTransaction.aggregate([
    { $match: { userId: objectUserId, createdAt: { $gte: from, $lte: to } } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
      },
    },
  ]);

  let totalCredits = 0;
  let totalPayments = 0;

  for (const row of creditResult) {
    if (row._id === 'credit') {
      totalCredits = row.total;
    } else if (row._id === 'payment') {
      totalPayments = Math.abs(row.total);
    }
  }

  // Phase 2b: count distinct credit deliveryIds that are in deliveryIds
  let pendingDeliveries = 0;
  if (deliveryIds.length > 0) {
    const creditDeliveryIds = await CreditTransaction.distinct('deliveryId', {
      userId: objectUserId,
      createdAt: { $gte: from, $lte: to },
      type: 'credit',
      deliveryId: { $in: deliveryIds },
    });
    pendingDeliveries = creditDeliveryIds.length;
  }

  const paidDeliveries = totalDeliveries - pendingDeliveries;
  const revenueProjected = totalDeliveries * PRICE_PER_PACKAGE;
  const revenueReal = revenueProjected + totalPayments - totalCredits;

  return {
    revenueReal,
    revenueProjected,
    paidDeliveries,
    pendingDeliveries,
    totalDeliveries,
    periodStart: from.toISOString(),
    periodEnd: to.toISOString(),
  };
};
