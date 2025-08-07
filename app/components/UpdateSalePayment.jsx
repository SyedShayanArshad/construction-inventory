
'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import Loading from './Loading';

function UpdateSalePayment({ onClose, selectedSale, onSubmit }) {
  const [updateSaleForm, setUpdateSaleForm] = useState({
    paid: '',
    customerName: selectedSale.customer?.name || '',
    customerPhone: selectedSale.customer?.phoneNumber || '',
    date: new Date().toISOString().slice(0, 16),
    paymentMethod: 'Cash',
  });
  const [loading, setLoading] = useState(false);

  const subTotal = Number(selectedSale?.subTotal) || 0;
  const amountPaid = Number(selectedSale?.amountPaid) || 0;
  const totalAfterPayment = amountPaid + Number(updateSaleForm.paid || 0);
  const remainingBalance = subTotal - totalAfterPayment;

  const confirmPaymentUpdate = async () => {
    setLoading(true);
    try {
      if (!updateSaleForm.paid || Number(updateSaleForm.paid) <= 0) {
        throw new Error('Please enter a valid payment amount');
      }

      const paymentData = {
        saleId: selectedSale.id,
        customerId: selectedSale.customerId,
        amountPaid: Number(updateSaleForm.paid),
        paymentMethod: updateSaleForm.paymentMethod,
        date: updateSaleForm.date,
      };

      const response = await fetch('/api/sales/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      if (
        updateSaleForm.customerName !== (selectedSale.customer?.name || '') ||
        updateSaleForm.customerPhone !== (selectedSale.customer?.phoneNumber || '')
      ) {
        const customerResponse = await fetch(`/api/customers/${selectedSale.customerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: updateSaleForm.customerName,
            phoneNumber: updateSaleForm.customerPhone || null,
          }),
        });

        if (!customerResponse.ok) {
          const { error } = await customerResponse.json();
          throw new Error(error);
        }
      }

      toast.success('Payment updated successfully!');
      onSubmit();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to update payment');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedSale) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-2xl p-6 max-w-xl w-full border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-2 rounded-full text-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Update Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {loading && <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-gray-900"><Loading /></div>}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sale Total
                </label>
                <input
                  type="text"
                  disabled
                  value={formatCurrency(subTotal)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Already Paid
                </label>
                <input
                  type="text"
                  disabled
                  value={formatCurrency(amountPaid)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span
                    className={
                      subTotal - amountPaid > 0
                        ? "text-red-600 dark:text-red-400 font-medium"
                        : "text-green-600 dark:text-green-400 font-medium"
                    }
                  >
                    Remaining Balance
                  </span>
                </label>
                <input
                  type="text"
                  disabled
                  value={formatCurrency(subTotal - amountPaid)}
                  className={`w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    subTotal - amountPaid > 0
                      ? "border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 font-medium"
                      : "border-green-300 dark:border-green-600 text-green-600 dark:text-green-400 font-medium"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={updateSaleForm.customerName}
                onChange={(e) =>
                  setUpdateSaleForm({
                    ...updateSaleForm,
                    customerName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                placeholder="Enter customer name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer Phone
              </label>
              <input
                type="text"
                value={updateSaleForm.customerPhone}
                onChange={(e) =>
                  setUpdateSaleForm({
                    ...updateSaleForm,
                    customerPhone: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                placeholder="+92 XXX-XXXXXXX"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Date & Time
              </label>
              <input
                type="datetime-local"
                value={updateSaleForm.date.replace('Z', '')}
                onChange={(e) =>
                  setUpdateSaleForm({ ...updateSaleForm, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07-.34-.433-.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">New Payment Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Payment Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={updateSaleForm.paid}
                    onChange={(e) =>
                      setUpdateSaleForm({
                        ...updateSaleForm,
                        paid: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total After Payment
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formatCurrency(totalAfterPayment)}
                    className="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={updateSaleForm.paymentMethod}
                    onChange={(e) =>
                      setUpdateSaleForm({
                        ...updateSaleForm,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                    disabled={loading}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Mobile Wallet">Mobile Wallet</option>
                    <option value="Check">Check</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-md bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900 dark:to-green-900 border border-blue-100 dark:border-blue-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Remaining Balance After Payment:
                  </span>
                  <span
                    className={
                      remainingBalance > 0
                        ? "font-bold text-red-600 dark:text-red-400"
                        : "font-bold text-green-600 dark:text-green-400"
                    }
                  >
                    {formatCurrency(remainingBalance)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmPaymentUpdate}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white rounded-md hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 shadow-md hover:shadow-lg flex items-center disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {loading ? 'Updating...' : 'Update Payment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateSalePayment;
