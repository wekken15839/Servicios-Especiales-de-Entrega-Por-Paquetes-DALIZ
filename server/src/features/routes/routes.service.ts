import Route, { IRouteDocument } from './route.model.js';
import Delivery from '../deliveries/delivery.model.js';
import Client from '../clients/client.model.js';
import { updateDeliveryStatusBatch } from '../deliveries/deliveries.service.js';
import { RouteStatus, IRouteResponse, IRouteAnalysis } from './routes.types.js';
import { createCreditTransaction } from '../fiados/fiados.service.js';
import { PRICE_PER_PACKAGE } from '../../shared/constants.js';
import { AppError } from '../../shared/errors/app-error.js';

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function haversine(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearestNeighbor(
  points: { deliveryId: string; lat: number; lng: number }[]
): { deliveryId: string; lat: number; lng: number }[] {
  if (points.length <= 1) return points;

  const unvisited = [...points];
  const ordered: typeof points = [];
  let current = unvisited.shift()!;
  ordered.push(current);

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < unvisited.length; i++) {
      const dist = haversine(current.lat, current.lng, unvisited[i].lat, unvisited[i].lng);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }
    current = unvisited.splice(nearestIdx, 1)[0];
    ordered.push(current);
  }

  return ordered;
}

function calculateEstimatedTime(points: { lat: number; lng: number }[]): number {
  if (points.length < 2) return 0;
  let totalKm = 0;
  for (let i = 1; i < points.length; i++) {
    totalKm += haversine(points[i - 1].lat, points[i - 1].lng, points[i].lat, points[i].lng);
  }
  const avgSpeedKmh = 30;
  return Math.round((totalKm / avgSpeedKmh) * 60);
}

const formatRoute = (doc: IRouteDocument): IRouteResponse => ({
  id: doc._id.toString(),
  name: doc.name,
  status: doc.status as RouteStatus,
  waypoints: doc.waypoints.map((wp) => ({
    lat: wp.lat,
    lng: wp.lng,
    order: wp.order,
    deliveryId: wp.deliveryId.toString(),
    visited: wp.visited,
    visitedAt: wp.visitedAt?.toISOString(),
    packagesDelivered: wp.packagesDelivered,
    notes: wp.notes,
  })),
  totalDistance: doc.totalDistance,
  estimatedTime: doc.estimatedTime,
  startedAt: doc.startedAt?.toISOString(),
  completedAt: doc.completedAt?.toISOString(),
  activeDuration: doc.activeDuration,
  notes: doc.notes,
});

export const listRoutes = async (userId: string, status?: string): Promise<IRouteResponse[]> => {
  const filter: Record<string, unknown> = { userId };
  if (status) filter.status = status;

  const docs = await Route.find(filter).sort({ createdAt: -1 });
  return docs.map(formatRoute);
};

export const getRouteById = async (userId: string, id: string): Promise<IRouteResponse> => {
  const doc = await Route.findOne({ _id: id, userId });
  if (!doc) {
    throw new AppError('Ruta no encontrada', 404);
  }
  return formatRoute(doc);
};

export const createRoute = async (
  userId: string,
  name: string,
  deliveryIds: string[],
  optimize?: boolean
): Promise<IRouteResponse> => {
  if (!deliveryIds || deliveryIds.length === 0) {
    throw new AppError('Debe proporcionar al menos un deliveryId', 400);
  }

  const deliveries = await Delivery.find({ _id: { $in: deliveryIds }, userId });
  if (deliveries.length !== deliveryIds.length) {
    throw new AppError('Una o más entregas no existen', 400);
  }

  let points = deliveryIds.map((deliveryId) => {
    const delivery = deliveries.find((d) => d._id.toString() === deliveryId)!;
    return { deliveryId, lat: delivery.lat, lng: delivery.lng };
  });

  if (optimize) {
    points = nearestNeighbor(points);
  }

  const waypoints = points.map((p, index) => {
    const delivery = deliveries.find((d) => d._id.toString() === p.deliveryId)!;
    return {
      deliveryId: delivery._id,
      lat: delivery.lat,
      lng: delivery.lng,
      order: index,
    };
  });

  const estimatedTime = calculateEstimatedTime(points);

  const doc = await Route.create({ userId, name, waypoints, estimatedTime, status: 'draft' });
  return formatRoute(doc);
};

