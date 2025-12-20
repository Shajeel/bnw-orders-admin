import apiClient from '@/utils/axios';
import {
  PurchaseOrder,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  CombinedPOPreview,
  CombinePODto,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const purchaseOrderService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    vendorId?: string;
  }): Promise<PaginatedResponse<PurchaseOrder>> => {
    const response = await apiClient.get<PaginatedResponse<PurchaseOrder>>('/purchase-orders', {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await apiClient.get<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}`);
    return response.data;
  },

  create: async (data: CreatePurchaseOrderDto): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await apiClient.post<ApiResponse<PurchaseOrder>>('/purchase-orders', data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdatePurchaseOrderDto
  ): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await apiClient.put<ApiResponse<PurchaseOrder>>(
      `/purchase-orders/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/purchase-orders/${id}`);
    return response.data;
  },

  previewCombined: async (data: CombinePODto): Promise<ApiResponse<CombinedPOPreview>> => {
    const response = await apiClient.post<ApiResponse<CombinedPOPreview>>(
      '/purchase-orders/combine/preview',
      data
    );
    return response.data;
  },

  mergePOs: async (data: CombinePODto): Promise<ApiResponse<PurchaseOrder>> => {
    const response = await apiClient.post<ApiResponse<PurchaseOrder>>(
      '/purchase-orders/merge',
      data
    );
    return response.data;
  },

  getCombinableList: async (params: {
    vendorId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PurchaseOrder[]>> => {
    const response = await apiClient.get<ApiResponse<PurchaseOrder[]>>(
      '/purchase-orders/combinable/list',
      { params }
    );
    return response.data;
  },
};
