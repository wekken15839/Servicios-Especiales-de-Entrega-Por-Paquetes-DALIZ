import Client, { IClientDocument } from './client.model.js';
import { IClientInput, IClientResponse, IBalanceResponse } from './clients.types.js';
import { getClientBalance as getFiadosBalance } from '../fiados/fiados.service.js';
import { AppError } from '../../shared/errors/app-error.js';

const formatClient = (doc: IClientDocument): IClientResponse => ({
  id: doc._id.toString(),
  name: doc.name,
  phone: doc.phone,
  address: doc.address,
  lat: doc.lat,
  lng: doc.lng,
  balance: doc.balance ?? 0,
});

export const listClients = async (userId: string): Promise<IClientResponse[]> => {
  const docs = await Client.find({ userId }).sort({ createdAt: -1 });
  return docs.map(formatClient);
};

export const getClientById = async (userId: string, id: string): Promise<IClientResponse> => {
  const doc = await Client.findOne({ _id: id, userId });
  if (!doc) {
    throw new AppError('Cliente no encontrado', 404);
  }
  return formatClient(doc);
};

export const createClient = async (userId: string, input: IClientInput): Promise<IClientResponse> => {
  const doc = await Client.create({ ...input, userId });
  return formatClient(doc);
};

export const updateClient = async (userId: string, id: string, input: Partial<IClientInput>): Promise<IClientResponse> => {
  const doc = await Client.findOneAndUpdate(
    { _id: id, userId },
    input,
    { new: true, runValidators: true }
  );
  if (!doc) {
    throw new AppError('Cliente no encontrado', 404);
  }
  return formatClient(doc);
};

export const deleteClient = async (userId: string, id: string): Promise<void> => {
  const doc = await Client.findOneAndDelete({ _id: id, userId });
  if (!doc) {
    throw new AppError('Cliente no encontrado', 404);
  }
};

export const getClientBalance = async (userId: string, clientId: string): Promise<IBalanceResponse> => {
  // Verifies client ownership via the existing getClientById (throws 404 if not found)
  await getClientById(userId, clientId);
  return getFiadosBalance(clientId, userId);
};
