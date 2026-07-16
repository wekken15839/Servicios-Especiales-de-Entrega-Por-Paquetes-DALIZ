import mongoose, { Document, Schema } from 'mongoose';

export interface IClientDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  phone?: string;
  address: string;
  lat: number;
  lng: number;
  balance: number;
}

const clientSchema = new Schema<IClientDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String, required: true },
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

clientSchema.index({ userId: 1 });

export default mongoose.model<IClientDocument>('Client', clientSchema);
