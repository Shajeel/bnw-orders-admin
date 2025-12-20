'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bankSchema, BankFormData } from '@/types/validations/bankSchema';
import { Bank } from '@/types';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BankFormData) => void;
  bank?: Bank | null;
  isLoading?: boolean;
}

const BankModal: React.FC<BankModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bank,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    mode: 'onSubmit', // Only validate on submit
    defaultValues: {
      bankName: '',
      description: '',
    },
  });

  // Reset form when modal opens/closes or bank changes
  useEffect(() => {
    if (isOpen) {
      if (bank) {
        reset({
          bankName: bank.bankName || '',
          description: bank.description || '',
        });
      } else {
        reset({
          bankName: '',
          description: '',
        });
      }
    }
  }, [isOpen, bank, reset]);

  const handleFormSubmit = (data: BankFormData) => {
    console.log('Form submitted:', data);
    onSubmit(data);
  };

  const handleClose = () => {
    reset({
      bankName: '',
      description: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={bank ? 'Edit Bank' : 'Add New Bank'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Bank Name"
          {...register('bankName')}
          error={errors.bankName?.message}
          placeholder="Enter bank name"
          required
        />

        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className={`bg-gray-50 border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            placeholder="Enter bank description (optional)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {bank ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BankModal;
