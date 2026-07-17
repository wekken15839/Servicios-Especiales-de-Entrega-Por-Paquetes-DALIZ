import mongoose, { Document, Schema } from 'mongoose';
import { DEFAULT_PRICES } from '../../shared/constants.js';

export interface ISettingsDocument extends Document {
  prices: {
    mayor: number;
    detal: number;
  };
}

const settingsSchema = new Schema<ISettingsDocument>(
  {
    prices: {
      mayor: { type: Number, required: true, default: DEFAULT_PRICES.mayor, min: 0 },
      detal: { type: Number, required: true, default: DEFAULT_PRICES.detal, min: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISettingsDocument>('Settings', settingsSchema);
