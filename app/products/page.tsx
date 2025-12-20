'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button, Table, Loader } from '@/components';
import ProductFormModal from '@/components/ProductFormModal';
import { productService } from '@/services/productService';
import { Product, ProductCategory } from '@/types';
import { ProductFormData } from '@/types/validations/productSchema';
import { Search, Eye, Tag, Plus, Edit } from 'lucide-react';

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products whenever dependencies change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, debouncedSearchTerm]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const params: any = {
        page: currentPage,
        limit: pageSize,
      };

      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        params.search = debouncedSearchTerm.trim();
      }

      console.log('[Products] Fetching with params:', params);

      const response = await productService.getAll(params);

      console.log('[Products] Response:', {
        dataCount: response.data?.length,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });

      setProducts(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalRecords(response.total || 0);
    } catch (error: any) {
      console.error('[Products] Failed to fetch products:', error);
      setProducts([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    setSelectedProduct(product || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedProduct) {
        await productService.update(selectedProduct._id, data);
      } else {
        await productService.create(data);
      }
      handleCloseModal();
      fetchProducts();
    } catch (error: any) {
      alert(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryName = (product: Product): string => {
    if (typeof product.categoryId === 'object' && product.categoryId !== null) {
      return (product.categoryId as ProductCategory).name;
    }
    return '-';
  };

  const getProductTypeLabel = (productType: string): string => {
    return productType === 'bank_order' ? 'Reward Point' : 'Installment';
  };

  const columns = [
    {
      header: 'Product Name',
      accessor: 'name',
      render: (product: Product) => (
        <span className="font-medium text-gray-900">{product.name}</span>
      ),
    },
    {
      header: 'Bank Product Number',
      accessor: 'bankProductNumber',
      width: '180px',
      render: (product: Product) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {product.bankProductNumber}
        </span>
      ),
    },
    {
      header: 'Product Type',
      accessor: 'productType',
      width: '150px',
      render: (product: Product) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          product.productType === 'bank_order'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800'
        }`}>
          {getProductTypeLabel(product.productType)}
        </span>
      ),
    },
    {
      header: 'Category',
      accessor: 'categoryId',
      render: (product: Product) => (
        <span className="text-gray-700">{getCategoryName(product)}</span>
      ),
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      width: '150px',
      render: (product: Product) => (
        <span className="text-gray-600">
          {new Date(product.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      width: '120px',
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/products/${product._id}`);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(product);
            }}
            className="text-green-600 hover:text-green-800"
            title="Edit"
          >
            <Edit size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage product catalog</p>
          </div>
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
          >
            <Plus size={20} className="mr-2" />
            Add Product
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>
            {debouncedSearchTerm && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Found <span className="font-semibold text-gray-900">{totalRecords}</span> result{totalRecords !== 1 ? 's' : ''} for "<span className="font-medium">{debouncedSearchTerm}</span>"
                </span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDebouncedSearchTerm('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="py-12">
              <Loader size="lg" text="Loading products..." />
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={products}
                onRowClick={(product) => router.push(`/products/${product._id}`)}
                emptyMessage="No products found"
              />

              {/* Pagination */}
              {products.length > 0 && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * pageSize, totalRecords)}</span> of{' '}
                        <span className="font-medium">{totalRecords}</span> results
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Show:</label>
                        <select
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        size="sm"
                      >
                        First
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        size="sm"
                      >
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {totalPages > 0 && [...Array(Math.min(5, totalPages))].map((_, idx) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = idx + 1;
                          } else if (currentPage <= 3) {
                            pageNum = idx + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + idx;
                          } else {
                            pageNum = currentPage - 2 + idx;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`min-w-[36px] px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        size="sm"
                      >
                        Next
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        size="sm"
                      >
                        Last
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Product Form Modal */}
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          product={selectedProduct}
          isLoading={isSubmitting}
        />
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
