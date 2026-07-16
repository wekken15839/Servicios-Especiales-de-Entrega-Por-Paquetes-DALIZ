import { api } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/api/types'
import type { CreateRouteRequest, VisitWaypointRequest, UpdateRouteNotesRequest, UpdateWaypointNotesRequest } from './requests'
import type {
  GetRoutesResponse,
  GetRouteResponse,
  CreateRouteResponse,
  StartRouteResponse,
  PauseRouteResponse,
  ResumeRouteResponse,
  CompleteRouteResponse,
  VisitWaypointResponse,
  GetRouteAnalysisResponse,
  UpdateRouteNotesResponse,
  UpdateWaypointNotesResponse,
} from './responses'

export const routeService = {
  getAll(): Promise<ApiResponse<GetRoutesResponse>> {
    return api.get<GetRoutesResponse>('/api/routes')
  },

  getById(id: string): Promise<ApiResponse<GetRouteResponse>> {
    return api.get<GetRouteResponse>(`/api/routes/${id}`)
  },

  create(input: CreateRouteRequest): Promise<ApiResponse<CreateRouteResponse>> {
    return api.post<CreateRouteResponse>('/api/routes', input)
  },

  start(id: string): Promise<ApiResponse<StartRouteResponse>> {
    return api.put<StartRouteResponse>(`/api/routes/${id}/start`, {})
  },

  pause(id: string): Promise<ApiResponse<PauseRouteResponse>> {
    return api.put<PauseRouteResponse>(`/api/routes/${id}/pause`, {})
  },

  resume(id: string): Promise<ApiResponse<ResumeRouteResponse>> {
    return api.put<ResumeRouteResponse>(`/api/routes/${id}/resume`, {})
  },

  complete(id: string): Promise<ApiResponse<CompleteRouteResponse>> {
    return api.put<CompleteRouteResponse>(`/api/routes/${id}/complete`, {})
  },

  visitWaypoint(
    routeId: string,
    deliveryId: string,
    input: VisitWaypointRequest,
  ): Promise<ApiResponse<VisitWaypointResponse>> {
    return api.put<VisitWaypointResponse>(
      `/api/routes/${routeId}/waypoints/${deliveryId}/visit`,
      input,
    )
  },

  getAnalysis(id: string): Promise<ApiResponse<GetRouteAnalysisResponse>> {
    return api.get<GetRouteAnalysisResponse>(`/api/routes/${id}/analysis`)
  },

  updateNotes(id: string, input: UpdateRouteNotesRequest): Promise<ApiResponse<UpdateRouteNotesResponse>> {
    return api.put<UpdateRouteNotesResponse>(`/api/routes/${id}/notes`, input)
  },

  updateWaypointNotes(
    routeId: string,
    deliveryId: string,
    input: UpdateWaypointNotesRequest,
  ): Promise<ApiResponse<UpdateWaypointNotesResponse>> {
    return api.put<UpdateWaypointNotesResponse>(
      `/api/routes/${routeId}/waypoints/${deliveryId}/notes`,
      input,
    )
  },
}
