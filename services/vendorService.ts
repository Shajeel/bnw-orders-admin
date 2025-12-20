import apiClient from '@/utils/axios';
import {
  Vendor,
  CreateVendorDto,
  UpdateVendorDto,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const vendorService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Vendor>> => {
    const response = await apiClient.get<PaginatedResponse<Vendor>>('/vendors', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Vendor>> => {
    const response = await apiClient.get<ApiResponse<Vendor>>(`/vendors/${id}`);
    return response.data;
  },

  create: async (data: CreateVendorDto): Promise<ApiResponse<Vendor>> => {
    const response = await apiClient.post<ApiResponse<Vendor>>('/vendors', data);
    return response.data;
  },

  update: async (id: string, data: UpdateVendorDto): Promise<ApiResponse<Vendor>> => {
    const response = await apiClient.patch<ApiResponse<Vendor>>(`/vendors/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/vendors/${id}`);
    return response.data;
  },
};
