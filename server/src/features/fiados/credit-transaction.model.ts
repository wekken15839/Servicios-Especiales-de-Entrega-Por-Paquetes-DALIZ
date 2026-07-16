import mongoose, { Document, Schema } from 'mongoose';

export interface ICreditTransactionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  amount: number;
  type: 'credit' | 'payment';
  description?: string;
  deliveryId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const creditTransactionSchema = new Schema<ICreditTransactionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'payment'], required: true },
    description: { type: String },
    deliveryId: { type: Schema.Types.ObjectId, ref: 'Delivery', default: null },
  },
  { timestamps: true }
);

creditTransactionSchema.index({ userId: 1, createdAt: 1, type: 1 });
creditTransactionSchema.index({ userId: 1, deliveryId: 1 });

export default mongoose.model<ICreditTransactionDocument>('CreditTransaction', creditTransactionSchema);
