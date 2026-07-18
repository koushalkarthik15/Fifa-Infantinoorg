import { apiClient, APIResponse } from '@/services/api/client';

export interface DensityNode {
  zoneName: string;
  latitude: number;
  longitude: number;
  densityLevel: number;
  lastUpdated: string;
}

export interface HeatmapResponse {
  nodes: DensityNode[];
  timestamp: string;
}

export interface PredictionRequest {
  currentZone: string;
  targetZone: string;
  timeOffsetMinutes: number;
}

export interface PredictionResponse {
  predictionText: string;
  recommendedAction: string;
}

export interface RouteSegment {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
}

export interface RouteRequest {
  origin: string;
  destination: string;
}

export interface RouteResponse {
  origin: string;
  destination: string;
  segments: RouteSegment[];
  totalDurationSeconds: number;
  crowdContext: string;
}

export const crowdApi = {
  getHeatmap: () => apiClient.get<APIResponse<HeatmapResponse>>('/api/v1/crowd/heatmap'),
  getPrediction: (data: PredictionRequest) => apiClient.post<APIResponse<PredictionResponse>>('/api/v1/crowd/prediction', data),
  getRoute: (data: RouteRequest) => apiClient.post<APIResponse<RouteResponse>>('/api/v1/crowd/route', data),
};
