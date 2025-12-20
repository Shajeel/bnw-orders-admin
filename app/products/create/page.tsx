'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components';
import { ArrowLeft } from 'lucide-react';

const CreateProductPage = () => {
  const router = useRouter();

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Create Product form - Ready for implementation</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateProductPage;
