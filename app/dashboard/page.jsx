'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  getTotalInventoryValue,
  getTotalCustomerDues,
  getTotalVendorDues,
  getLowStockItems,
  getCurrentMonthSales,
  getCurrentMonthPurchases,
  getCustomerById,
  getProductById
} from '../../lib/demo-data';

export default function Dashboard() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const inventoryValue = getTotalInventoryValue();
  const customerDues = getTotalCustomerDues();
  const vendorDues = getTotalVendorDues();
  const lowStockItems = getLowStockItems();
  const recentSales = getCurrentMonthSales();
  const recentPurchases = getCurrentMonthPurchases();
  
  // Calculate total monthly sales
  const monthlySalesTotal = recentSales.reduce((total, sale) => total + sale.total, 0);

  const openTransactionDetails = (transaction, type) => {
    setSelectedTransaction({ ...transaction, type });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTransaction(null);
  };

  const printInvoice = () => {
    // Simulation of printing function
    alert('Printing invoice...');
    closeDialog();
  };

  // Format currency in PKR format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ur-PK', { 
      style: 'currency', 
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow border border-blue-200">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Inventory Value</h3>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(inventoryValue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow border border-green-200">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-800">Monthly Sales</h3>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(monthlySalesTotal)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg shadow border border-yellow-200">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Customer Dues</h3>
              <p className="text-2xl font-bold text-yellow-900">{formatCurrency(customerDues)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow border border-red-200">
          <div className="flex items-center">
            <div className="bg-red-500 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Vendor Dues</h3>
              <p className="text-2xl font-bold text-red-900">{formatCurrency(vendorDues)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 p-2 rounded-full mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-800">Low Stock Alerts</h2>
        </div>
        {lowStockItems.length > 0 ? (
          <div className="w-full overflow-auto scrollbar-thin" style={{ maxWidth: '100vw', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-red-600 font-medium">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">{item.lowStockThreshold} {item.unit}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm">
                      <Link href="/inventory" className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Restock
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">No low stock items at the moment.</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Sales */}
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800">Recent Sales</h2>
          </div>
          {recentSales.length > 0 ? (
            <div className="w-full overflow-auto scrollbar-thin" style={{ maxWidth: '100vw', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="w-full table-auto">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentSales.map((sale) => {
                    const customer = getCustomerById(sale.customerId);
                    return (
                      <tr 
                        key={sale.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => openTransactionDetails(sale, 'sale')}
                      >
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm text-gray-500">
                          {new Date(sale.date).toLocaleDateString('en-US')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
                          {customer ? customer.name : 'Unknown'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
                          {formatCurrency(sale.total)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${sale.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              sale.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                            {sale.status === 'completed' ? 'Paid' : 
                             sale.status === 'partial' ? 'Partial' : 'Unpaid'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">No sales recorded this month.</p>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800">Recent Purchases</h2>
          </div>
          {recentPurchases.length > 0 ? (
            <div className="w-full overflow-auto scrollbar-thin" style={{ maxWidth: '100vw', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="w-full table-auto">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentPurchases.map((purchase) => (
                    <tr 
                      key={purchase.id} 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => openTransactionDetails(purchase, 'purchase')}
                    >
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm text-gray-500">
                        {new Date(purchase.date).toLocaleDateString('en-US')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
                        {purchase.vendorId}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
                        {formatCurrency(purchase.total)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${purchase.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            purchase.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                          {purchase.status === 'completed' ? 'Paid' : 
                           purchase.status === 'partial' ? 'Partial' : 'Unpaid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">No purchases recorded this month.</p>
          )}
        </div>
      </div>

      {/* Transaction Details Dialog */}
      {isDialogOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedTransaction.type === 'sale' ? 'Sale' : 'Purchase'} Details
              </h2>
              <button onClick={closeDialog} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span>{new Date(selectedTransaction.date).toLocaleDateString('en-US')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {selectedTransaction.type === 'sale' ? 'Customer:' : 'Vendor:'}
                </span>
                <span>
                  {selectedTransaction.type === 'sale' 
                    ? getCustomerById(selectedTransaction.customerId)?.name 
                    : selectedTransaction.vendorId}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedTransaction.items.map((item, index) => {
                      const product = getProductById(item.productId);
                      const price = selectedTransaction.type === 'sale' ? item.price : item.cost;
                      const total = price * item.quantity;
                      
                      return (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product ? product.name : item.productId}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity} {product ? product.unit : ''}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(price)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(total)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-medium">{formatCurrency(selectedTransaction.total)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Paid:</span>
                  <span>{formatCurrency(selectedTransaction.paid)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Due:</span>
                  <span className={selectedTransaction.due > 0 ? 'text-red-600' : ''}>
                    {formatCurrency(selectedTransaction.due)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`
                    ${selectedTransaction.status === 'completed' ? 'text-green-600' : 
                      selectedTransaction.status === 'partial' ? 'text-yellow-600' : 
                        'text-red-600'}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              {selectedTransaction.type === 'sale' && (
                <button
                  onClick={printInvoice}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Print Invoice
                </button>
              )}
              <button
                onClick={closeDialog}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 