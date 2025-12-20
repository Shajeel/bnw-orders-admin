export interface ProductCategory {
  _id: string;
  name: string;
  description?: string;
  status: string;
}

export type ProductType = 'bank_order' | 'bip';

export interface Product {
  _id: string;
  name: string;
  categoryId: ProductCategory | string;
  bankProductNumber: string;
  productType: ProductType;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateProductDto {
  name: string;
  categoryId: string;
  bankProductNumber: string;
  productType: ProductType;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  isDeleted?: boolean;
}
