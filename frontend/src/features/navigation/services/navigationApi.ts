import { apiClient, APIResponse } from '@/services/api/client';

export interface RouteSegment {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
}

export interface VenueNavigationRequest {
  origin: string;
  destinationCategory?: string;
  destinationName?: string;
}

export interface VenueNavigationResponse {
  origin: string;
  destination: string;
  segments: RouteSegment[];
  totalDurationSeconds: number;
}

export interface TransportationRequest {
  origin: string;
  destination: string;
  context?: string;
}

export interface TransportationResponse {
  origin: string;
  destination: string;
  recommendedMode: string;
  explanation: string;
}

export const navigationApi = {
  getVenueRoute: (data: VenueNavigationRequest) => 
    apiClient.post<APIResponse<VenueNavigationResponse>>('/api/v1/navigation/venue', data),
  getTransportation: (data: TransportationRequest) => 
    apiClient.post<APIResponse<TransportationResponse>>('/api/v1/navigation/transportation', data),
};
