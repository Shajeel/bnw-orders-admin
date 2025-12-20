'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button, Badge, Loader } from '@/components';
import VendorFormModal from '@/components/VendorFormModal';
import { vendorService } from '@/services/vendorService';
import { Vendor } from '@/types';
import { VendorFormData } from '@/types/validations/vendorSchema';
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';

const VendorDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  const fetchVendor = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[Vendor Detail] Fetching vendor:', vendorId);

      const response = await vendorService.getById(vendorId);

      console.log('[Vendor Detail] Response:', response);

      setVendor(response.data);
    } catch (error: any) {
      console.error('[Vendor Detail] Failed to fetch vendor:', error);
      setError(error.message || 'Failed to load vendor details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: VendorFormData) => {
    if (!vendor) return;

    try {
      setIsSubmitting(true);
      await vendorService.update(vendor._id, data);
      handleCloseModal();
      fetchVendor(); // Refresh vendor data
    } catch (error: any) {
      alert(error.message || 'Failed to update vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" text="Loading vendor details..." />
        </div>
      </AdminLayout>
    );
  }

  if (error || !vendor) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error || 'Vendor not found'}</p>
            <Button
              variant="outline"
              onClick={() => router.push('/vendors')}
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Vendors
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/vendors')}
            className="mb-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Vendors
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{vendor.vendorName}</h1>
              <p className="text-gray-600 mt-1">Vendor Details</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={vendor.status === 'active' ? 'success' : 'default'}>
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    vendor.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  {vendor.status.toUpperCase()}
                </span>
              </Badge>
              <Button
                variant="primary"
                onClick={handleOpenModal}
              >
                <Edit size={18} className="mr-2" />
                Edit Vendor
              </Button>
            </div>
          </div>
        </div>

        {/* Vendor Details Card */}
        <div className="bg-white rounded-lg shadow">
          {/* Main Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vendor Name */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Vendor Name</label>
                </div>
                <p className="text-gray-900 font-medium">{vendor.vendorName}</p>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Email</label>
                </div>
                <a
                  href={`mailto:${vendor.email}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {vendor.email}
                </a>
              </div>

              {/* Phone */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                </div>
                <a
                  href={`tel:${vendor.phone}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {vendor.phone}
                </a>
              </div>

              {/* City */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">City</label>
                </div>
                <p className="text-gray-900">{vendor.city}</p>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Address</label>
                </div>
                <p className="text-gray-900">{vendor.address}</p>
              </div>

              {/* Created At */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Created At</label>
                </div>
                <p className="text-gray-900">
                  {new Date(vendor.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="p-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Vendor ID:</span>
                <span className="ml-2 font-mono text-gray-900">{vendor._id}</span>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(vendor.updatedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Form Modal */}
        <VendorFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          vendor={vendor}
          isLoading={isSubmitting}
        />
      </div>
    </AdminLayout>
  );
};

export default VendorDetailPage;
