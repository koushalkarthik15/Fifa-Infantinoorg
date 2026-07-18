import { apiClient, APIResponse } from '@/services/api/client';

export interface RouteSegmentDTO {
  instruction: string;
  distance_meters: number;
  duration_seconds: number;
}

export interface GreenRouteRequest {
  origin: string;
  destination: string;
}

export interface GreenRouteResponse {
  origin: string;
  destination: string;
  segments: RouteSegmentDTO[];
  total_duration_seconds: number;
  eco_score: string;
  recommendation: string;
}

export interface FacilityRequest {
  location: string;
}

export interface FacilityResponse {
  water_stations: string[];
  recycling_bins: string[];
}

export const sustainabilityApi = {
  getGreenRoute: (data: GreenRouteRequest) => 
    apiClient.post<APIResponse<GreenRouteResponse>>('/api/v1/sustainability/route', data),
  getFacilities: (data: FacilityRequest) => 
    apiClient.post<APIResponse<FacilityResponse>>('/api/v1/sustainability/facilities', data),
};
