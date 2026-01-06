'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button, Loader } from '@/components';
import ProductFormModal from '@/components/ProductFormModal';
import { productService } from '@/services/productService';
import { Product, ProductCategory } from '@/types';
import { ProductFormData } from '@/types/validations/productSchema';
import { ArrowLeft, Package, Tag, Calendar, Hash, Edit } from 'lucide-react';

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[Product Detail] Fetching product:', productId);

      const response = await productService.getById(productId);

      console.log('[Product Detail] Response:', response);

      setProduct(response.data || null);
    } catch (error: any) {
      console.error('[Product Detail] Failed to fetch product:', error);
      setError(error.message || 'Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (): string => {
    if (!product) return '-';
    if (typeof product.categoryId === 'object' && product.categoryId !== null) {
      return (product.categoryId as ProductCategory).name;
    }
    return '-';
  };

  const getCategoryDescription = (): string | undefined => {
    if (!product) return undefined;
    if (typeof product.categoryId === 'object' && product.categoryId !== null) {
      return (product.categoryId as ProductCategory).description;
    }
    return undefined;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: ProductFormData) => {
    if (!product) return;

    try {
      setIsSubmitting(true);
      await productService.update(product._id, data);
      handleCloseModal();
      fetchProduct(); // Refresh product data
    } catch (error: any) {
      alert(error.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" text="Loading product details..." />
        </div>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
            <Button
              variant="outline"
              onClick={() => router.push('/products')}
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Products
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
            onClick={() => router.push('/products')}
            className="mb-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Products
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 mt-1">Product Details</p>
            </div>
            <Button
              variant="primary"
              onClick={handleOpenModal}
            >
              <Edit size={18} className="mr-2" />
              Edit Product
            </Button>
          </div>
        </div>

        {/* Product Details Card */}
        <div className="bg-white rounded-lg shadow">
          {/* Main Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Product Name</label>
                </div>
                <p className="text-gray-900 font-medium">{product.name}</p>
              </div>

              {/* Bank Product Number */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Bank Product Number</label>
                </div>
                <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded inline-block">
                  {product.bankProductNumber}
                </p>
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Category</label>
                </div>
                <p className="text-gray-900">{getCategoryName()}</p>
                {getCategoryDescription() && (
                  <p className="text-sm text-gray-500 mt-1">{getCategoryDescription()}</p>
                )}
              </div>

              {/* Created At */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Created At</label>
                </div>
                <p className="text-gray-900">
                  {new Date(product.createdAt).toLocaleString('en-US', {
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
                <span className="text-gray-600">Product ID:</span>
                <span className="ml-2 font-mono text-gray-900">{product._id}</span>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(product.updatedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {typeof product.categoryId === 'object' && product.categoryId !== null && (
                <div>
                  <span className="text-gray-600">Category ID:</span>
                  <span className="ml-2 font-mono text-gray-900">
                    {(product.categoryId as ProductCategory)._id}
                  </span>
                </div>
              )}
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2">
                  {product.isDeleted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Deleted
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Form Modal */}
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          product={product}
          isLoading={isSubmitting}
        />
      </div>
    </AdminLayout>
  );
};

export default ProductDetailPage;
