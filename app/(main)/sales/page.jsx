'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddNewSaleModal from '../../components/AddNewSaleModal';
import UpdateSalePayment from '../../components/UpdateSalePayment';
import SaleDetailsModal from '../../components/SaleDetailsModal';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [showSaleDetailsModal, setShowSaleDetailsModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sales');
      if (!response.ok) throw new Error('Failed to fetch sales');
      const data = await response.json();
      setSales(data);
    } catch (error) {
      toast.error('Failed to load sales');
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter((sale) => {
    const customerName = sale.customer?.name || '';
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || new Date(sale.date).toISOString().includes(dateFilter);
    const status = sale.amountPaid >= sale.subTotal ? 'completed' :
                   sale.amountPaid > 0 ? 'partial' : 'unpaid';
    const matchesStatus = !statusFilter || status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const totalRevenue = filteredSales.reduce((total, sale) => total + Number(sale.subTotal || 0), 0);
  const totalOutstanding = filteredSales.reduce((total, sale) => total + Number(sale.dueAmount || 0), 0);
  const unpaidInvoices = filteredSales.filter(sale => Number(sale.dueAmount || 0) > 0).length;

  const viewSaleDetails = (sale) => {
    setSelectedSale(sale);
    setShowSaleDetailsModal(true);
  };

  const updateSalePayment = (sale) => {
    setSelectedSale(sale);
    setShowUpdatePaymentModal(true);
  };

  const deleteSale = (sale) => {
    setSaleToDelete(sale);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteSale = async () => {
    try {
      const response = await fetch(`/api/sales/${saleToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
      setSales(sales.filter(s => s.id !== saleToDelete.id));
      toast.success('Sale deleted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to delete sale');
    } finally {
      setShowDeleteConfirmModal(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 "><Loading /></div>;
  }

  return (
    <div className="space-y-6 min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Management</h1>
        <button
          onClick={() => setShowNewSaleModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white px-5 py-2.5 rounded-md hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 inline-flex items-center shadow-md hover:shadow-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Record New Sale
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-800 dark:text-white">Current Month Sales Summary</h2>
          </div>
          <Link href="/reports" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm inline-flex items-center bg-blue-50 dark:bg-blue-900/50 px-3 py-1.5 rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            View All Sales Reports
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg shadow border border-blue-200 dark:border-blue-700 flex items-center">
            <div className="bg-blue-500 dark:bg-blue-600 p-3 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Sales</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{filteredSales.length}</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg shadow border border-green-200 dark:border-green-700 flex items-center">
            <div className="bg-green-500 dark:bg-green-600 p-3 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07-.34-.433-.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 三 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-green-800 dark:text-green-200">Total Revenue</div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(totalRevenue)}</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 p-4 rounded-lg shadow border border-yellow-200 dark:border-yellow-700 flex items-center">
            <div className="bg-yellow-500 dark:bg-yellow-600 p-3 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Outstanding Balance</div>
              <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{formatCurrency(totalOutstanding)}</div>
              <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">{unpaidInvoices} unpaid invoices</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Filter Sales</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 transition-all hover:border-blue-300 dark:hover:border-blue-500">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name..."
                className="pl-10 w-full px-3 py-2 border-0 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 transition-colors"
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="relative bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 transition-all hover:border-blue-300 dark:hover:border-blue-500">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 w-full px-3 py-2 border-0 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 transition-colors"
              />
              {dateFilter && (
                <div className="absolute inset-y-0 right-8 flex items-center z-10">
                  <button 
                    onClick={() => setDateFilter('')}
                    className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="relative bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 transition-all hover:border-blue-300 dark:hover:border-blue-500">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 w-full px-3 py-2 border-0 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 transition-colors appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              {statusFilter && (
                <div className="absolute inset-y-0 right-8 flex items-center z-10">
                  <button 
                    onClick={() => setStatusFilter('')}
                    className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredSales.length === 0 ? 'No results found' : 
                filteredSales.length === 1 ? '1 sale found' : 
                `${filteredSales.length} sales found`}
            </div>
            
            <div className="flex items-center space-x-2">
              {(searchTerm || dateFilter || statusFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDateFilter('');
                    setStatusFilter('');
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Clear Filters
                </button>
              )}
              
              <Link href="/reports" className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-0 border border-gray-200 dark:border-gray-700">
        <div className="w-full overflow-auto scrollbar-thin" style={{ maxWidth: '100vw', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full table-auto">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <tr>
                <th scope="col" className="py-4 pl-4 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Paid</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative py-4 pl-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {filteredSales.map((sale) => {
                const status = sale.amountPaid >= sale.subTotal ? 'completed' :
                               sale.amountPaid > 0 ? 'partial' : 'unpaid';
                return (
                  <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(sale.date).toLocaleDateString('en-US')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white">
                      {sale.customer?.name || 'Walk-in Customer'}
                      {sale.customer?.phoneNumber && <div className="text-xs text-gray-500 dark:text-gray-300">{sale.customer.phoneNumber}</div>}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(sale.subTotal)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {formatCurrency(sale.amountPaid)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                      <span className={sale.dueAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}>
                        {formatCurrency(sale.dueAmount)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                          status === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 
                          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                        {status === 'completed' ? 'Paid' : 
                         status === 'partial' ? 'Partial' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-right text-sm font-medium px-3 py-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => viewSaleDetails(sale)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          title="View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => updateSalePayment(sale)}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                          title="Update payment"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteSale(sale)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showNewSaleModal && (
        <AddNewSaleModal
          onClose={() => setShowNewSaleModal(false)}
          onSubmit={fetchSales}
        />
      )}

      {showSaleDetailsModal && selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          onClose={() => setShowSaleDetailsModal(false)}
        />
      )}

      {showUpdatePaymentModal && selectedSale && (
        <UpdateSalePayment
          onClose={() => setShowUpdatePaymentModal(false)}
          selectedSale={selectedSale}
          onSubmit={fetchSales}
        />
      )}

      {showDeleteConfirmModal && saleToDelete && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-600">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 p-2 rounded-full text-white shadow-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Confirm Delete</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-red-800 dark:text-red-200">Warning</span>
                </div>
                <p className="text-sm ml-7">
                  Are you sure you want to delete this sale? This action cannot be undone and all associated data will be permanently removed.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Invoice Number:</div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">{saleToDelete.invoiceNumber}</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Customer:</div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {saleToDelete.customer?.name || 'Walk-in Customer'}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Amount:</div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">{formatCurrency(saleToDelete.subTotal)}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSale}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white rounded-md hover:from-red-700 hover:to-red-800 dark:hover:from-red-800 dark:hover:to-red-900 transition-colors shadow-md hover:shadow-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}