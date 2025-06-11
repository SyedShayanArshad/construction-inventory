import React from 'react';
import { formatCurrency } from '@/lib/utils';
function DetailPaymentHistoryTable({ paymentHistory }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg overflow-hidden shadow-md border border-gray-200">
      {/* Desktop Payment History */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount Paid
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Before Payment
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance After Payment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentHistory.map((payment, index) => {
              const dueBeforePayment = payment.remainingBalance + payment.amount;

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 pl-4 pr-3 text-sm text-gray-900">
                    {new Date(payment.date).toLocaleString('en-US')}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-green-600">
                    +{formatCurrency(payment.amount)}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-right text-red-600">
                    {formatCurrency(dueBeforePayment)}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-right text-gray-900">
                    {formatCurrency(payment.remainingBalance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Payment History */}
      <div className="md-hidden p-4">
        <div className="space-y-4">
          {paymentHistory.map((payment, index) => {
            const dueBeforePayment = payment.remainingBalance + payment.amount;

            return (
              <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between">
                  <div className="text-sm text-gray-500">
                    {new Date(payment.date).toLocaleString('en-US')}
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    +{formatCurrency(payment.amount)}
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span className="text-gray-500">Due Before:</span>
                  <span className="font-medium text-red-600">{formatCurrency(dueBeforePayment)}</span>
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span className="text-gray-500">Balance After:</span>
                  <span className="font-medium">{formatCurrency(payment.remainingBalance)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DetailPaymentHistoryTable;