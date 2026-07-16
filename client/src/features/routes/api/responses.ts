import type { Route, RouteAnalysis } from '../types'

export type GetRoutesResponse = Route[]

export type GetRouteResponse = Route

export type CreateRouteResponse = Route

export type StartRouteResponse = Route

export type PauseRouteResponse = Route

export type ResumeRouteResponse = Route

export type CompleteRouteResponse = Route & { analysis?: RouteAnalysis }

export type VisitWaypointResponse = { waypoints: Route['waypoints'] }

export type GetRouteAnalysisResponse = RouteAnalysis

export type UpdateRouteNotesResponse = Route

export type UpdateWaypointNotesResponse = Route
