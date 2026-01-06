'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button, Loader } from '@/components';
import { bipService } from '@/services/bipService';
import { BipOrder } from '@/types';
import {
  ArrowLeft,
  FileText,
  User,
  Phone,
  MapPin,
  Package,
  Calendar,
  DollarSign,
  Hash,
  Palette,
  CreditCard,
  Truck
} from 'lucide-react';

const BipOrderDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<BipOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[BIP Order Detail] Fetching order:', orderId);

      const response = await bipService.getById(orderId);

      console.log('[BIP Order Detail] Response:', response);

      setOrder(response.data || null);
    } catch (error: any) {
      console.error('[BIP Order Detail] Failed to fetch order:', error);
      setError(error.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" text="Loading order details..." />
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
            <Button
              variant="outline"
              onClick={() => router.push('/bip-orders')}
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to BIP Orders
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/bip-orders')}
            className="mb-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to BIP Orders
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">BIP Order Details</h1>
              <p className="text-gray-600 mt-1">PO Number: <span className="font-medium">{order.poNumber}</span></p>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow">
          {/* Customer Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">EFORMS</label>
                </div>
                <p className="text-gray-900 font-medium">{order.eforms}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Customer Name</label>
                </div>
                <p className="text-gray-900 font-medium">{order.customerName}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">CNIC</label>
                </div>
                <p className="text-gray-900">{order.cnic}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Mobile</label>
                </div>
                <p className="text-gray-900">{order.mobile1}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Authorized Receiver</label>
                </div>
                <p className="text-gray-900">{order.authorizedReceiver}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Receiver CNIC</label>
                </div>
                <p className="text-gray-900">{order.receiverCnic}</p>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Address</label>
                </div>
                <p className="text-gray-900">{order.address}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">City</label>
                </div>
                <p className="text-gray-900">{order.city}</p>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Product</label>
                </div>
                <p className="text-gray-900 font-medium">{order.product}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Gift Code</label>
                </div>
                <p className="text-gray-900">{order.giftCode}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Quantity</label>
                </div>
                <p className="text-gray-900">{order.qty}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Color</label>
                </div>
                <p className="text-gray-900">{order.color}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                </div>
                <p className="text-green-600 text-xl font-semibold">{formatAmount(order.amount)}</p>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">PO Number</label>
                </div>
                <p className="text-gray-900 font-medium">{order.poNumber}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-gray-400" size={18} />
                  <label className="text-sm font-medium text-gray-600">Order Date</label>
                </div>
                <p className="text-gray-900">
                  {new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          {order.shipmentId && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Shipment Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="text-gray-400" size={18} />
                    <label className="text-sm font-medium text-gray-600">Courier Service</label>
                  </div>
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
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="text-gray-400" size={18} />
                    <label className="text-sm font-medium text-gray-600">Tracking Number</label>
                  </div>
                  <p className="text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    {order.shipmentId.trackingNumber}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="text-gray-400" size={18} />
                    <label className="text-sm font-medium text-gray-600">Consignment Number</label>
                  </div>
                  <p className="text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    {order.shipmentId.consignmentNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Shipment Status</label>
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
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="text-gray-400" size={18} />
                      <label className="text-sm font-medium text-gray-600">Booking Date</label>
                    </div>
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

          {/* System Information */}
          <div className="p-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order ID:</span>
                <span className="ml-2 font-mono text-gray-900">{order._id}</span>
              </div>
              <div>
                <span className="text-gray-600">Created At:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(order.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(order.updatedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BipOrderDetailPage;
