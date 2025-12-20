export interface Bank {
  _id: string;
  bankName: string;
  description?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateBankDto {
  bankName: string;
  description?: string;
}

export interface UpdateBankDto extends Partial<CreateBankDto> {
  isDeleted?: boolean;
}
