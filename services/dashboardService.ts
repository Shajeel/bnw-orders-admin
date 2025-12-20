import apiClient from '@/utils/axios';
import { DashboardStats, ApiResponse } from '@/types';

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  },
};
