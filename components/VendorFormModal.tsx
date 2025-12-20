'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { vendorSchema, VendorFormData } from '@/types/validations/vendorSchema';
import { Vendor } from '@/types';
import Button from './Button';

interface VendorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VendorFormData) => Promise<void>;
  vendor?: Vendor | null;
  isLoading?: boolean;
}

const VendorFormModal: React.FC<VendorFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vendor,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      vendorName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      status: 'active',
    },
  });

  // Reset form when vendor changes
  useEffect(() => {
    if (vendor) {
      reset({
        vendorName: vendor.vendorName,
        phone: vendor.phone,
        email: vendor.email,
        address: vendor.address,
        city: vendor.city,
        status: vendor.status,
      });
    } else {
      reset({
        vendorName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        status: 'active',
      });
    }
  }, [vendor, reset]);

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

  const handleFormSubmit = async (data: VendorFormData) => {
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
          <h3 className="text-2xl font-bold text-gray-900">
            {vendor ? 'Edit Vendor' : 'Add New Vendor'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Vendor Name */}
            <div className="md:col-span-2">
              <label className="block mb-2.5 text-sm font-semibold text-gray-700">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('vendorName')}
                type="text"
                placeholder="e.g., ABC Suppliers Ltd"
                className={`bg-white border-2 ${
                  errors.vendorName ? 'border-red-400' : 'border-gray-200'
                } text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 block w-full px-4 py-3 transition-all duration-200 placeholder:text-gray-400`}
                disabled={isLoading}
              />
              {errors.vendorName && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.vendorName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2.5 text-sm font-semibold text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="+1234567890"
                className={`bg-white border-2 ${
                  errors.phone ? 'border-red-400' : 'border-gray-200'
                } text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 block w-full px-4 py-3 transition-all duration-200 placeholder:text-gray-400`}
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2.5 text-sm font-semibold text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="contact@example.com"
                className={`bg-white border-2 ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                } text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 block w-full px-4 py-3 transition-all duration-200 placeholder:text-gray-400`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block mb-2.5 text-sm font-semibold text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                {...register('city')}
                type="text"
                placeholder="New York"
                className={`bg-white border-2 ${
                  errors.city ? 'border-red-400' : 'border-gray-200'
                } text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 block w-full px-4 py-3 transition-all duration-200 placeholder:text-gray-400`}
                disabled={isLoading}
              />
              {errors.city && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.city.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block mb-2.5 text-sm font-semibold text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register('status')}
                className="bg-white border-2 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 block w-full px-4 py-3 transition-all duration-200"
                disabled={isLoading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block mb-2.5 text-sm font-semibold text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('address')}
                rows={3}
                placeholder="123 Business Street"
                className={`bg-white border-2 ${
                  errors.address ? 'border-red-400' : 'border-gray-200'
                } text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 block w-full px-4 py-3 transition-all duration-200 placeholder:text-gray-400 resize-none`}
                disabled={isLoading}
              />
              {errors.address && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.address.message}</p>
              )}
            </div>
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
              {vendor ? 'Update Vendor' : 'Create Vendor'}
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

export default VendorFormModal;
