import mongoose, { Document, Schema } from 'mongoose';
import { RouteStatus } from './routes.types.js';

export interface IRouteWaypointDoc {
  deliveryId: mongoose.Types.ObjectId;
  lat: number;
  lng: number;
  order: number;
  visited: boolean;
  visitedAt?: Date;
  packagesDelivered?: number;
  revenue?: number;
  notes?: string;
}

export interface IRouteDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  status: RouteStatus;
  waypoints: IRouteWaypointDoc[];
  totalDistance?: number;
  estimatedTime?: number;
  startedAt?: Date;
  completedAt?: Date;
  lastResumeAt?: Date;
  activeDuration?: number;
  notes?: string;
}

const routeWaypointSchema = new Schema<IRouteWaypointDoc>(
  {
    deliveryId: {
      type: Schema.Types.ObjectId,
      ref: 'Delivery',
      required: true,
    },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    order: { type: Number, required: true },
    visited: { type: Boolean, default: false },
    visitedAt: { type: Date },
    packagesDelivered: { type: Number },
    revenue: { type: Number },
    notes: { type: String },
  },
  { _id: false }
);

const routeSchema = new Schema<IRouteDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'paused', 'completed'],
      default: 'draft',
    },
    waypoints: { type: [routeWaypointSchema], default: [] },
    totalDistance: { type: Number },
    estimatedTime: { type: Number },
    startedAt: { type: Date },
    completedAt: { type: Date },
    lastResumeAt: { type: Date },
    activeDuration: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IRouteDocument>('Route', routeSchema);
