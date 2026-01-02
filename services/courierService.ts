import apiClient from '@/utils/axios';
import { Courier, DispatchOrderRequest, Shipment, ApiResponse } from '@/types';

export const courierService = {
  // Get all active couriers
  getActiveCouriers: async (): Promise<ApiResponse<Courier[]>> => {
    const response = await apiClient.get<ApiResponse<Courier[]>>('/couriers', {
      params: { isActive: true },
    });
    return response.data;
  },

  // Dispatch bank order with courier
  dispatchBankOrder: async (
    orderId: string,
    data: DispatchOrderRequest
  ): Promise<ApiResponse<Shipment>> => {
    const response = await apiClient.post<ApiResponse<Shipment>>(
      `/shipments/dispatch/bank-order/${orderId}`,
      data
    );
    return response.data;
  },

  // Dispatch BIP order with courier
  dispatchBipOrder: async (
    orderId: string,
    data: DispatchOrderRequest
  ): Promise<ApiResponse<Shipment>> => {
    const response = await apiClient.post<ApiResponse<Shipment>>(
      `/shipments/dispatch/bip-order/${orderId}`,
      data
    );
    return response.data;
  },

  // Manual dispatch bank order
  manualDispatchBankOrder: async (
    orderId: string,
    data: DispatchOrderRequest
  ): Promise<ApiResponse<Shipment>> => {
    // Exclude courierType and isManualDispatch from manual dispatch payload
    const { courierType, isManualDispatch, ...manualData } = data;
    const response = await apiClient.post<ApiResponse<Shipment>>(
      `/shipments/dispatch/bank-order/${orderId}/manual`,
      manualData
    );
    return response.data;
  },

  // Manual dispatch BIP order
  manualDispatchBipOrder: async (
    orderId: string,
    data: DispatchOrderRequest
  ): Promise<ApiResponse<Shipment>> => {
    // Exclude courierType and isManualDispatch from manual dispatch payload
    const { courierType, isManualDispatch, ...manualData } = data;
    const response = await apiClient.post<ApiResponse<Shipment>>(
      `/shipments/dispatch/bip-order/${orderId}/manual`,
      manualData
    );
    return response.data;
  },
};
