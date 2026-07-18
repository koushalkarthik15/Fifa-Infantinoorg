import { apiClient, APIResponse } from '@/services/api/client';

export interface RouteSegment {
  instruction: string;
  distance_meters: number;
  duration_seconds: number;
}

export interface VenueNavigationRequest {
  origin: string;
  destination_category?: string;
  destination_name?: string;
}

export interface VenueNavigationResponse {
  origin: string;
  destination: string;
  segments: RouteSegment[];
  total_duration_seconds: number;
}

export interface TransportationRequest {
  origin: string;
  destination: string;
  context?: string;
}

export interface TransportationResponse {
  origin: string;
  destination: string;
  recommended_mode: string;
  explanation: string;
}

export const navigationApi = {
  getVenueRoute: (data: VenueNavigationRequest) => 
    apiClient.post<APIResponse<VenueNavigationResponse>>('/api/v1/navigation/venue', data),
  getTransportation: (data: TransportationRequest) => 
    apiClient.post<APIResponse<TransportationResponse>>('/api/v1/navigation/transportation', data),
};
