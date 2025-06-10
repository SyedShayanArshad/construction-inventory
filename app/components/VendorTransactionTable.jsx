import React from 'react';
import { getProductById } from '@/lib/demo-data';
function VendorTransactionTable({ purchases, formatCurrency }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paid
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {purchases.map((purchase) => (
            <tr key={purchase.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-medium">
                  {new Date(purchase.date).toLocaleDateString('en-US')}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(purchase.date).toLocaleTimeString('en-US')}
                </div>
              </td>
              <td className="px-4 py-3">
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                  {purchase.items.map((item, index) => {
                    const product = getProductById(item.productId);
                    return (
                      <li key={index} className="truncate max-w-xs">
                        <span className="font-medium">{product ? product.name : item.productId}</span>
                        <span className="text-gray-500">
                          {' '}
                          ({item.quantity} x {formatCurrency(item.cost)})
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(purchase.total)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-green-600">
                  {formatCurrency(purchase.paid)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-red-600">
                  {formatCurrency(purchase.due)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      purchase.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : purchase.status === 'partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                >
                  {purchase.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VendorTransactionTable;