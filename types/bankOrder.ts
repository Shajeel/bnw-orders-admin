export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered';

export interface BankOrder {
  _id: string;
  cnic: string;
  customerName: string;
  mobile1: string;
  mobile2: string;
  address: string;
  city: string;
  brand: string;
  product: string;
  giftCode: string;
  productId: string;
  qty: number;
  refNo: string;
  poNumber: string;
  orderDate: string;
  redeemedPoints: number;
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
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateBankOrderDto {
  cnic: string;
  customerName: string;
  mobile1: string;
  mobile2?: string;
  address: string;
  city: string;
  brand: string;
  product: string;
  giftCode: string;
  productId: string;
  qty: number;
  refNo: string;
  poNumber: string;
  orderDate: string;
  redeemedPoints: number;
}

export interface UpdateBankOrderDto extends Partial<CreateBankOrderDto> {
  status?: OrderStatus;
  isDeleted?: boolean;
}
