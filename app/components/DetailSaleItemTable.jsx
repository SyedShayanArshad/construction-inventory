import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { getProductById } from '@/lib/demo-data';
function DetailSaleItemTable({ items }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {items.map((item, index) => {
              const product = getProductById(item.productId);
              const discountAmount = parseFloat(item.discount || 0);
              const itemTotal = item.quantity * item.price - discountAmount;

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {product ? product.name : item.productId}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 text-center">
                    {item.quantity} {product ? product.unit : ''}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 text-right">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 text-right">
                    {discountAmount > 0 ? formatCurrency(discountAmount) : '-'}
                  </td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(itemTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden p-4">
        <div className="space-y-4">
          {items.map((item, index) => {
            const product = getProductById(item.productId);
            const discountAmount = parseFloat(item.discount || 0);
            const itemTotal = item.quantity * item.price - discountAmount;

            return (
              <div key={index} className="border-b border-gray-200 pb-3">
                <div className="font-medium">{product ? product.name : item.productId}</div>
                <div className="flex justify-between mt-1">
                  <div className="text-sm text-gray-500">
                    {item.quantity} {product ? product.unit : ''} × {formatCurrency(item.price)}
                  </div>
                  <div className="text-sm font-medium">{formatCurrency(itemTotal)}</div>
                </div>
                {discountAmount > 0 && (
                  <div className="text-xs text-right text-green-600 mt-1">
                    Discount: {formatCurrency(discountAmount)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DetailSaleItemTable;