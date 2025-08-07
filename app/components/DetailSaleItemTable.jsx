'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';

function DetailSaleItemTable({ items }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-600">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <th
                scope="col"
                className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Item
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Qty
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Unit Price
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Discount
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-600">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.product.name}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300 text-center">
                  {item.quantity}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300 text-right">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300 text-right">
                  {item.discount > 0 ? formatCurrency(item.discount) : '-'}
                </td>
                <td className="px-3 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden p-4">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-600 pb-3">
              <div className="font-medium text-gray-900 dark:text-gray-100">{item.product.name}</div>
              <div className="flex justify-between mt-1">
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(item.total)}</div>
              </div>
              {item.discount > 0 && (
                <div className="text-xs text-right text-green-600 dark:text-green-400 mt-1">
                  Discount: {formatCurrency(item.discount)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailSaleItemTable;