'use client';

import { useEffect, useState } from 'react';
import AddVendorModal from '../components/AddVendorModal';
import VendorTransactionsModal from '../components/VendorTransactionsModal';
import AddVendorPaymentModal from '../components/AddVendorPaymentModal';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

export default function Vendors() {
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [showEditVendorModal, setShowEditVendorModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vendors');
      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }
      const vendors = await response.json();
      setAllVendors(vendors);
    } catch (error) {
      toast.error('Failed to load vendors');
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Filtered vendors
  const filteredVendors = allVendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.phoneNumber && vendor.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddVendor = async (vendorData) => {
    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });
      if (response.ok) {
        toast.success('Vendor created successfully!');
        setShowAddVendorModal(false);
        fetchVendors();
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.error}`);
      }
    } catch (error) {
      toast.error('Failed to create vendor');
    }
  };

  const handleUpdateVendor = async (vendorData) => {
    try {
      const res = await fetch(`/api/vendors/${editingVendor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });
      if (res.ok) {
        toast.success('Vendor updated successfully!');
        setShowEditVendorModal(false);
        setEditingVendor(null);
        fetchVendors();
      } else {
        const error = await res.json();
        toast.error(`Error: ${error.error}`);
      }
    } catch (error) {
      toast.error('Failed to update vendor');
    }
  };

  const handleDeleteVendor = (vendor) => {
    setSelectedVendor(vendor);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteVendor = async () => {
    try {
      const res = await fetch(`/api/vendors/${selectedVendor.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success(`Vendor "${selectedVendor.name}" deleted successfully!`);
        fetchVendors();
      } else {
        const error = await res.json();
        toast.error(`Error: ${error.error}`);
      }
    } catch (error) {
      toast.error('Failed to delete vendor');
    }
    setShowDeleteConfirmModal(false);
    setSelectedVendor(null);
  };

  const viewTransactions = (vendor) => {
    setSelectedVendor(vendor);
    setShowTransactionsModal(true);
  };

  const handlePayVendor = (vendor) => {
    if (vendor.balance <= 0) {
      toast.error('No dues to pay for this vendor.');
      return;
    }
    setSelectedVendor(vendor);
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = async (paymentData) => {
    try {
      const response = await fetch('/api/vendors/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to record payment');
      }
      toast.success('Payment recorded successfully!');
      fetchVendors();
    } catch (error) {
      throw error; // Let AddVendorPaymentModal handle the error
    }
  };

  const getVendorPurchases = async (vendorId) => {
    try {
      const res = await fetch(`/api/purchase/${vendorId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch vendor purchases');
      }
      return await res.json();
    } catch (error) {
      throw error;
    }
  };

  // Calculate summary metrics from vendor data
  const totalPurchases = allVendors.reduce((sum, vendor) => sum + vendor.totalPurchases, 0);
  const totalTransactions = allVendors.reduce((sum, vendor) => sum + (vendor._count?.purchases || 0), 0);
  const totalBalanceDue = allVendors.reduce((sum, vendor) => sum + vendor.balance, 0);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-2xl font-bold">Vendor Management</h1>
            <button
              onClick={() => setShowAddVendorModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-md hover:from-blue-700 hover:to-blue-800 inline-flex items-center shadow-md hover:shadow-lg transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add New Vendor
            </button>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
                <h2 className="text-xl font-medium text-gray-800">Vendors Summary</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow border border-blue-200 flex items-center">
                <div className="bg-blue-500 p-3 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-800">Total Vendors</div>
                  <div className="text-2xl font-bold text-blue-900">{allVendors.length}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow border border-green-200 flex items-center">
                <div className="bg-green-500 p-3 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07-.34-.433-.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-green-800">Total Purchases</div>
                  <div className="text-2xl font-bold text-green-900">{formatCurrency(totalPurchases)}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg shadow border border-yellow-200 flex items-center">
                <div className="bg-yellow-500 p-3 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-yellow-800">Total Transactions</div>
                  <div className="text-2xl font-bold text-yellow-900">{totalTransactions}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow border border-red-200 flex items-center">
                <div className="bg-red-500 p-3 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-red-800">Total Balance Due</div>
                  <div className="text-2xl font-bold text-red-900">{formatCurrency(totalBalanceDue)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">Search Vendors</h3>
            </div>

            <div className="relative bg-gray-50 rounded-md border border-gray-200 transition-all hover:border-blue-300 mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or phone number..."
                className="pl-10 w-full px-3 py-2 border-0 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center mb-4">
              <div className="text-sm text-gray-500">
                {filteredVendors.length === 0
                  ? 'No vendors found'
                  : filteredVendors.length === 1
                  ? '1 vendor found'
                  : `${filteredVendors.length} vendors found`}
              </div>
            </div>

            <div
              className="w-full overflow-auto scrollbar-thin"
              style={{
                maxWidth: '100vw',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <table className="w-full table-auto">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="py-4 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Purchases
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Paid
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance Due
                    </th>
                    <th className="relative py-4 pl-3 pr-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {vendor.name}
                        {vendor.address && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {vendor.address}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {vendor.phoneNumber || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(vendor.totalPurchases)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {vendor._count.purchases} transactions
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-green-600">
                        {formatCurrency(vendor.amountPaid)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-red-600">
                        {formatCurrency(vendor.balance)}
                      </td>
                      <td className="whitespace-nowrap text-right text-sm font-medium px-3 py-4">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => viewTransactions(vendor)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 rounded-full hover:bg-blue-50"
                            title="View Transaction History"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setEditingVendor({ ...vendor });
                              setShowEditVendorModal(true);
                            }}
                            className="text-green-600 hover:text-green-800 transition-colors p-1.5 rounded-full hover:bg-green-50"
                            title="Edit Vendor"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(vendor)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1.5 rounded-full hover:bg-red-50"
                            title="Delete Vendor"
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
                          <button
                            onClick={() => handlePayVendor(vendor)}
                            className="text-green-600 hover:text-green-800 transition-colors p-1.5 rounded-full hover:bg-green-50"
                            title="Pay Vendor Dues"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07-.34-.433-.582a2.305 2.305 0 01-.567.267z" />
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Vendor Modal */}
          {showAddVendorModal && (
            <AddVendorModal
              onClose={() => setShowAddVendorModal(false)}
              onSubmit={handleAddVendor}
              mode="add"
            />
          )}
          {/* Edit Vendor Modal */}
          {showEditVendorModal && editingVendor && (
            <AddVendorModal
              onClose={() => setShowEditVendorModal(false)}
              onSubmit={handleUpdateVendor}
              vendor={editingVendor}
              mode="edit"
            />
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirmModal && selectedVendor && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-full text-white shadow-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-red-600">Confirm Deletion</h2>
                </div>

                <p className="mb-6 text-gray-700">
                  Are you sure you want to delete vendor{' '}
                  <span className="font-bold">{selectedVendor.name}</span>? This action cannot be undone.
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirmModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteVendor}
                    className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors flex items-center shadow-md hover:shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete Vendor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Transactions Modal */}
          {showTransactionsModal && selectedVendor && (
            <VendorTransactionsModal
              vendor={selectedVendor}
              onClose={() => setShowTransactionsModal(false)}
              getVendorPurchases={getVendorPurchases}
              formatCurrency={formatCurrency}
            />
          )}

          {/* Vendor Payment Modal */}
          {showPaymentModal && selectedVendor && (
            <AddVendorPaymentModal
              vendor={selectedVendor}
              onClose={() => {
                setShowPaymentModal(false);
                setSelectedVendor(null);
              }}
              onSubmit={handleSubmitPayment}
            />
          )}
        </>
      )}
    </div>
  );
}