'use client';

import React from 'react';
import { Modal, Button } from '@/components';
import { MessageCircle } from 'lucide-react';

interface WhatsAppConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  orderCount: number;
  orderType: 'Bank' | 'BIP';
}

const WhatsAppConfirmationModal: React.FC<WhatsAppConfirmationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  orderCount,
  orderType,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send WhatsApp Confirmations">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="text-blue-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-blue-900 font-semibold">
                  Sending WhatsApp confirmations to {orderCount} customer{orderCount !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  {orderType} order confirmations will be sent via WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* What will be sent */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Information that will be sent:
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Customer phone number</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Customer name</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Order number (PO Number)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Product name</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Order total amount</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Delivery address</span>
              </li>
            </ul>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> This action cannot be undone. WhatsApp messages will be sent immediately to all selected customers.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              <MessageCircle size={18} className="mr-2" />
              Send to {orderCount} Customer{orderCount !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default WhatsAppConfirmationModal;
