import apiClient from '@/utils/axios';
import {
  Bank,
  CreateBankDto,
  UpdateBankDto,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const bankService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Bank>> => {
    const response = await apiClient.get<PaginatedResponse<Bank>>('/banks', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Bank>> => {
    const response = await apiClient.get<ApiResponse<Bank>>(`/banks/${id}`);
    return response.data;
  },

  create: async (data: CreateBankDto): Promise<ApiResponse<Bank>> => {
    const response = await apiClient.post<ApiResponse<Bank>>('/banks', data);
    return response.data;
  },

  update: async (id: string, data: UpdateBankDto): Promise<ApiResponse<Bank>> => {
    const response = await apiClient.patch<ApiResponse<Bank>>(`/banks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/banks/${id}`);
    return response.data;
  },
};
