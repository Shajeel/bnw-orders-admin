'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button, Table, Loader } from '@/components';
import ImportBipOrdersModal from '@/components/ImportBipOrdersModal';
import PurchaseOrderFormModal from '@/components/PurchaseOrderFormModal';
import CourierDispatchModal from '@/components/CourierDispatchModal';
import { bipService } from '@/services/bipService';
import { purchaseOrderService } from '@/services/purchaseOrderService';
import { courierService } from '@/services/courierService';
import { BipOrder, OrderStatus, DispatchOrderRequest } from '@/types';
import { Edit, Trash2, Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, Upload, ShoppingCart, Truck } from 'lucide-react';

type SortField = 'poNumber' | 'customerName' | 'product' | 'orderDate' | 'city' | 'amount';
type SortOrder = 'asc' | 'desc';

const BipOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<BipOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'all' | 'poNumber' | 'eforms' | 'product'>('all');
  const [sortField, setSortField] = useState<SortField>('orderDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [selectedOrderForPO, setSelectedOrderForPO] = useState<BipOrder | null>(null);
  const [isSubmittingPO, setIsSubmittingPO] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<BipOrder | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch orders whenever dependencies change
  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, sortField, sortOrder, debouncedSearchTerm, searchField, statusFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      const params: any = {
        page: currentPage,
        limit: pageSize,
        sortBy: sortField,
        sortOrder: sortOrder,
      };

      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        params.search = debouncedSearchTerm.trim();
        if (searchField !== 'all') {
          params.searchField = searchField;
        }
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      console.log('[BIP Orders] Fetching with params:', params);

      const response = await bipService.getAll(params);

      console.log('[BIP Orders] Response:', {
        dataCount: response.data?.length,
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });

      setOrders(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalRecords(response.total || 0);
    } catch (error: any) {
      console.error('[BIP Orders] Failed to fetch orders:', error);
      setOrders([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await bipService.delete(id);
      fetchOrders();
    } catch (error: any) {
      alert(error.message || 'Failed to delete order');
    }
  };

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    try {
      await bipService.updateStatus(id, status);
      fetchOrders();
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  const getStatusBadgeVariant = (status: OrderStatus): 'success' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Dispatched':
      case 'Processing':
        return 'info';
      case 'Confirmed':
        return 'warning';
      case 'Pending':
      default:
        return 'default';
    }
  };

  const handleImport = async (bankId: string, file: File) => {
    try {
      setIsImporting(true);
      console.log('Importing BIP orders:', { bankId, fileName: file.name });

      await bipService.import(bankId, file);

      setIsImportModalOpen(false);
      fetchOrders();
      alert('BIP orders imported successfully!');
    } catch (error: any) {
      console.error('Import failed:', error);
      alert(error.message || 'Failed to import BIP orders');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreatePOFromOrder = (order: BipOrder) => {
    setSelectedOrderForPO(order);
    setIsPOModalOpen(true);
  };

  const handleClosePOModal = () => {
    setIsPOModalOpen(false);
    setSelectedOrderForPO(null);
  };

  const handleSubmitPO = async (data: any) => {
    try {
      setIsSubmittingPO(true);
      await purchaseOrderService.create(data);

      // Update the order status to "processing" after creating PO
      if (selectedOrderForPO) {
        await bipService.updateStatus(selectedOrderForPO._id, 'processing');
      }

      handleClosePOModal();
      fetchOrders(); // Refresh to show updated status
      alert('Purchase Order created successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to create purchase order');
    } finally {
      setIsSubmittingPO(false);
    }
  };

  const handleDispatchOrder = (order: BipOrder) => {
    setSelectedOrderForDispatch(order);
    setIsDispatchModalOpen(true);
  };

  const handleCloseDispatchModal = () => {
    setIsDispatchModalOpen(false);
    setSelectedOrderForDispatch(null);
  };

  const handleSubmitDispatch = async (data: DispatchOrderRequest) => {
    if (!selectedOrderForDispatch) return;

    try {
      setIsDispatching(true);

      // Call manual or automatic dispatch based on isManualDispatch flag
      const response = data.isManualDispatch
        ? await courierService.manualDispatchBipOrder(selectedOrderForDispatch._id, data)
        : await courierService.dispatchBipOrder(selectedOrderForDispatch._id, data);

      handleCloseDispatchModal();
      fetchOrders(); // Refresh to show updated status
      alert(`Order dispatched successfully!\nTracking Number: ${response.data.trackingNumber}`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to dispatch order');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="ml-1 text-blue-600" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-blue-600" />
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const columns = [
    {
      header: 'EFORMS',
      accessor: 'eforms',
      width: '120px',
    },
    {
      header: (
        <button
          onClick={() => handleSort('poNumber')}
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          PO Number
          {getSortIcon('poNumber')}
        </button>
      ),
      accessor: 'poNumber',
      width: '140px',
    },
    {
      header: (
        <button
          onClick={() => handleSort('customerName')}
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          Customer Name
          {getSortIcon('customerName')}
        </button>
      ),
      accessor: 'customerName',
      width: '180px',
    },
    {
      header: 'CNIC',
      accessor: 'cnic',
      width: '140px',
    },
    {
      header: 'Mobile',
      accessor: 'mobile1',
      width: '130px',
    },
    {
      header: (
        <button
          onClick={() => handleSort('product')}
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          Product
          {getSortIcon('product')}
        </button>
      ),
      accessor: 'product',
      width: '200px',
    },
    {
      header: 'Gift Code',
      accessor: 'giftCode',
      width: '100px',
    },
    {
      header: 'Qty',
      accessor: 'qty',
      width: '60px',
    },
    {
      header: (
        <button
          onClick={() => handleSort('city')}
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          City
          {getSortIcon('city')}
        </button>
      ),
      accessor: 'city',
      width: '120px',
    },
    {
      header: (
        <button
          onClick={() => handleSort('amount')}
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          Amount
          {getSortIcon('amount')}
        </button>
      ),
      accessor: 'amount',
      width: '120px',
      render: (order: BipOrder) => (
        <span className="text-green-600 font-medium">
          {formatAmount(order.amount)}
        </span>
      ),
    },
    {
      header: 'Color',
      accessor: 'color',
      width: '100px',
    },
    {
      header: (
        <button
          onClick={() => handleSort('orderDate')}
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          Order Date
          {getSortIcon('orderDate')}
        </button>
      ),
      accessor: 'orderDate',
      width: '120px',
      render: (order: BipOrder) => new Date(order.orderDate).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '180px',
      render: (order: BipOrder) => (
        <div className="flex items-center gap-2">
          <select
            value={order.status}
            onChange={(e) => {
              e.stopPropagation();
              handleStatusUpdate(order._id, e.target.value as OrderStatus);
            }}
            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      width: '160px',
      render: (order: BipOrder) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/bip-orders/${order._id}`);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCreatePOFromOrder(order);
            }}
            className="text-green-600 hover:text-green-800"
            title="Create Purchase Order"
          >
            <ShoppingCart size={18} />
          </button>
          {order.status === 'processing' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDispatchOrder(order);
              }}
              className="text-orange-600 hover:text-orange-800"
              title="Dispatch with Courier"
            >
              <Truck size={18} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(order._id);
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
            <h1 className="text-2xl font-bold text-gray-900">BIP Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track all BIP redemption orders</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload size={20} className="mr-2" />
            Import Orders
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search orders by PO Number, EFORMS, or Product Name..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Search in:</label>
                <select
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[160px]"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value as any)}
                >
                  <option value="all">All Fields</option>
                  <option value="poNumber">PO Number</option>
                  <option value="eforms">EFORMS</option>
                  <option value="product">Product Name</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Status:</label>
                <select
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
            {debouncedSearchTerm && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Found <span className="font-semibold text-gray-900">{totalRecords}</span> result{totalRecords !== 1 ? 's' : ''} for "<span className="font-medium">{debouncedSearchTerm}</span>"
                  {searchField !== 'all' && <span> in <span className="font-medium">{searchField}</span></span>}
                </span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDebouncedSearchTerm('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="py-12">
              <Loader size="lg" text="Loading BIP orders..." />
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={orders}
                onRowClick={(order) => router.push(`/bip-orders/${order._id}`)}
                emptyMessage="No BIP orders found"
              />

              {/* Pagination */}
              {orders.length > 0 && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * pageSize, totalRecords)}</span> of{' '}
                        <span className="font-medium">{totalRecords}</span> results
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Show:</label>
                        <select
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        size="sm"
                      >
                        First
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        size="sm"
                      >
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {totalPages > 0 && [...Array(Math.min(5, totalPages))].map((_, idx) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = idx + 1;
                          } else if (currentPage <= 3) {
                            pageNum = idx + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + idx;
                          } else {
                            pageNum = currentPage - 2 + idx;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`min-w-[36px] px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        size="sm"
                      >
                        Next
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        size="sm"
                      >
                        Last
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Import Orders Modal */}
        <ImportBipOrdersModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSubmit={handleImport}
          isLoading={isImporting}
        />

        {/* Purchase Order Modal */}
        <PurchaseOrderFormModal
          isOpen={isPOModalOpen}
          onClose={handleClosePOModal}
          onSubmit={handleSubmitPO}
          isLoading={isSubmittingPO}
          initialOrderType="bip"
          initialOrderId={selectedOrderForPO?._id || null}
          initialProductName={selectedOrderForPO?.product || null}
          initialQuantity={selectedOrderForPO?.qty || null}
          initialGiftCode={selectedOrderForPO?.giftCode || null}
        />

        {/* Courier Dispatch Modal */}
        <CourierDispatchModal
          isOpen={isDispatchModalOpen}
          onClose={handleCloseDispatchModal}
          onDispatch={handleSubmitDispatch}
          orderType="bip"
          defaultDeclaredValue={selectedOrderForDispatch?.amount || 0}
          defaultProductDescription={selectedOrderForDispatch?.product || ''}
          isLoading={isDispatching}
        />
      </div>
    </AdminLayout>
  );
};

export default BipOrdersPage;
