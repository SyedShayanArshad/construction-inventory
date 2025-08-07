'use client';

import React from 'react';

function VendorTransactionTable({ purchases, formatCurrency }) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-600">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Items
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Total
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Paid
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Due
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
          {purchases.map((purchase) => {
            // Derive status based on payment
            const status =
              purchase.amountPaid >= purchase.totalAmount
                ? 'completed'
                : purchase.amountPaid > 0
                ? 'partial'
                : 'pending';
            const due = purchase.totalAmount - purchase.amountPaid;

            return (
              <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {new Date(purchase.date).toLocaleDateString('en-US')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">
                    {new Date(purchase.date).toLocaleTimeString('en-US')}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-100 space-y-1">
                    {purchase.purchaseItems.map((item, index) => (
                      <li key={index} className="truncate max-w-xs">
                        <span className="font-medium">{item.product.name}</span>
                        <span className="text-gray-500 dark:text-gray-300">
                          {' '}
                          ({item.quantity} x {formatCurrency(item.rate)})
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(purchase.totalAmount)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(purchase.amountPaid)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(due)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                          : status === 'partial'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                      }`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default VendorTransactionTable;