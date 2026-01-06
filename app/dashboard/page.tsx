'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Loader } from '@/components';
import { CreditCard, Package, Users, ShoppingCart } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import { DashboardStats } from '@/types';

const DashboardPage = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardService.getStats();
      setDashboardStats(response.data || null);
    } catch (error: any) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      title: 'TOTAL BANK ORDERS',
      value: dashboardStats?.bankOrders.total.toString() || '0',
      subtitle: `${dashboardStats?.bankOrders.completed || 0} completed`,
      badge: `${dashboardStats?.bankOrders.active || 0} active`,
      icon: <CreditCard size={24} />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'TOTAL PRODUCTS',
      value: dashboardStats?.products.total.toString() || '0',
      subtitle: `${dashboardStats?.products.inStock || 0} in stock`,
      badge: `${dashboardStats?.products.active || 0} active`,
      icon: <Package size={24} />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'TOTAL VENDORS',
      value: dashboardStats?.vendors.total.toString() || '0',
      subtitle: `${dashboardStats?.vendors.newVendors || 0} new vendors`,
      badge: `${dashboardStats?.vendors.active || 0} active`,
      icon: <Users size={24} />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'PURCHASE ORDERS',
      value: dashboardStats?.purchaseOrders.total.toString() || '0',
      subtitle: `${dashboardStats?.purchaseOrders.capacityPercentage || 0}% capacity`,
      badge: `${dashboardStats?.purchaseOrders.active || 0} active`,
      icon: <ShoppingCart size={24} />,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" text="Loading dashboard..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back, Admin! Here's what's happening with your business today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-3">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded">
                  {stat.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Summary & Other Content */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Financial Summary</h2>
                <p className="text-sm text-gray-500">Revenue and invoice performance</p>
              </div>
              <a href="#" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                View Invoices →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 rounded-lg p-5">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
                <p className="text-xs text-gray-500 mt-1">1 currency</p>
              </div>
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
                <p className="text-xs text-gray-500 mt-1">0 invoices</p>
              </div>
              <div className="bg-red-50 rounded-lg p-5">
                <p className="text-sm text-gray-600 mb-1">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
                <p className="text-xs text-gray-500 mt-1">0 invoices</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-center py-12">
              <p className="text-gray-500">No recent activity to display</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
