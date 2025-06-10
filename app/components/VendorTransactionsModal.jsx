import React from 'react';
import VendorTransactionTable from './VendorTransactionTable';
function VendorTransactionsModal({
  vendor,
  onClose,
  getVendorPurchases,
  formatCurrency,
  calculateTotalSpent,
}) {
  const purchases = getVendorPurchases(vendor.id);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-2xl p-6 max-w-4xl w-full border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full text-white shadow-md mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{vendor.name}</h2>
              <p className="text-gray-500">Vendor Transaction History</p>
            </div>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-full text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Contact</div>
                <div className="text-sm font-medium">{vendor.phone}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-full text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Transactions</div>
                <div className="text-sm font-medium">{purchases.length} orders</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg shadow border border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500 p-2 rounded-full text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Total Spent</div>
                <div className="text-sm font-medium">{formatCurrency(calculateTotalSpent(vendor.id))}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-2 rounded-full text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 8a1 1 0 011.707-.707l3.586 3.586 3.586-3.586a1 1 0 111.414 1.414l-4.293 4.293a1 1 0 01-1.414 0L5 9.414V8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Balance Due</div>
                <div className="text-sm font-medium">
                  {formatCurrency(purchases.reduce((total, purchase) => total + purchase.due, 0))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {vendor.address && (
          <div className="mb-4 bg-gray-50 p-3 rounded-md border border-gray-200">
            <div className="text-sm text-gray-500">Address</div>
            <div className="text-sm">{vendor.address}</div>
          </div>
        )}

        {vendor.notes && (
          <div className="mb-4 bg-gray-50 p-3 rounded-md border border-gray-200">
            <div className="text-sm text-gray-500">Notes</div>
            <div className="text-sm">{vendor.notes}</div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Purchase History</h3>
            <div className="bg-blue-50 text-blue-800 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
              {purchases.length} transactions
            </div>
          </div>

          {purchases.length > 0 ? (
            <VendorTransactionTable
              purchases={purchases}
              formatCurrency={formatCurrency}
            />
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto text-gray-400 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-sm">No transactions recorded with this vendor.</p>
            </div>
          )}
        </div>

        <div className="border-t pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default VendorTransactionsModal;