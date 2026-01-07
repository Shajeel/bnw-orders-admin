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
        cnic: order.cnic,
        customerName: order.customerName,
        mobile1: order.mobile1,
        mobile2: order.mobile2,
        address: order.address,
        city: order.city,
        brand: order.brand,
        product: order.product,
        giftCode: order.giftCode,
        productId: order.productId,
        qty: order.qty,
        refNo: order.refNo,
        poNumber: order.poNumber,
        orderDate: order.orderDate,
        redeemedPoints: order.redeemedPoints,
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
      [name]: name === 'qty' || name === 'redeemedPoints' ? parseInt(value) || 0 : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cnic?.trim()) {
      newErrors.cnic = 'CNIC is required';
    }
    if (!formData.customerName?.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.mobile1?.trim()) {
      newErrors.mobile1 = 'Mobile number is required';
    }
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.product?.trim()) {
      newErrors.product = 'Product is required';
    }
    if ((formData.qty || 0) <= 0) {
      newErrors.qty = 'Quantity must be greater than 0';
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
                label="CNIC"
                name="cnic"
                value={formData.cnic || ''}
                onChange={handleChange}
                error={errors.cnic}
                required
                placeholder="12345-1234567-1"
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
                label="Mobile 1"
                name="mobile1"
                value={formData.mobile1 || ''}
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
                value={formData.address || ''}
                onChange={handleChange}
                error={errors.address}
                required
                placeholder="Street address"
              />

              <Input
                label="City"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                error={errors.city}
                required
                placeholder="City name"
              />

              <Input
                label="Brand"
                name="brand"
                value={formData.brand || ''}
                onChange={handleChange}
                placeholder="Brand name"
              />

              <Input
                label="Product"
                name="product"
                value={formData.product || ''}
                onChange={handleChange}
                error={errors.product}
                required
                placeholder="Product name"
              />

              <Input
                label="Gift Code"
                name="giftCode"
                value={formData.giftCode || ''}
                onChange={handleChange}
                placeholder="Gift code"
              />

              <Input
                label="Product ID"
                name="productId"
                value={formData.productId || ''}
                onChange={handleChange}
                placeholder="Product ID"
              />

              <Input
                label="Quantity"
                name="qty"
                type="number"
                value={formData.qty || 1}
                onChange={handleChange}
                error={errors.qty}
                required
                placeholder="1"
              />

              <Input
                label="Reference Number"
                name="refNo"
                value={formData.refNo || ''}
                onChange={handleChange}
                placeholder="Reference number"
              />

              <Input
                label="PO Number"
                name="poNumber"
                value={formData.poNumber || ''}
                onChange={handleChange}
                placeholder="PO number"
              />

              <Input
                label="Order Date"
                name="orderDate"
                type="date"
                value={formData.orderDate || ''}
                onChange={handleChange}
                placeholder="Order date"
              />

              <Input
                label="Redeemed Points"
                name="redeemedPoints"
                type="number"
                value={formData.redeemedPoints || 0}
                onChange={handleChange}
                placeholder="0"
              />

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Status <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status || 'Pending'}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
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
