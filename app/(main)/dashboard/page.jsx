'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Loading from '../../components/Loading';
import { formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('currentMonth');
  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    key: 'selection',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchSales(),
          fetchPurchases(),
          fetchCustomers(),
          fetchVendors(),
          fetchProducts(),
        ]);
      } catch (error) {
        console.error('Error during fetch:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const now = new Date();
    if (timePeriod === 'currentMonth') {
      setDateRange({
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
        key: 'selection',
      });
    } else if (timePeriod === 'last7Days') {
      setDateRange({
        startDate: subDays(now, 7),
        endDate: now,
        key: 'selection',
      });
    } else if (timePeriod === 'last30Days') {
      setDateRange({
        startDate: subDays(now, 30),
        endDate: now,
        key: 'selection',
      });
    } else if (timePeriod === 'lastMonth') {
      const lastMonth = subMonths(now, 1);
      setDateRange({
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth),
        key: 'selection',
      });
    }
  }, [timePeriod]);

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/sales');
      if (!response.ok) throw new Error('Failed to fetch sales');
      const data = await response.json();
      setSales(data);
    } catch (error) {
      toast.error('Failed to load sales');
      console.error('Error fetching sales:', error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchase');
      if (!response.ok) throw new Error('Failed to fetch purchases');
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      toast.error('Failed to load purchases');
      console.error('Error fetching purchases:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers');
      console.error('Error fetching customers:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors');
      if (!response.ok) throw new Error('Failed to fetch vendors');
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      toast.error('Failed to load vendors');
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error fetching products:', error);
    }
  };

  const recentSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    return saleDate >= dateRange.startDate && saleDate <= dateRange.endDate;
  });

  const recentPurchases = purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.date);
    return purchaseDate >= dateRange.startDate && purchaseDate <= dateRange.endDate;
  });

  const inventoryValue = products.reduce(
    (total, product) => total + (product.quantity * product.cost || 0),
    0
  );

  const customerDues = recentSales.reduce(
    (total, sale) => total + (sale.dueAmount || 0),
    0
  );

  const vendorDues = recentPurchases.reduce(
    (total, purchase) => total + (purchase.totalAmount - purchase.amountPaid || 0),
    0
  );

  const lowStockItems = products.filter(
    (product) => product.quantity <= (product.lowStockThreshold || 10)
  );

  const monthlySalesTotal = recentSales.reduce(
    (total, sale) => total + (sale.subTotal || 0),
    0
  );

  const getProductById = (id) => {
    return products.find((product) => product.id === id);
  };

  const openTransactionDetails = (transaction, type) => {
    setSelectedTransaction({ ...transaction, type });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTransaction(null);
  };

  const printInvoice = () => {
    alert('Printing invoice...');
    closeDialog();
  };

  const handleTimePeriodChange = (e) => {
    const value = e.target.value;
    setTimePeriod(value);
    if (value !== 'custom') {
      setShowDatePicker(false);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleDateRangeSelect = (ranges) => {
    setDateRange(ranges.selection);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timePeriod}
            onChange={handleTimePeriodChange}
            className="text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full focus:outline-none border border-gray-300 dark:border-gray-600"
          >
            <option value="currentMonth">Current Month</option>
            <option value="last7Days">Last 7 Days</option>
            <option value="last30Days">Last 30 Days</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
          <span className="text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600">
            {timePeriod === 'custom'
              ? `${format(dateRange.startDate, 'MMM d, yyyy')} - ${format(dateRange.endDate, 'MMM d, yyyy')}`
              : format(dateRange.startDate, 'MMMM yyyy')}
          </span>
        </div>
      </div>

      {showDatePicker && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-4 border border-gray-200 dark:border-gray-700">
          <DateRangePicker
            ranges={[dateRange]}
            onChange={handleDateRangeSelect}
            maxDate={new Date()}
            className="w-full"
          />
          <button
            onClick={() => setShowDatePicker(false)}
            className="mt-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Apply
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg shadow border border-blue-200 dark:border-blue-700">
          <div className="flex items-center">
            <div className="bg-blue-500 dark:bg-blue-600 p-2 rounded-full mr-3 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Inventory Value</h3>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(inventoryValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg shadow border border-green-200 dark:border-green-700">
          <div className="flex items-center">
            <div className="bg-green-500 dark:bg-green-600 p-2 rounded-full mr-3 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07-.34-.433-.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Sales Total</h3>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(monthlySalesTotal)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 p-4 rounded-lg shadow border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center">
            <div className="bg-yellow-500 dark:bg-yellow-600 p-2 rounded-full mr-3 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Customer Dues</h3>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{formatCurrency(customerDues)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-4 rounded-lg shadow border border-red-200 dark:border-red-700">
          <div className="flex items-center">
            <div className="bg-red-500 dark:bg-red-600 p-2 rounded-full mr-3 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Vendor Dues</h3>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{formatCurrency(vendorDues)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded-full mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-600 dark:text-yellow-200"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Low Stock Alerts</h2>
        </div>

        {lowStockItems.length > 0 ? (
          <div
            className="w-full overflow-auto scrollbar-thin"
            style={{
              maxWidth: '100vw',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <tr>
                  <th className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Current Stock</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Threshold</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {lowStockItems.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-red-600 dark:text-red-400 font-medium">
                      {product.quantity} {product.unit}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 dark:text-gray-300">
                      {product.lowStockThreshold} {product.unit}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm">
                      <Link
                        href="/inventory"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900 px-3 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors inline-flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
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
          <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            No low stock items at the moment.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Recent Sales</h2>
          </div>
          {recentSales.length > 0 ? (
            <div className="w-full overflow-auto scrollbar-thin" style={{ maxWidth: '100vw', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="w-full table-auto">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                  <tr>
                    <th className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {recentSales.map((sale) => (
                    <tr 
                      key={sale.id} 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => openTransactionDetails(sale, 'sale')}
                    >
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm text-gray-500 dark:text-gray-300">
                        {new Date(sale.date).toLocaleDateString('en-US')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {sale.customer?.name || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900 dark:text-white">
                        {formatCurrency(sale.subTotal)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${sale.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            sale.status === 'PARTIALLY_PAID' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                          {sale.status === 'COMPLETED' ? 'Paid' : 
                           sale.status === 'PARTIALLY_PAID' ? 'Partial' : 'Unpaid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              No sales recorded for this period.
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Recent Purchases</h2>
          </div>
          {recentPurchases.length > 0 ? (
            <div className="w-full overflow-auto scrollbar-thin" style={{ maxWidth: '100vw', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="w-full table-auto">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                  <tr>
                    <th className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vendor</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {recentPurchases.map((purchase) => {
                    const status = purchase.totalAmount <= purchase.amountPaid
                      ? 'COMPLETED'
                      : purchase.amountPaid > 0
                      ? 'PARTIALLY_PAID'
                      : 'PENDING';
                    return (
                      <tr 
                        key={purchase.id} 
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => openTransactionDetails(purchase, 'purchase')}
                      >
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm text-gray-500 dark:text-gray-300">
                          {new Date(purchase.date).toLocaleDateString('en-US')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {purchase.vendor?.name || 'Unknown'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900 dark:text-white">
                          {formatCurrency(purchase.totalAmount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                              status === 'PARTIALLY_PAID' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                            {status === 'COMPLETED' ? 'Paid' : 
                             status === 'PARTIALLY_PAID' ? 'Partial' : 'Unpaid'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              No purchases recorded for this period.
            </p>
          )}
        </div>
      </div>

      {isDialogOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedTransaction.type === 'sale' ? 'Sale' : 'Purchase'} Details
              </h2>
              <button onClick={closeDialog} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-300">Date:</span>
                <span className="text-gray-900 dark:text-white">{new Date(selectedTransaction.date).toLocaleDateString('en-US')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-300">
                  {selectedTransaction.type === 'sale' ? 'Customer:' : 'Vendor:'}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {selectedTransaction.type === 'sale' 
                    ? selectedTransaction.customer?.name || 'Unknown'
                    : selectedTransaction.vendor?.name || 'Unknown'}
                </span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">Items</h3>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedTransaction.saleItems?.map((item, index) => {
                      const product = getProductById(item.productId);
                      const price = item.unitPrice;
                      const total = item.total;
                      return (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {product ? product.name : item.productId}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {item.quantity} {product ? product.unit : ''}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {formatCurrency(price)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {formatCurrency(total)}
                          </td>
                        </tr>
                      );
                    }) || selectedTransaction.purchaseItems?.map((item, index) => {
                      const product = getProductById(item.productId);
                      const price = item.rate;
                      const total = item.total;
                      return (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {product ? product.name : item.productId}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {item.quantity} {product ? product.unit : ''}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {formatCurrency(price)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {formatCurrency(total)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-800 dark:text-white">Total:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(selectedTransaction.type === 'sale' ? selectedTransaction.subTotal : selectedTransaction.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-300">Paid:</span>
                  <span className="text-gray-900 dark:text-white">{formatCurrency(selectedTransaction.amountPaid)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-300">Due:</span>
                  <span className={(selectedTransaction.dueAmount > 0 || (selectedTransaction.totalAmount - selectedTransaction.amountPaid) > 0) ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}>
                    {formatCurrency(selectedTransaction.type === 'sale' ? selectedTransaction.dueAmount : (selectedTransaction.totalAmount - selectedTransaction.amountPaid))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-300">Status:</span>
                  <span className={`
                    ${selectedTransaction.status === 'COMPLETED' || (selectedTransaction.type === 'purchase' && selectedTransaction.totalAmount <= selectedTransaction.amountPaid) ? 'text-green-600 dark:text-green-400' : 
                      selectedTransaction.status === 'PARTIALLY_PAID' || (selectedTransaction.type === 'purchase' && selectedTransaction.amountPaid > 0) ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-red-600 dark:text-red-400'}`}>
                    {selectedTransaction.type === 'sale' 
                      ? (selectedTransaction.status === 'COMPLETED' ? 'Paid' : 
                         selectedTransaction.status === 'PARTIALLY_PAID' ? 'Partial' : 'Unpaid')
                      : (selectedTransaction.totalAmount <= selectedTransaction.amountPaid ? 'Paid' : 
                         selectedTransaction.amountPaid > 0 ? 'Partial' : 'Unpaid')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              {selectedTransaction.type === 'sale' && (
                <button
                  onClick={printInvoice}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Print Invoice
                </button>
              )}
              <button
                onClick={closeDialog}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
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