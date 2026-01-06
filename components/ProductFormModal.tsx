'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { productSchema, ProductFormData } from '@/types/validations/productSchema';
import { Product, Category } from '@/types';
import { categoryService } from '@/services/categoryService';
import Button from './Button';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  product?: Product | null;
  isLoading?: boolean;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  isLoading = false,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      bankProductNumber: '',
      productType: 'bank_order' as 'bank_order' | 'bip',
    },
  });

  // Fetch categories
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryService.getAll({ limit: 100, status: 'active' });
      setCategories(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      const categoryId = typeof product.categoryId === 'object' && product.categoryId !== null
        ? (product.categoryId as Category)._id
        : product.categoryId as string;

      reset({
        name: product.name,
        categoryId: categoryId,
        bankProductNumber: product.bankProductNumber,
        productType: product.productType || 'bank_order',
      });
    } else {
      reset({
        name: '',
        categoryId: '',
        bankProductNumber: '',
        productType: 'bank_order' as 'bank_order' | 'bip',
      });
    }
  }, [product, reset]);

  // Handle Escape key and body overflow
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
          <h3 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white/50 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
          {/* Product Name */}
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g., Apple Airpods 4 with Active Noise Cancelation"
              className={`bg-white border-2 ${
                errors.name ? 'border-red-400' : 'border-gray-200'
              } text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 block w-full px-4 py-3 transition-all duration-200 placeholder:text-gray-400`}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            {loadingCategories ? (
              <div className="bg-gray-50 border-2 border-gray-200 text-gray-500 text-sm rounded-xl px-4 py-3">
                Loading categories...
              </div>
            ) : (
              <select
                {...register('categoryId')}
                className={`bg-white border-2 ${
                  errors.categoryId ? 'border-red-400' : 'border-gray-200'
                } text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 block w-full px-4 py-3 transition-all duration-200`}
                disabled={isLoading}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            {errors.categoryId && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Product Type */}
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-700">
              Product Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('productType')}
              className={`bg-white border-2 ${
                errors.productType ? 'border-red-400' : 'border-gray-200'
              } text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 block w-full px-4 py-3 transition-all duration-200`}
              disabled={isLoading}
            >
              <option value="bank_order">Reward Point</option>
              <option value="bip">Installment</option>
            </select>
            {errors.productType && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.productType.message}</p>
            )}
          </div>

          {/* Bank Product Number */}
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-700">
              Bank Product Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register('bankProductNumber')}
              type="text"
              placeholder="e.g., B613"
              className={`bg-white border-2 ${
                errors.bankProductNumber ? 'border-red-400' : 'border-gray-200'
              } text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 block w-full px-4 py-3 transition-all duration-200 placeholder:text-gray-400`}
              disabled={isLoading}
            />
            {errors.bankProductNumber && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.bankProductNumber.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
              isLoading={isLoading}
            >
              {product ? 'Update Product' : 'Create Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
