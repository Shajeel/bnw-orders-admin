export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered';

export interface BipOrder {
  _id: string;
  eforms: string;
  cnic: string;
  customerName: string;
  mobile1: string;
  authorizedReceiver: string;
  receiverCnic: string;
  address: string;
  city: string;
  product: string;
  giftCode: string;
  qty: number;
  poNumber: string;
  orderDate: string;
  amount: number;
  color: string;
  status: OrderStatus;
  shipmentId?: {
    _id: string;
    courierId?: {
      _id: string;
      courierName: string;
      courierType: 'tcs' | 'leopards';
    };
    trackingNumber: string;
    consignmentNumber: string;
    status: 'booked' | 'in_transit' | 'delivered' | 'cancelled';
    bookingDate?: string;
  };
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateBipOrderDto {
  eforms: string;
  cnic: string;
  customerName: string;
  mobile1: string;
  authorizedReceiver: string;
  receiverCnic: string;
  address: string;
  city: string;
  product: string;
  giftCode: string;
  qty: number;
  poNumber: string;
  orderDate: string;
  amount: number;
  color: string;
}

export interface UpdateBipOrderDto extends Partial<CreateBipOrderDto> {
  status?: OrderStatus;
  isDeleted?: boolean;
}
