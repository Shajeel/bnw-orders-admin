'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button, Table, Loader } from '@/components';
import BankModal from '@/components/BankModal';
import { bankService } from '@/services/bankService';
import { Bank } from '@/types';
import { BankFormData } from '@/types/validations/bankSchema';
import { Plus, Edit, Trash2 } from 'lucide-react';

const BanksPage = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBanks();
  }, [currentPage, searchTerm]);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      const response = await bankService.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm,
      });
      setBanks(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalRecords(response.total || 0);
    } catch (error: any) {
      console.error('Failed to fetch banks:', error);
      setBanks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedBank(null);
    setIsModalOpen(true);
  };

  const handleEdit = (bank: Bank) => {
    setSelectedBank(bank);
    setIsModalOpen(true);
  };

  const handleDelete = async (bank: Bank) => {
    if (!confirm(`Are you sure you want to delete ${bank.bankName}?`)) return;

    try {
      await bankService.delete(bank._id);
      fetchBanks();
    } catch (error: any) {
      alert(error.message || 'Failed to delete bank');
    }
  };

  const handleSubmit = async (data: BankFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedBank) {
        await bankService.update(selectedBank._id, data);
      } else {
        await bankService.create(data);
      }
      setIsModalOpen(false);
      fetchBanks();
    } catch (error: any) {
      alert(error.message || 'Failed to save bank');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Bank Name',
      accessor: 'bankName',
      render: (bank: Bank) => (
        <span className="font-medium text-gray-900">{bank.bankName}</span>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (bank: Bank) => (
        <span className="text-gray-600">{bank.description || '-'}</span>
      ),
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (bank: Bank) => (
        <span className="text-gray-600">
          {new Date(bank.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      width: '120px',
      render: (bank: Bank) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(bank);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(bank);
            }}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={18} />
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
            <h1 className="text-2xl font-bold text-gray-900">Banks</h1>
            <p className="text-gray-600 mt-1">Manage bank list</p>
          </div>
          <Button variant="primary" onClick={handleCreate}>
            <Plus size={20} className="mr-2" />
            Add Bank
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search banks..."
              className="w-full md:w-96 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {isLoading ? (
            <div className="py-12">
              <Loader size="lg" text="Loading banks..." />
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={banks}
                emptyMessage="No banks found"
              />

              {totalPages > 1 && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * 10) + 1} to{' '}
                      {Math.min(currentPage * 10, totalRecords)} of {totalRecords} results
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        size="sm"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        size="sm"
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

        <BankModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          bank={selectedBank}
          isLoading={isSubmitting}
        />
      </div>
    </AdminLayout>
  );
};

export default BanksPage;
