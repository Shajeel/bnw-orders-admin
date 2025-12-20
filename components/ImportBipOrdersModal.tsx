'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Bank } from '@/types';
import { bankService } from '@/services/bankService';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface ImportBipOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bankId: string, file: File) => void;
  isLoading?: boolean;
}

const ImportBipOrdersModal: React.FC<ImportBipOrdersModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchBanks();
    }
  }, [isOpen]);

  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      const response = await bankService.getAll({ limit: 100 });
      setBanks(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch banks:', error);
      setError('Failed to load banks');
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ];

      if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
        setError('Please select a valid Excel file (.xlsx, .xls, or .csv)');
        setSelectedFile(null);
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBankId) {
      setError('Please select a bank');
      return;
    }

    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    onSubmit(selectedBankId, selectedFile);
  };

  const handleClose = () => {
    setSelectedBankId('');
    setSelectedFile(null);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import BIP Orders"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank Selection */}
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Select Bank <span className="text-red-500">*</span>
          </label>
          {loadingBanks ? (
            <div className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg p-2.5">
              Loading banks...
            </div>
          ) : (
            <select
              value={selectedBankId}
              onChange={(e) => setSelectedBankId(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="">Choose a bank</option>
              {banks.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.bankName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* File Upload */}
        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Upload Excel File <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="bip-dropzone-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {selectedFile ? (
                  <>
                    <FileSpreadsheet className="w-10 h-10 mb-3 text-green-500" />
                    <p className="text-sm text-gray-700 font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Excel files (.xlsx, .xls, .csv)</p>
                    <p className="text-xs text-gray-500">Max size: 10MB</p>
                  </>
                )}
              </div>
              <input
                id="bip-dropzone-file"
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Info Message */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Make sure your Excel file contains all required columns for BIP orders.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!selectedBankId || !selectedFile}
          >
            Import Orders
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ImportBipOrdersModal;
