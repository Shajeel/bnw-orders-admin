'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button, Input } from '@/components';
import { bankOrderService } from '@/services/bankOrderService';
import { CreateBankOrderDto } from '@/types';
import { ArrowLeft } from 'lucide-react';

const CreateBankOrderPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateBankOrderDto>({
    cnic: '',
    customerName: '',
    mobile1: '',
    mobile2: '',
    address: '',
    city: '',
    brand: '',
    product: '',
    giftCode: '',
    productId: '',
    qty: 1,
    refNo: '',
    poNumber: '',
    orderDate: '',
    redeemedPoints: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'qty' || name === 'redeemedPoints' ? parseInt(value) || 0 : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cnic.trim()) {
      newErrors.cnic = 'CNIC is required';
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.mobile1.trim()) {
      newErrors.mobile1 = 'Mobile number is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.product.trim()) {
      newErrors.product = 'Product is required';
    }
    if (formData.qty <= 0) {
      newErrors.qty = 'Quantity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await bankOrderService.create(formData);
      router.push('/bank-orders');
    } catch (error: any) {
      alert(error.message || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Create Bank Order</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="CNIC"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                error={errors.cnic}
                required
                placeholder="12345-1234567-1"
              />

              <Input
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                error={errors.customerName}
                required
                placeholder="John Doe"
              />

              <Input
                label="Mobile 1"
                name="mobile1"
                value={formData.mobile1}
                onChange={handleChange}
                error={errors.mobile1}
                required
                placeholder="03001234567"
              />

              <Input
                label="Mobile 2"
                name="mobile2"
                value={formData.mobile2 || ''}
                onChange={handleChange}
                placeholder="03001234567"
              />

              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                required
                placeholder="Street address"
              />

              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                required
                placeholder="City name"
              />

              <Input
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Brand name"
              />

              <Input
                label="Product"
                name="product"
                value={formData.product}
                onChange={handleChange}
                error={errors.product}
                required
                placeholder="Product name"
              />

              <Input
                label="Gift Code"
                name="giftCode"
                value={formData.giftCode}
                onChange={handleChange}
                placeholder="Gift code"
              />

              <Input
                label="Product ID"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                placeholder="Product ID"
              />

              <Input
                label="Quantity"
                name="qty"
                type="number"
                value={formData.qty}
                onChange={handleChange}
                error={errors.qty}
                required
                placeholder="1"
              />

              <Input
                label="Reference Number"
                name="refNo"
                value={formData.refNo}
                onChange={handleChange}
                placeholder="Reference number"
              />

              <Input
                label="PO Number"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleChange}
                placeholder="PO number"
              />

              <Input
                label="Order Date"
                name="orderDate"
                type="date"
                value={formData.orderDate}
                onChange={handleChange}
                placeholder="Order date"
              />

              <Input
                label="Redeemed Points"
                name="redeemedPoints"
                type="number"
                value={formData.redeemedPoints}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                Create Order
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

export default CreateBankOrderPage;