export const startRoute = async (userId: string, id: string): Promise<IRouteResponse> => {
  const doc = await Route.findOne({ _id: id, userId });
  if (!doc) {
    throw new AppError('Ruta no encontrada', 404);
  }
  if (doc.status !== 'draft' && doc.status !== 'paused') {
    throw new AppError('Solo se puede iniciar una ruta en estado draft o pausada', 400);
  }

  const now = new Date();
  doc.status = 'in_progress';
  doc.lastResumeAt = now;
  if (!doc.startedAt) {
    doc.startedAt = now;
  }
  await doc.save();

  const deliveryIds = doc.waypoints.map((wp) => wp.deliveryId.toString());
  await updateDeliveryStatusBatch(userId, deliveryIds, 'in_transit');

  return formatRoute(doc);
};

export const pauseRoute = async (userId: string, id: string): Promise<IRouteResponse> => {
  const doc = await Route.findOne({ _id: id, userId });
  if (!doc) {
    throw new AppError('Ruta no encontrada', 404);
  }
  if (doc.status !== 'in_progress') {
    throw new AppError('Solo se puede pausar una ruta en progreso', 400);
  }

  const now = new Date();
  const elapsedMin = doc.lastResumeAt
    ? (now.getTime() - doc.lastResumeAt.getTime()) / 60000
    : 0;
  doc.activeDuration = (doc.activeDuration || 0) + elapsedMin;
  doc.status = 'paused';
  await doc.save();

  return formatRoute(doc);
};

export const resumeRoute = async (userId: string, id: string): Promise<IRouteResponse> => {
  const doc = await Route.findOne({ _id: id, userId });
  if (!doc) {
    throw new AppError('Ruta no encontrada', 404);
  }
  if (doc.status !== 'paused') {
    throw new AppError('Solo se puede reanudar una ruta pausada', 400);
  }

  doc.status = 'in_progress';
  doc.lastResumeAt = new Date();
  await doc.save();

  return formatRoute(doc);
};

export const markWaypointVisited = async (
  userId: string,
  routeId: string,
  deliveryId: string,
  packagesDelivered?: number,
  packagesCount?: number,
  paymentStatus?: string,
  creditAmount?: number,
  partialPayment?: number,
  abonoAmount?: number,
  abonoDescription?: string
): Promise<IRouteResponse> => {
  const doc = await Route.findOne({ _id: routeId, userId });
  if (!doc) {
    throw new AppError('Ruta no encontrada', 404);
  }
  if (doc.status !== 'in_progress') {
    throw new AppError('Solo se puede marcar visitas en una ruta en progreso', 400);
  }

  const waypoint = doc.waypoints.find(
    (wp) => wp.deliveryId.toString() === deliveryId
  );
  if (!waypoint) {
    throw new AppError('La entrega no pertenece a esta ruta', 400);
  }
  if (waypoint.visited) {
    throw new AppError('Esta entrega ya fue marcada como visitada', 400);
  }

  waypoint.visited = true;
  waypoint.visitedAt = new Date();
  waypoint.packagesDelivered = packagesDelivered;
  await doc.save();

  const finalPackagesCount = packagesCount ?? 1;
  const finalPaymentStatus = paymentStatus ?? 'paid';

  const updatedDelivery = await Delivery.findOneAndUpdate(
    { _id: deliveryId, userId },
    { status: 'delivered', packagesCount: finalPackagesCount, paymentStatus: finalPaymentStatus },
    { new: true, runValidators: true }
  );

  if (!updatedDelivery) {
    throw new AppError('Entrega no encontrada', 404);
  }

  // Credit transaction for unpaid packages
  if (finalPaymentStatus === 'pending') {
    const clientId = updatedDelivery.clientId?.toString();
    // Use creditAmount if provided (already net of partial payment), else full amount
    const amount = creditAmount ?? (finalPackagesCount * PRICE_PER_PACKAGE);

    if (clientId && amount > 0) {
      await createCreditTransaction(clientId, userId, amount, deliveryId);
    } else if (!clientId) {
      console.warn(`[Fiados] Entrega ${deliveryId} pendiente sin cliente.`);
    }
  }

  // Abono to existing debt
  if (abonoAmount && abonoAmount > 0) {
    const clientId = updatedDelivery.clientId?.toString();

    if (clientId) {
      const client = await Client.findById(clientId);
      const currentBalance = client?.balance || 0;
      const cappedAmount = Math.min(abonoAmount, currentBalance);

      if (cappedAmount > 0) {
        const { registerPayment } = await import('../fiados/fiados.service.js');
        await registerPayment(
          clientId,
          userId,
          cappedAmount,
          abonoDescription || 'Abono en entrega'
        );
      }
    } else {
      console.warn(
        `[Fiados] Abono de $${abonoAmount} ignorado — delivery sin cliente.`
      );
    }
  }

  return formatRoute(doc);
};

