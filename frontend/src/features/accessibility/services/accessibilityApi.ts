import { apiClient, APIResponse } from '@/services/api/client';

export interface AssistantRequest {
  query: string;
  context?: string;
}

export interface AssistantResponse {
  response: string;
  suggested_actions: string[];
}

export interface AccessibleRouteRequest {
  origin: string;
  destination: string;
  needsWheelchair: boolean;
}

export interface RouteSegment {
  instruction: string;
  distance_meters: number;
  duration_seconds: number;
}

export interface AccessibleRouteResponse {
  origin: string;
  destination: string;
  segments: RouteSegment[];
  total_duration_seconds: number;
  accessibility_context: string;
}

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  original_text: string;
  translated_text: string;
  target_language: string;
}

export interface VisionResponse {
  description: string;
  obstacles_identified: string[];
}

export const accessibilityApi = {
  getAssistantResponse: (data: AssistantRequest) => 
    apiClient.post<APIResponse<AssistantResponse>>('/api/v1/accessibility/assistant', data),
    
  getAccessibleRoute: (data: AccessibleRouteRequest) => 
    apiClient.post<APIResponse<AccessibleRouteResponse>>('/api/v1/accessibility/route', data),

  translateText: (data: TranslationRequest) => 
    apiClient.post<APIResponse<TranslationResponse>>('/api/v1/accessibility/translate', data),

  analyzeVision: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    // apiClient uses axios/fetch under the hood, we can post FormData
    // Since our apiClient in Sprint 1 is a simple wrapper, we'll configure headers properly.
    return apiClient.post<APIResponse<VisionResponse>>('/api/v1/accessibility/vision', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};
