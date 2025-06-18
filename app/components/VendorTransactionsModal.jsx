import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import Loading from './Loading';
import toast from 'react-hot-toast';

function VendorTransactionsModal({ vendor, onClose, getVendorPurchases, formatCurrency }) {
  const [purchases, setPurchases] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [tab, setTab] = useState('purchases');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoadingPurchases(true);
        const purchasesData = await getVendorPurchases(vendor.id);
        console.log(`Purchases fetched for vendor ${vendor.id}:`, purchasesData);
        setPurchases(Array.isArray(purchasesData) ? purchasesData : []);
      } catch (error) {
        console.error('Error fetching purchases:', error);
        toast.error('Failed to load purchases');
        setPurchases([]);
      } finally {
        setLoadingPurchases(false);
      }
    };

    const fetchPayments = async () => {
      try {
        setLoadingPayments(true);
        const res = await fetch(`/api/vendors/payments/${vendor.id}`);
        if (!res.ok) throw new Error(`Failed to fetch payment history: ${res.status} ${res.statusText}`);
        const paymentsData = await res.json();
        console.log(`Payments fetched for vendor ${vendor.id}:`, paymentsData);
        setPaymentHistory(Array.isArray(paymentsData) ? paymentsData : []);
      } catch (error) {
        console.error('Error fetching payment history:', error);
        toast.error('Failed to load payment history');
        setPaymentHistory([]);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPurchases();
    fetchPayments();
  }, [vendor.id, getVendorPurchases]);

  // Sorting function
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = (data, key, direction) => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => {
      if (key === 'date') {
        return direction === 'asc'
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      return direction === 'asc' ? (a[key] || 0) - (b[key] || 0) : (b[key] || 0) - (a[key] || 0);
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <svg className="h-4 w-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="h-4 w-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const isLoading = tab === 'purchases' ? loadingPurchases : loadingPayments;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-2xl p-6 max-w-4xl w-full border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-full text-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{vendor.name} Transactions</h2>
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

        <div className="mb-4">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 text-sm font-medium ${tab === 'purchases' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setTab('purchases')}
            >
              Purchases
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${tab === 'payments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setTab('payments')}
            >
              Payment History
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loading />
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
            {tab === 'purchases' ? (
              purchases.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No purchases found for this vendor.</p>
              ) : (
                <table className="w-full table-auto">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                    <tr>
                      <th
                        className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('id')}
                      >
                        ID {renderSortIcon('id')}
                      </th>
                      <th
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('date')}
                      >
                        Date {renderSortIcon('date')}
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('totalAmount')}
                      >
                        Total {renderSortIcon('totalAmount')}
                      </th>
                      <th
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('amountPaid')}
                      >
                        Paid {renderSortIcon('amountPaid')}
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {sortedData(purchases, sortConfig.key, sortConfig.direction).map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                          #{purchase.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(purchase.date).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {purchase.purchaseItems?.length > 0 ? (
                            purchase.purchaseItems.map((item) => (
                              <div key={item.id}>
                                {item.product?.name || 'Unknown Product'} (x{item.quantity})
                              </div>
                            ))
                          ) : (
                            <div>No items</div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(purchase.totalAmount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-green-600">
                          {formatCurrency(purchase.amountPaid)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-red-600">
                          {formatCurrency(purchase.totalAmount - purchase.amountPaid)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              paymentHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No payment history found for this vendor.</p>
              ) : (
                <table className="w-full table-auto">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                    <tr>
                      <th
                        className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('id')}
                      >
                        ID {renderSortIcon('id')}
                      </th>
                      <th
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('date')}
                      >
                        Date {renderSortIcon('date')}
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount Paid
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Linked Purchases
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {sortedData(paymentHistory, sortConfig.key, sortConfig.direction).map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                          #{payment.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-green-600">
                          {formatCurrency(payment.amountPaid)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payment.duesStatus === 'CLEARED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {payment.duesStatus}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {payment.vendorPaymentPurchaseItems?.length > 0 ? (
                            payment.vendorPaymentPurchaseItems.map((item) => (
                              <div key={item.id}>
                                Purchase #{item.purchaseItem?.purchaseId || 'N/A'} (
                                {item.purchaseItem?.product?.name || 'Unknown'})
                              </div>
                            ))
                          ) : payment.purchase ? (
                            `Purchase #${payment.purchase.id}`
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorTransactionsModal;