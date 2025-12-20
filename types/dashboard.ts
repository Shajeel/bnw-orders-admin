export interface DashboardStats {
  bankOrders: {
    total: number;
    completed: number;
    active: number;
  };
  products: {
    total: number;
    inStock: number;
    active: number;
  };
  vendors: {
    total: number;
    newVendors: number;
    active: number;
  };
  purchaseOrders: {
    total: number;
    capacityPercentage: number;
    active: number;
  };
}
