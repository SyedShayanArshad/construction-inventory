// app/components/AddVendorPaymentModal.js
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import Loading from './Loading';

function AddVendorPaymentModal({ vendor, onClose, onSubmit }) {
  const [paymentData, setPaymentData] = useState({
    date: new Date().toISOString().split('T')[0],
    amountPaid: '',
    notes: '',
    purchaseIds: [], // Array to store selected purchase IDs
  });
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPurchases, setFetchingPurchases] = useState(true);

  // Fetch pending purchases for the vendor
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setFetchingPurchases(true);
        const response = await fetch(`/api/purchases/${vendor.id}`);
        if (!response.ok) throw new Error('Failed to fetch purchases');
        const data = await response.json();
        // Filter purchases with outstanding balance
        const pendingPurchases = data.filter(
          (purchase) => purchase.totalAmount > purchase.amountPaid
        );
        setPurchases(pendingPurchases);
      } catch (error) {
        toast.error('Failed to load vendor purchases');
        console.error('Error fetching purchases:', error);
      } finally {
        setFetchingPurchases(false);
      }
    };
    fetchPurchases();
  }, [vendor.id]);

  // Calculate total selected purchases' outstanding amount
  const selectedPurchasesTotal = paymentData.purchaseIds.reduce((total, purchaseId) => {
    const purchase = purchases.find((p) => p.id === Number(purchaseId));
    return total + (purchase ? purchase.totalAmount - purchase.amountPaid : 0);
  }, 0);

  const handlePurchaseToggle = (purchaseId) => {
    setPaymentData((prev) => {
      const purchaseIds = prev.purchaseIds.includes(purchaseId)
        ? prev.purchaseIds.filter((id) => id !== purchaseId)
        : [...prev.purchaseIds, purchaseId];
      return { ...prev, purchaseIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmountPaid = Number(paymentData.amountPaid);

    // Validation
    if (numericAmountPaid <= 0) {
      toast.error('Payment amount must be greater than zero');
      return;
    }
    if (paymentData.purchaseIds.length > 0 && numericAmountPaid > selectedPurchasesTotal) {
      toast.error(`Payment amount exceeds selected purchases' dues (${formatCurrency(selectedPurchasesTotal)})`);
      return;
    }
    if (numericAmountPaid > vendor.balance) {
      toast.error(`Payment amount exceeds vendor balance (${formatCurrency(vendor.balance)})`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...paymentData,
        vendorId: vendor.id,
        amountPaid: numericAmountPaid,
        purchaseIds: paymentData.purchaseIds.map(Number),
      });
      toast.success('Payment recorded successfully!');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-2xl p-6 max-w-lg w-full border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-full text-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            </div>
            <h2 className="text-xl font-bold text-gray-800">Pay Vendor: {vendor.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input
              type="date"
              required
              value={paymentData.date}
              onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Paid{' '}
              <span className="text-xs text-gray-500">
                (Vendor Balance: {formatCurrency(vendor.balance)})
              </span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={paymentData.amountPaid}
              onChange={(e) => setPaymentData({ ...paymentData, amountPaid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter amount paid"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apply to Purchases{' '}
              <span className="text-xs text-gray-500">Optional</span>
            </label>
            {fetchingPurchases ? (
              <div className="flex justify-center">
                <Loading />
              </div>
            ) : purchases.length === 0 ? (
              <p className="text-sm text-gray-500">No pending purchases found</p>
            ) : (
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md bg-gray-50 p-2">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center space-x-3 py-2 px-3 hover:bg-gray-100 rounded">
                    <input
                      type="checkbox"
                      checked={paymentData.purchaseIds.includes(purchase.id)}
                      onChange={() => handlePurchaseToggle(purchase.id)}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Purchase #{purchase.id} - {new Date(purchase.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Due: {formatCurrency(purchase.totalAmount - purchase.amountPaid)} / Total:{' '}
                        {formatCurrency(purchase.totalAmount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {paymentData.purchaseIds.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Total Selected Dues: {formatCurrency(selectedPurchasesTotal)}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes <span className="text-xs text-gray-500">Optional</span>
            </label>
            <textarea
              rows="3"
              value={paymentData.notes}
              onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Additional notes about this payment"
            />
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 text-white rounded-md transition-colors flex items-center shadow-md hover:shadow-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
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
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {loading ? 'Processing...' : 'Record Payment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVendorPaymentModal;