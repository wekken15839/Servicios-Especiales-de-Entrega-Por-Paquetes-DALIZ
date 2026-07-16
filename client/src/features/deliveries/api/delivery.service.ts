import { api } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/api/types'
import type { CreateDeliveryRequest, UpdateDeliveryStatusRequest } from './requests'
import type {
  GetDeliveriesResponse,
  GetDeliveryResponse,
  CreateDeliveryResponse,
  UpdateDeliveryStatusResponse,
  DeleteDeliveryResponse,
} from './responses'

export const deliveryService = {
  getAll(): Promise<ApiResponse<GetDeliveriesResponse>> {
    return api.get<GetDeliveriesResponse>('/api/deliveries')
  },

  getById(id: string): Promise<ApiResponse<GetDeliveryResponse>> {
    return api.get<GetDeliveryResponse>(`/api/deliveries/${id}`)
  },

  create(input: CreateDeliveryRequest): Promise<ApiResponse<CreateDeliveryResponse>> {
    return api.post<CreateDeliveryResponse>('/api/deliveries', input)
  },

  updateStatus(
    id: string,
    input: UpdateDeliveryStatusRequest,
  ): Promise<ApiResponse<UpdateDeliveryStatusResponse>> {
    return api.put<UpdateDeliveryStatusResponse>(`/api/deliveries/${id}/status`, input)
  },

  delete(id: string): Promise<ApiResponse<DeleteDeliveryResponse>> {
    return api.delete<DeleteDeliveryResponse>(`/api/deliveries/${id}`)
  },
}
