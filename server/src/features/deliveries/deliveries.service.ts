import mongoose from 'mongoose';
import Delivery, { IDeliveryDocument } from './delivery.model.js';
import Client from '../clients/client.model.js';
import { DeliveryStatus, IDeliveryResponse } from './deliveries.types.js';
import { AppError } from '../../shared/errors/app-error.js';

const formatDelivery = (doc: IDeliveryDocument): IDeliveryResponse => ({
  id: doc._id.toString(),
  title: doc.title,
  clientName: doc.clientName,
  clientPhone: doc.clientPhone,
  clientId: doc.clientId?.toString(),
  address: doc.address,
  lat: doc.lat,
  lng: doc.lng,
  status: doc.status as DeliveryStatus,
  type: doc.type,
  notes: doc.notes,
  packagesCount: doc.packagesCount,
  paymentStatus: doc.paymentStatus,
});

export const listDeliveries = async (
  userId: string,
  status?: string
): Promise<IDeliveryResponse[]> => {
  const filter: Record<string, unknown> = { userId };
  if (status) filter.status = status;

  const docs = await Delivery.find(filter).sort({ createdAt: -1 });
  return docs.map(formatDelivery);
};

export const getDeliveryById = async (
  userId: string,
  id: string
): Promise<IDeliveryResponse> => {
  const doc = await Delivery.findOne({ _id: id, userId });
  if (!doc) {
    throw new AppError('Entrega no encontrada', 404);
  }
  return formatDelivery(doc);
};

export const createDelivery = async (
  userId: string,
  data: {
    title: string;
    clientName: string;
    clientPhone?: string;
    clientId?: string;
    address: string;
    lat: number;
    lng: number;
    notes?: string;
  }
): Promise<IDeliveryResponse> => {
  let clientId = data.clientId || null;

  // Waypoints ARE clients — find or create client by name
  if (!clientId && data.clientName) {
    let client = await Client.findOne({
      name: data.clientName,
      userId,
    });

    if (!client) {
      client = await Client.create({
        userId,
        name: data.clientName,
        phone: data.clientPhone,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
      });
    }

    clientId = client._id.toString();
  } else if (clientId) {
    const client = await Client.findOne({ _id: clientId, userId });
    if (!client) {
      throw new AppError('Cliente no encontrado o no pertenece al usuario', 400);
    }
  }

  const doc = await Delivery.create({
    title: data.title,
    clientName: data.clientName,
    clientPhone: data.clientPhone,
    address: data.address,
    lat: data.lat,
    lng: data.lng,
    notes: data.notes,
    userId,
    clientId,
  });
  return formatDelivery(doc);
};

export const deleteDelivery = async (userId: string, id: string): Promise<void> => {
  const doc = await Delivery.findOneAndDelete({ _id: id, userId });
  if (!doc) {
    throw new AppError('Entrega no encontrada', 404);
  }
};

export const updateDeliveryStatusBatch = async (
  userId: string,
  ids: string[],
  status: DeliveryStatus
): Promise<void> => {
  await Delivery.updateMany(
    { _id: { $in: ids }, userId },
    { status },
    { runValidators: true }
  );
};

export const updateDeliveryStatus = async (
  userId: string,
  id: string,
  status: DeliveryStatus
): Promise<IDeliveryResponse> => {
  const validStatuses: DeliveryStatus[] = ['in_transit', 'delivered'];
  if (!validStatuses.includes(status)) {
    throw new AppError(
      `Estado inválido. Valores permitidos: ${validStatuses.join(', ')}`,
      400
    );
  }

  const doc = await Delivery.findOneAndUpdate(
    { _id: id, userId },
    { status },
    { new: true, runValidators: true }
  );
  if (!doc) {
    throw new AppError('Entrega no encontrada', 404);
  }
  return formatDelivery(doc);
};
