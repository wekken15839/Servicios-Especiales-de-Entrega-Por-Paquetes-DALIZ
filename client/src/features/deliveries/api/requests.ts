export type CreateDeliveryRequest = {
  title: string
  clientName: string
  clientPhone?: string
  clientId?: string
  address: string
  lat: number
  lng: number
  notes?: string
  type?: 'mayor' | 'detal'
}

export type UpdateDeliveryStatusRequest = {
  status: 'in_transit' | 'delivered'
}
