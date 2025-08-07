'use client';

import React, { useState } from 'react';

function AddVendorModal({ onClose, onSubmit, vendor = null, mode = 'add' }) {
  const isEditMode = mode === 'edit';
  const [formData, setFormData] = useState(
    vendor || {
      name: '',
      phoneNumber: '',
      address: '',
      notes: '',
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditMode) {
      setFormData({
        name: '',
        phoneNumber: '',
        address: '',
        notes: '',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-2xl p-6 max-w-2xl w-full border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full text-white shadow-md bg-gradient-to-br ${
                isEditMode ? 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700' : 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                {isEditMode ? (
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                ) : (
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                )}
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {isEditMode ? `Edit Vendor: ${formData.name}` : 'Add New Vendor'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor Name <b>*</b></label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  isEditMode ? 'focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400' : 'focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400'
                }`}
                placeholder="Enter vendor company name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  isEditMode ? 'focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400' : 'focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400'
                }`}
                placeholder="Enter phone number (optional)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address <span className="text-xs text-gray-500 dark:text-gray-400">Optional</span>
              </label>
              <textarea
                rows="2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  isEditMode ? 'focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400' : 'focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400'
                }`}
                placeholder="Enter vendor address (optional)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes <span className="text-xs text-gray-500 dark:text-gray-400">Optional</span>
              </label>
              <textarea
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  isEditMode ? 'focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400' : 'focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400'
                }`}
                placeholder="Additional information about this vendor"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-2">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2.5 text-white rounded-md transition-colors flex items-center shadow-md hover:shadow-lg bg-gradient-to-r ${
                  isEditMode
                    ? 'from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900'
                    : 'from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  {isEditMode ? (
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
                {isEditMode ? 'Update Vendor' : 'Add Vendor'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVendorModal;