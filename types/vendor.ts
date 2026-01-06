export interface Vendor {
  _id: string;
  vendorName: string;
  contactPerson?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  status: 'active' | 'inactive';
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateVendorDto {
  vendorName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  status: 'active' | 'inactive';
}

export interface UpdateVendorDto extends Partial<CreateVendorDto> {
  isDeleted?: boolean;
}
