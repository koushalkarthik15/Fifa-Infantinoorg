import { apiClient, APIResponse } from '@/services/api/client';

export interface IncidentRequest {
  description: string;
  location: string;
}

export interface IncidentResponse {
  category: string;
  priority: string;
  suggested_actions: string[];
  assigned_volunteer: string;
}

export const volunteerApi = {
  reportIncident: (data: IncidentRequest) => 
    apiClient.post<APIResponse<IncidentResponse>>('/api/v1/volunteer/incident', data),
};