export const completeRoute = async (userId: string, id: string): Promise<{
  route: IRouteResponse;
  analysis: IRouteAnalysis;
}> => {
  const doc = await Route.findOne({ _id: id, userId });
  if (!doc) {
    throw new AppError('Ruta no encontrada', 404);
  }
  if (doc.status !== 'in_progress' && doc.status !== 'paused') {
    throw new AppError('Solo se puede completar una ruta en progreso o pausada', 400);
  }

  const now = new Date();
  const elapsedMin = doc.lastResumeAt
    ? (now.getTime() - doc.lastResumeAt.getTime()) / 60000
    : 0;
  doc.activeDuration = (doc.activeDuration || 0) + elapsedMin;
  doc.status = 'completed';
  doc.completedAt = now;
  await doc.save();

  const totalDeliveries = doc.waypoints.length;
  const delivered = doc.waypoints.filter((wp) => wp.visited).length;
  const notDelivered = totalDeliveries - delivered;
  const activeTimeHours = Math.round(((doc.activeDuration || 0) / 60) * 100) / 100;
  const completionRate = totalDeliveries > 0
    ? Math.round((delivered / totalDeliveries) * 1000) / 10
    : 0;

  const route = formatRoute(doc);

  return {
    route,
    analysis: {
      totalDeliveries,
      delivered,
      notDelivered,
      activeTimeHours,
      completionRate,
    },
  };
};

export const getRouteAnalysis = async (userId: string, id: string): Promise<IRouteAnalysis> => {
  const doc = await Route.findOne({ _id: id, userId });
  if (!doc) {
    throw new AppError('Ruta no encontrada', 404);
  }
  if (doc.status !== 'completed') {
    throw new AppError('El análisis solo está disponible para rutas completadas', 400);
  }

  const totalDeliveries = doc.waypoints.length;
  const delivered = doc.waypoints.filter((wp) => wp.visited).length;
  const notDelivered = totalDeliveries - delivered;
  const activeTimeHours = Math.round(((doc.activeDuration || 0) / 60) * 100) / 100;
  const completionRate = totalDeliveries > 0
    ? Math.round((delivered / totalDeliveries) * 1000) / 10
    : 0;

  return {
    totalDeliveries,
    delivered,
    notDelivered,
    activeTimeHours,
    completionRate,
  };
};

export const updateRouteNotes = async (userId: string, id: string, notes: string): Promise<IRouteResponse> => {
  const doc = await Route.findOne({ _id: id, userId });
  if (!doc) {
    throw new AppError('Ruta no encontrada', 404);
  }

  doc.notes = notes;
  await doc.save();

  return formatRoute(doc);
};

export const updateWaypointNotes = async (
  userId: string,
  routeId: string,
  deliveryId: string,
  notes: string,
): Promise<IRouteResponse> => {
  const doc = await Route.findOne({ _id: routeId, userId });
  if (!doc) {
    throw new AppError('Ruta no encontrada', 404);
  }

  const waypoint = doc.waypoints.find(
    (wp) => wp.deliveryId.toString() === deliveryId,
  );
  if (!waypoint) {
    throw new AppError('La entrega no pertenece a esta ruta', 400);
  }

  waypoint.notes = notes;
  await doc.save();

  return formatRoute(doc);
};
