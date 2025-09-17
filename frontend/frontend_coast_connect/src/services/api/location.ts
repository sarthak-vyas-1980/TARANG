import type { 
  Location, 
  CreateLocationRequest,
  ApiResponse 
} from '../../types';
import { apiClient } from '../../utils/api';

export class LocationsService {
  /**
   * Get all locations
   */
  static async getLocations(): Promise<ApiResponse<{ locations: Location[] }>> {
    try {
      const response = await apiClient.request<{ locations: Location[] }>('/locations');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch locations');
    }
  }

  /**
   * Get location by ID
   */
  static async getLocation(id: number): Promise<ApiResponse<{ location: Location }>> {
    try {
      const response = await apiClient.request<{ location: Location }>(`/locations/${id}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch location');
    }
  }

  /**
   * Create new location
   */
  static async createLocation(locationData: CreateLocationRequest): Promise<ApiResponse<{ location: Location }>> {
    try {
      const response = await apiClient.request<{ location: Location }>('/locations', {
        method: 'POST',
        body: JSON.stringify(locationData)
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create location');
    }
  }

  /**
   * Update location
   */
  static async updateLocation(id: number, locationData: Partial<CreateLocationRequest>): Promise<ApiResponse<{ location: Location }>> {
    try {
      const response = await apiClient.request<{ location: Location }>(`/locations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(locationData)
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update location');
    }
  }

  /**
   * Delete location
   */
  static async deleteLocation(id: number): Promise<ApiResponse<{}>> {
    try {
      const response = await apiClient.request(`/locations/${id}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete location');
    }
  }

  /**
   * Search locations by name
   */
  static async searchLocations(query: string): Promise<ApiResponse<{ locations: Location[] }>> {
    try {
      const response = await apiClient.request<{ locations: Location[] }>(`/locations?search=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to search locations');
    }
  }

  /**
   * Get locations near coordinates
   */
  static async getNearbyLocations(
    lat: number, 
    lng: number, 
    radius: number = 10
  ): Promise<ApiResponse<{ locations: Location[] }>> {
    try {
      const response = await apiClient.request<{ locations: Location[] }>(
        `/locations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch nearby locations');
    }
  }

  /**
   * Get location statistics
   */
  static async getLocationStats(id: number): Promise<ApiResponse<{
    totalReports: number;
    recentReports: number;
    severityBreakdown: Record<string, number>;
  }>> {
    try {
      const response = await apiClient.request(`/locations/${id}/stats`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch location statistics');
    }
  }

  /**
   * Geocode address to coordinates (if implemented)
   */
  static async geocodeAddress(address: string): Promise<ApiResponse<{
    lat: number;
    lng: number;
    formattedAddress: string;
  }>> {
    try {
      const response = await apiClient.request('/locations/geocode', {
        method: 'POST',
        body: JSON.stringify({ address })
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to geocode address');
    }
  }

  /**
   * Reverse geocode coordinates to address (if implemented)
   */
  static async reverseGeocode(lat: number, lng: number): Promise<ApiResponse<{
    address: string;
    city: string;
    country: string;
  }>> {
    try {
      const response = await apiClient.request('/locations/reverse-geocode', {
        method: 'POST',
        body: JSON.stringify({ lat, lng })
      });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to reverse geocode coordinates');
    }
  }
}

export default LocationsService;
