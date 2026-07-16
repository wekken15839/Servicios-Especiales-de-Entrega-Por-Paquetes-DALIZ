import mongoose from 'mongoose';
import CreditTransaction, { ICreditTransactionDocument } from './credit-transaction.model.js';
import Client from '../clients/client.model.js';
import { ICreditTransactionResponse, IBalanceResponse } from './fiados.types.js';
import { AppError } from '../../shared/errors/app-error.js';
import type { IDebtSummary, IDebtTrend, IDebtTrendPeriod } from '../metrics/metrics.types.js';

const formatTransaction = (doc: ICreditTransactionDocument): ICreditTransactionResponse => ({
  id: doc._id.toString(),
  clientId: doc.clientId.toString(),
  amount: doc.amount,
  type: doc.type,
  description: doc.description,
  deliveryId: doc.deliveryId?.toString(),
  createdAt: doc.createdAt.toISOString(),
});

export const createCreditTransaction = async (
  clientId: string,
  userId: string,
  amount: number,
  deliveryId?: string
): Promise<ICreditTransactionResponse> => {
  const doc = await CreditTransaction.create({
    userId,
    clientId,
    amount,
    type: 'credit',
    deliveryId: deliveryId || null,
  });

  await Client.findByIdAndUpdate(clientId, { $inc: { balance: amount } });

  return formatTransaction(doc);
};

export const registerPayment = async (
  clientId: string,
  userId: string,
  amount: number,
  description?: string
): Promise<ICreditTransactionResponse> => {
  // Verify client exists and belongs to user
  const client = await Client.findOne({ _id: clientId, userId });
  if (!client) {
    throw new AppError('Cliente no encontrado o no pertenece al usuario', 400);
  }

  // Cap payment to current balance — never go negative
  const cappedAmount = Math.min(amount, client.balance || 0);
  if (cappedAmount <= 0) {
    throw new AppError('No hay deuda pendiente para abonar', 400);
  }

  const negativeAmount = -cappedAmount;

  const doc = await CreditTransaction.create({
    userId,
    clientId,
    amount: negativeAmount,
    type: 'payment',
    description,
  });

  await Client.findByIdAndUpdate(clientId, { $inc: { balance: negativeAmount } });

  return formatTransaction(doc);
};

export const getClientBalance = async (
  clientId: string,
  userId: string
): Promise<IBalanceResponse> => {
  // Verify client exists and belongs to user
  const client = await Client.findOne({ _id: clientId, userId });
  if (!client) {
    throw new AppError('Cliente no encontrado o no pertenece al usuario', 400);
  }

  const [aggregateResult] = await CreditTransaction.aggregate([
    { $match: { clientId: new mongoose.Types.ObjectId(clientId) } },
    { $group: { _id: null, balance: { $sum: '$amount' } } },
  ]);

  const balance = aggregateResult?.balance || 0;

  const transactions = await CreditTransaction.find({ clientId })
    .sort({ createdAt: -1 });

  return {
    balance,
    transactions: transactions.map(formatTransaction),
  };
};

export const getDebtSummary = async (
  userId: string,
  from: Date,
  to: Date,
): Promise<IDebtSummary> => {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  const result = await CreditTransaction.aggregate([
    { $match: { userId: objectUserId, createdAt: { $gte: from, $lte: to } } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  let totalCredits = 0;
  let totalPayments = 0;
  let creditCount = 0;

  for (const row of result) {
    if (row._id === 'credit') {
      totalCredits = row.total;
      creditCount = row.count;
    } else if (row._id === 'payment') {
      totalPayments = Math.abs(row.total);
    }
  }

  const netDebt = totalCredits - totalPayments;
  const collectionRate = totalCredits > 0
    ? Math.round((totalPayments / totalCredits) * 100) / 100
    : 0;

  return {
    totalCredits,
    totalPayments,
    netDebt,
    pendingCount: creditCount,
    collectionRate,
    periodStart: from.toISOString(),
    periodEnd: to.toISOString(),
  };
};

export const getDebtTrend = async (
  userId: string,
  from: Date,
  to: Date,
): Promise<IDebtTrend> => {
  const objectUserId = new mongoose.Types.ObjectId(userId);
  const diffMs = to.getTime() - from.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const useMonthly = diffDays > 31;
  const dateFormat = useMonthly ? '%Y-%m' : '%Y-W%V';

  const result = await CreditTransaction.aggregate([
    { $match: { userId: objectUserId, createdAt: { $gte: from, $lte: to } } },
    {
      $group: {
        _id: {
          period: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          type: '$type',
        },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.period': 1 } },
  ]);

  // Pivot: group by period label, accumulating credits and payments
  const periodMap = new Map<string, { totalCredits: number; totalPayments: number }>();

  for (const row of result) {
    const period = row._id.period;
    if (!periodMap.has(period)) {
      periodMap.set(period, { totalCredits: 0, totalPayments: 0 });
    }
    const entry = periodMap.get(period)!;
    if (row._id.type === 'credit') {
      entry.totalCredits += row.total;
    } else if (row._id.type === 'payment') {
      entry.totalPayments += Math.abs(row.total);
    }
  }

  const periods: IDebtTrendPeriod[] = [];
  let aggTotalCredits = 0;
  let aggTotalPayments = 0;

  for (const [label, data] of periodMap) {
    const netDebt = data.totalCredits - data.totalPayments;
    periods.push({
      label,
      totalCredits: data.totalCredits,
      totalPayments: data.totalPayments,
      netDebt,
    });
    aggTotalCredits += data.totalCredits;
    aggTotalPayments += data.totalPayments;
  }

  const collectionRate = aggTotalCredits > 0
    ? Math.round((aggTotalPayments / aggTotalCredits) * 100) / 100
    : 0;

  return { periods, collectionRate };
};
