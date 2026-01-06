'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button, Loader } from '@/components';
import { bankOrderService } from '@/services/bankOrderService';
import { BankOrder } from '@/types';
import { ArrowLeft, Package, User, MapPin, Phone, Calendar, CreditCard, Truck } from 'lucide-react';

const BankOrderDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<BankOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await bankOrderService.getById(orderId);
      setOrder(response.data || null);
    } catch (error: any) {
      console.error('Failed to fetch order details:', error);
      alert('Failed to load order details');
      router.push('/bank-orders');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat('en-US').format(Math.abs(points));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="py-12">
          <Loader size="lg" text="Loading order details..." />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Order not found</p>
          <Button variant="primary" onClick={() => router.push('/bank-orders')} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/bank-orders')}
            className="mb-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-1">PO Number: {order.poNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <User className="text-blue-600 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900 font-medium">{order.customerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">CNIC</label>
                <p className="text-gray-900">{order.cnic}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mobile 1</label>
                  <p className="text-gray-900">{order.mobile1}</p>
                </div>
                {order.mobile2 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile 2</label>
                    <p className="text-gray-900">{order.mobile2}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Package className="text-blue-600 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Order Information</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Reference Number</label>
                <p className="text-gray-900">{order.refNo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">PO Number</label>
                <p className="text-gray-900 font-medium">{order.poNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Order Date</label>
                <p className="text-gray-900">
                  {new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Redeemed Points</label>
                <p className="text-red-600 font-bold text-lg">{formatPoints(order.redeemedPoints)}</p>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="text-blue-600 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Product</label>
                <p className="text-gray-900 font-medium">{order.product}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Brand</label>
                <p className="text-gray-900">{order.brand}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Gift Code</label>
                  <p className="text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    {order.giftCode}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Quantity</label>
                  <p className="text-gray-900 font-medium text-lg">{order.qty}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <MapPin className="text-blue-600 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">City</label>
                <p className="text-gray-900 font-medium">{order.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-gray-900 leading-relaxed">{order.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        {order.shipmentId && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mt-6">
            <div className="flex items-center mb-4">
              <Truck className="text-blue-600 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Shipment Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Courier Service</label>
                <p className="text-gray-900 font-medium">
                  {order.shipmentId.courierId?.courierName || 'N/A'}
                </p>
                {order.shipmentId.courierId?.courierType && (
                  <p className="text-xs text-gray-500 uppercase mt-1">
                    {order.shipmentId.courierId.courierType}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tracking Number</label>
                <p className="text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">
                  {order.shipmentId.trackingNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Consignment Number</label>
                <p className="text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">
                  {order.shipmentId.consignmentNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Shipment Status</label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.shipmentId.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.shipmentId.status === 'in_transit'
                      ? 'bg-blue-100 text-blue-800'
                      : order.shipmentId.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.shipmentId.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              {order.shipmentId.bookingDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Booking Date</label>
                  <p className="text-gray-900">
                    {new Date(order.shipmentId.bookingDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="text-gray-500">Created At</label>
              <p className="text-gray-900">
                {new Date(order.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <label className="text-gray-500">Updated At</label>
              <p className="text-gray-900">
                {new Date(order.updatedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <label className="text-gray-500">Order ID</label>
              <p className="text-gray-900 font-mono text-xs">{order._id}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BankOrderDetailPage;
