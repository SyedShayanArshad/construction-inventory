
'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';

function DetailPaymentHistoryTable({ paymentHistory }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-600">
      {/* Desktop Payment History */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <tr>
              <th
                scope="col"
                className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Date & Time
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Amount Paid
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Payment Method
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Balance After
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {paymentHistory.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 pl-4 pr-3 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(payment.date).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </td>
                <td className="px-3 py-3 text-sm font-medium text-green-600 dark:text-green-400">
                  +{formatCurrency(payment.amountPaid)}
                </td>
                <td className="px-3 py-3 text-sm text-gray-900 dark:text-gray-100 text-right">
                  {payment.paymentMethod}
                </td>
                <td className="px-3 py-3 text-sm font-medium text-right text-gray-900 dark:text-gray-100">
                  {formatCurrency(payment.balanceAfterPayment)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Payment History */}
      <div className="md:hidden p-4">
        <div className="space-y-4">
          {paymentHistory.map((payment) => (
            <div
              key={payment.id}
              className="border-b border-gray-200 dark:border-gray-600 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {new Date(payment.date).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  +{formatCurrency(payment.amountPaid)}
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span className="text-gray-500 dark:text-gray-300">Method:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{payment.paymentMethod}</span>
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span className="text-gray-500 dark:text-gray-300">Balance:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(payment.balanceAfterPayment)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailPaymentHistoryTable;