import React from "react";
import { getProductById,products } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";
function SaleItemsTable({
  items,
  updateSaleItem,
  removeItemSale
}) {
  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th
                scope="col"
                className="py-3 pl-2 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:pl-3"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
              >
                Unit Price
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
              >
                Discount
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
              >
                Total
              </th>
              <th scope="col" className="relative py-3 pl-3 pr-2 w-12 sm:pr-3">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => {
              const product = item.productId
                ? getProductById(item.productId)
                : null;
              const itemPrice = parseFloat(item.price) || 0;
              const itemQuantity = parseFloat(item.quantity) || 0;
              const discountAmount = parseFloat(item.discount || 0);
              const itemTotal = itemQuantity * itemPrice - discountAmount;

              return (
                <tr key={index}>
                  <td className="py-2 pl-2 pr-3 sm:pl-3">
                    <select
                      required
                      value={item.productId}
                      onChange={(e) =>
                        updateSaleItem(index, "productId", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 w-24">
                    <input
                      type="number"
                      required
                      min="1"
                      max={product ? product.quantity : ""}
                      value={item.quantity}
                      onChange={(e) =>
                        updateSaleItem(index, "quantity", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      placeholder="Qty"
                    />
                    {product && (
                      <div className="text-xs text-gray-500 mt-1">
                        Stock: {product.quantity} {product.unit}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 w-32">
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        updateSaleItem(index, "price", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      placeholder="Price"
                    />
                  </td>
                  <td className="px-3 py-2 w-24">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.discount || ""}
                      onChange={(e) =>
                        updateSaleItem(index, "discount", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      placeholder="Discount"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 w-24">
                    {formatCurrency(itemTotal)}
                  </td>
                  <td className="py-2 pl-3 pr-2 whitespace-nowrap w-12 sm:pr-3">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeItemSale()}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-50"
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
                    )}
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
