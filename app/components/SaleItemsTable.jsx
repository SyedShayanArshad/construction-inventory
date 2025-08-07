'use client';

import React from "react";
import { formatCurrency } from "@/lib/utils";

function SaleItemsTable({ items, products, updateSaleItem, removeItemSale, disabled }) {
  return (
    <div className="rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-600">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <tr>
              <th
                scope="col"
                className="py-3 pl-2 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sm:pl-3"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24"
              >
                Unit Price
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24"
              >
                Discount
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24"
              >
                Total
              </th>
              <th scope="col" className="relative py-3 pl-3 pr-2 w-12 sm:pr-3">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {items.map((item, index) => {
              const product = products.find((p) => p.id == item.productId);
              const itemQuantity = parseFloat(item.quantity) || 0;
              const itemPrice = parseFloat(item.unitPrice) || 0;
              const discountAmount = parseFloat(item.discount || 0);
              const itemTotal = itemQuantity * itemPrice - discountAmount;

              return (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-2 pl-2 pr-3 sm:pl-3">
                    <select
                      required
                      value={item.productId}
                      onChange={(e) => updateSaleItem(index, "productId", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 transition-colors text-sm"
                      disabled={disabled}
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({formatCurrency(product.price)})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 w-24">
                    <input
                      type="number"
                      required
                      min="1"
                      max={product ? product.stock : ""}
                      value={item.quantity}
                      onChange={(e) => updateSaleItem(index, "quantity", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors text-sm"
                      placeholder="Qty"
                      disabled={disabled}
                    />
                    {product && (
                      <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                        Stock: {product.stock}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 w-24">
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateSaleItem(index, "unitPrice", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors text-sm"
                      placeholder="Price"
                      disabled={disabled}
                    />
                  </td>
                  <td className="px-3 py-2 w-24">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.discount || ""}
                      onChange={(e) => updateSaleItem(index, "discount", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors text-sm"
                      placeholder="Discount"
                      disabled={disabled}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white w-24">
                    {formatCurrency(itemTotal)}
                  </td>
                  <td className="py-2 pl-3 pr-2 whitespace-nowrap w-12 sm:pr-3">
                    <button
                      type="button"
                      onClick={() => removeItemSale(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50"
                      disabled={disabled || items.length === 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SaleItemsTable;