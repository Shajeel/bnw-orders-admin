'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { categorySchema, CategoryFormData } from '@/types/validations/categorySchema';
import { Category } from '@/types';
import Button from './Button';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  category?: Category | null;
  isLoading?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || '',
        status: category.status,
      });
    } else {
      reset({
        name: '',
        description: '',
        status: 'active',
      });
    }
  }, [category, reset]);

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

  const handleFormSubmit = async (data: CategoryFormData) => {
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100/50">
          <h3 className="text-2xl font-bold text-gray-900">
            {category ? 'Edit Category' : 'Add New Category'}
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
          {/* Category Name */}
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g., Electronics, Clothing, Food"
              className={`bg-white border-2 ${
                errors.name ? 'border-red-400' : 'border-gray-200'
              } text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 block w-full px-4 py-3 transition-all duration-200 placeholder:text-gray-400`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Enter category description (optional)"
              className={`bg-white border-2 ${
                errors.description ? 'border-red-400' : 'border-gray-200'
              } text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 block w-full px-4 py-3 transition-all duration-200 placeholder:text-gray-400 resize-none`}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register('status')}
              className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 block w-full px-4 py-3 transition-all duration-200"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              {category ? 'Update Category' : 'Create Category'}
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

export default CategoryModal;
