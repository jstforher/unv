import apiService from './api';
import { Memory, ApiResponse, SiteSettings, SecretRevealRequest, SecretRevealResponse } from '../types';

export class MemoriesService {
  async getMemories(params?: {
    category?: string;
    is_featured?: boolean;
    ordering?: string;
  }): Promise<ApiResponse<Memory>> {
    const queryParams = new URLSearchParams();

    if (params?.category) queryParams.append('category', params.category);
    if (params?.is_featured !== undefined) queryParams.append('is_featured', String(params.is_featured));
    if (params?.ordering) queryParams.append('ordering', params.ordering);

    const url = `/memories/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get<ApiResponse<Memory>>(url);
  }

  async getMemory(id: string): Promise<Memory> {
    return apiService.get<Memory>(`/memories/${id}/`);
  }

  async createMemory(memoryData: Partial<Memory>): Promise<Memory> {
    return apiService.post<Memory>('/memories/', memoryData);
  }

  async updateMemory(id: string, memoryData: Partial<Memory>): Promise<Memory> {
    return apiService.patch<Memory>(`/memories/${id}/`, memoryData);
  }

  async deleteMemory(id: string): Promise<void> {
    return apiService.delete<void>(`/memories/${id}/`);
  }

  async getFeaturedMemories(): Promise<Memory[]> {
    return apiService.get<Memory[]>('/memories/featured/');
  }

  async revealSecretMemories(token: string): Promise<SecretRevealResponse> {
    return apiService.post<SecretRevealResponse>('/memories/secret-reveal/', { token });
  }

  async uploadMedia(file: File, mediaType: string): Promise<any> {
    return apiService.uploadFile(file, mediaType);
  }
}

export class SettingsService {
  async getSettings(): Promise<SiteSettings> {
    return apiService.get<SiteSettings>('/settings/');
  }

  async updateSettings(settingsData: Partial<SiteSettings>): Promise<SiteSettings> {
    return apiService.patch<SiteSettings>('/settings/1/', settingsData);
  }
}

// Create singleton instances
export const memoriesService = new MemoriesService();
export const settingsService = new SettingsService();