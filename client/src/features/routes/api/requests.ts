export type CreateRouteRequest = {
  name: string
  deliveryIds: string[]
  optimize?: boolean
}

export type VisitWaypointRequest = {
  packagesDelivered?: number
  packagesCount?: number
  paymentStatus?: 'paid' | 'pending'
  creditAmount?: number
  partialPayment?: number
  abonoAmount?: number
  abonoDescription?: string
}

export type UpdateRouteNotesRequest = {
  notes: string
}

export type UpdateWaypointNotesRequest = {
  notes: string
}
