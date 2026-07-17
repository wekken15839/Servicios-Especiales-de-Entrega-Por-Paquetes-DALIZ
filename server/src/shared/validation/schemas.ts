import { z } from 'zod';

export const signUpSchema = z.object({
  username: z.string().min(1, 'El username es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
  name: z.string().min(1, 'El nombre es obligatorio'),
});

export const signInSchema = z.object({
  username: z.string().min(1, 'El username es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const createClientSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  phone: z.string().optional(),
  address: z.string().min(1, 'La dirección es obligatoria'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const updateClientSchema = createClientSchema.partial();

export const createDeliverySchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  clientName: z.string().min(1, 'El nombre del cliente es obligatorio'),
  clientPhone: z.string().optional(),
  clientId: z.string().optional(),
  address: z.string().min(1, 'La dirección es obligatoria'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  notes: z.string().optional(),
  type: z.enum(['mayor', 'detal']).default('detal'),
});

export const createRouteSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  deliveryIds: z.array(z.string()).min(1, 'Debe proporcionar al menos un deliveryId'),
  optimize: z.boolean().optional(),
});

export const visitWaypointSchema = z.object({
  packagesDelivered: z.number().int().min(0).optional(),
  packagesCount: z.number().int().positive().optional(),
  paymentStatus: z.enum(['paid', 'pending']).optional(),
  creditAmount: z.number().int().min(0).optional(),
  partialPayment: z.number().int().min(0).optional(),
  abonoAmount: z.number().int().min(0).optional(),
  abonoDescription: z.string().optional(),
});

export const updateRouteNotesSchema = z.object({
  notes: z.string(),
});

export const updateWaypointNotesSchema = z.object({
  notes: z.string(),
});

export const paymentSchema = z.object({
  clientId: z.string().min(1, 'El clientId es obligatorio'),
  amount: z.number().positive('El monto debe ser positivo'),
  description: z.string().optional(),
});

export const updateDeliveryStatusSchema = z.object({
  status: z.enum(['in_transit', 'delivered']),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>;
export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type UpdateDeliveryStatusInput = z.infer<typeof updateDeliveryStatusSchema>;
export type VisitWaypointInput = z.infer<typeof visitWaypointSchema>;
export type UpdateRouteNotesInput = z.infer<typeof updateRouteNotesSchema>;
export type UpdateWaypointNotesInput = z.infer<typeof updateWaypointNotesSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
