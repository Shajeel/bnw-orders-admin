import React from 'react';
import Modal from './Modal';
import Button from './Button';
import Loader from './Loader';
import { CombinedPOPreview } from '@/types';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface CombinedPOPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  preview: CombinedPOPreview | null;
  isLoading: boolean;
  onConfirm: () => void;
  isConfirming: boolean;
}

const CombinedPOPreviewModal: React.FC<CombinedPOPreviewModalProps> = ({
  isOpen,
  onClose,
  preview,
  isLoading,
  onConfirm,
  isConfirming,
}) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Preview Combined Purchase Order" size="xl">
      {isLoading ? (
        <div className="py-12">
          <Loader size="lg" text="Loading preview..." />
        </div>
      ) : preview ? (
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">
                Combining {preview.originalPOsCount} Purchase Order{preview.originalPOsCount !== 1 ? 's' : ''}
              </p>
              <p className="text-blue-600">Original POs: {preview.poNumbers.join(', ')}</p>
            </div>
          </div>

          {/* Vendor Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Vendor Details</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-lg font-bold text-gray-900 mb-2">{preview.vendor.vendorName}</p>
              <div className="text-sm text-gray-600 space-y-1">
                {preview.vendor.email && (
                  <p>
                    <span className="font-medium">Email:</span> {preview.vendor.email}
                  </p>
                )}
                {preview.vendor.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {preview.vendor.phone}
                  </p>
                )}
                {preview.vendor.address && (
                  <p>
                    <span className="font-medium">Address:</span> {preview.vendor.address}
                  </p>
                )}
                {preview.vendor.city && (
                  <p>
                    <span className="font-medium">City:</span> {preview.vendor.city}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Products</h4>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Source PO</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Unit Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.products.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                      <td className="py-3 px-4 text-gray-900 font-medium">{product.productName}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-mono">
                          {product.sourcePO}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">{product.quantity}</td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {formatAmount(product.unitPrice)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900 font-medium">
                        {formatAmount(product.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t-2 border-gray-300">
                    <td colSpan={5} className="py-4 px-4 text-right font-bold text-gray-900">
                      TOTAL:
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-blue-600 text-lg">
                      {formatAmount(preview.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} disabled={isConfirming}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onConfirm} disabled={isConfirming}>
              {isConfirming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Combining...
                </>
              ) : (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  Confirm & Combine
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No preview available</p>
        </div>
      )}
    </Modal>
  );
};

export default CombinedPOPreviewModal;
