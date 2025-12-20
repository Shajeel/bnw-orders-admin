'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button, Input, Loader } from '@/components';
import { bankOrderService } from '@/services/bankOrderService';
import { BankOrder, UpdateBankOrderDto } from '@/types';
import { ArrowLeft } from 'lucide-react';

const EditBankOrderPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<UpdateBankOrderDto>({
    orderNumber: '',
    customerName: '',
    amount: 0,
    paymentMethod: '',
    bankName: '',
    transactionId: '',
    status: 'pending',
  });

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await bankOrderService.getById(id);
      const order = response.data as BankOrder;
      setFormData({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        amount: order.amount,
        paymentMethod: order.paymentMethod,
        bankName: order.bankName,
        transactionId: order.transactionId,
        status: order.status,
      });
    } catch (error: any) {
      alert(error.message || 'Failed to fetch order');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderNumber?.trim()) {
      newErrors.orderNumber = 'Order number is required';
    }
    if (!formData.customerName?.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if ((formData.amount || 0) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.paymentMethod?.trim()) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSaving(true);
      await bankOrderService.update(id, formData);
      router.push('/bank-orders');
    } catch (error: any) {
      alert(error.message || 'Failed to update order');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-96">
          <Loader size="lg" text="Loading order..." />
        </div>
      </AdminLayout>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Bank Order</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Order Number"
                name="orderNumber"
                value={formData.orderNumber || ''}
                onChange={handleChange}
                error={errors.orderNumber}
                required
                placeholder="ORD-001"
              />

              <Input
                label="Customer Name"
                name="customerName"
                value={formData.customerName || ''}
                onChange={handleChange}
                error={errors.customerName}
                required
                placeholder="John Doe"
              />

              <Input
                label="Amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount || 0}
                onChange={handleChange}
                error={errors.amount}
                required
                placeholder="0.00"
              />

              <Input
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod || ''}
                onChange={handleChange}
                error={errors.paymentMethod}
                required
                placeholder="Bank Transfer"
              />

              <Input
                label="Bank Name"
                name="bankName"
                value={formData.bankName || ''}
                onChange={handleChange}
                placeholder="ABC Bank"
              />

              <Input
                label="Transaction ID"
                name="transactionId"
                value={formData.transactionId || ''}
                onChange={handleChange}
                placeholder="TXN123456"
              />

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Status <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status || 'pending'}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
              >
                Update Order
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditBankOrderPage;
