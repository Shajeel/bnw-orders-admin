'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button, Badge, Loader } from '@/components';
import CategoryModal from '@/components/CategoryModal';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types';
import { CategoryFormData } from '@/types/validations/categorySchema';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoryService.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setCategories(response.data);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    setSelectedCategory(category || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedCategory) {
        await categoryService.update(selectedCategory._id, data);
      } else {
        await categoryService.create(data);
      }
      handleCloseModal();
      fetchCategories();
    } catch (error: any) {
      alert(error.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (category: Category) => {
    const newStatus = category.status === 'active' ? 'inactive' : 'active';
    try {
      await categoryService.toggleStatus(category._id, newStatus);
      fetchCategories();
    } catch (error: any) {
      alert(error.message || 'Failed to update category status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (error: any) {
      alert(error.message || 'Failed to delete category');
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-2">Manage your product categories</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Filter & Add Button */}
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <Button variant="primary" onClick={() => handleOpenModal()}>
                <Plus size={20} className="inline mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200/50">
          {isLoading ? (
            <div className="py-16">
              <Loader size="lg" text="Loading categories..." />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No categories found</p>
              <p className="text-sm text-gray-400 mt-2">Create your first category to get started</p>
              <Button variant="primary" onClick={() => handleOpenModal()} className="mt-6">
                <Plus size={20} className="inline mr-2" />
                Add Category
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Category Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr
                        key={category._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {category.description || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(category)}
                            className="group"
                          >
                            <Badge variant={getStatusBadge(category.status)}>
                              <span className="flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${
                                  category.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                                {category.status.toUpperCase()}
                              </span>
                            </Badge>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(category)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit category"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete category"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        category={selectedCategory}
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
};

export default CategoriesPage;
