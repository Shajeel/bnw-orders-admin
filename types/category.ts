export interface Category {
  _id: string;
  name: string;
  description?: string;
  parentId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  status?: 'active' | 'inactive';
}
