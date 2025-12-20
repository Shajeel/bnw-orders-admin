import apiClient from '@/utils/axios';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const categoryService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Category>> => {
    const response = await apiClient.get<PaginatedResponse<Category>>('/categories', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryDto): Promise<ApiResponse<Category>> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryDto): Promise<ApiResponse<Category>> => {
    const response = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data;
  },

  toggleStatus: async (id: string, status: 'active' | 'inactive'): Promise<ApiResponse<Category>> => {
    const response = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, { status });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/categories/${id}`);
    return response.data;
  },
};
