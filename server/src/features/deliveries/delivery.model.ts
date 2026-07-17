import mongoose, { Document, Schema } from 'mongoose';
import { DeliveryStatus, DeliveryType } from './deliveries.types.js';

export interface IDeliveryDocument extends Document {
  userId: mongoose.Types.ObjectId;
  clientId?: mongoose.Types.ObjectId | null;
  title: string;
  clientName: string;
  clientPhone?: string;
  address: string;
  lat: number;
  lng: number;
  status: DeliveryStatus;
  type: DeliveryType;
  notes?: string;
  packagesCount: number;
  paymentStatus: 'paid' | 'pending';
}

const deliverySchema = new Schema<IDeliveryDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', default: null, index: true },
    title: { type: String, required: true },
    clientName: { type: String, required: true },
    clientPhone: { type: String },
    address: { type: String, required: true },
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
    status: {
      type: String,
      enum: ['pending', 'in_transit', 'delivered'],
      default: 'pending',
    },
    type: {
      type: String,
      enum: ['mayor', 'detal'],
      default: 'detal',
    },
    notes: { type: String },
    packagesCount: { type: Number, default: 1 },
    paymentStatus: { type: String, enum: ['paid', 'pending'], default: 'paid' },
  },
  { timestamps: true }
);

deliverySchema.index({ lat: 1, lng: 1 });

export default mongoose.model<IDeliveryDocument>('Delivery', deliverySchema);
