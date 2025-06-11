import React,{useState} from "react";
import { formatCurrency } from "@/lib/utils";
function UpdateSalePayment({ onClose, selectedSale,  }) {
  const [updateSaleForm, setUpdateSaleForm] = useState({
     paid: 0, // Initialize with 0 for new payment amount
      customerName: selectedSale.customerName || '',
      customerPhone: selectedSale.customerPhone || '',
      date: new Date().toISOString().slice(0, 16),
      paymentMethod: 'Cash' // Default payment method
  });
  const confirmPaymentUpdate = () => {
    // In a real app, this would update in a database
    // const updatedSales = sales.map(sale => {
    //   if (sale.id === selectedSale.id) {
    //     // Calculate new total paid amount (existing paid + new payment)
    //     const previousPaid = parseFloat(selectedSale.paid) || 0;
    //     const newPaymentAmount = parseFloat(updateSaleForm.paid) || 0;
    //     const totalPaidAmount = previousPaid + newPaymentAmount;
        
    //     const updatedSale = {
    //       ...sale,
    //       paid: totalPaidAmount,
    //       customerName: updateSaleForm.customerName,
    //       customerPhone: updateSaleForm.customerPhone,
    //       date: updateSaleForm.date
    //     };
        
    //     // Recalculate due amount
    //     updatedSale.due = updatedSale.total - updatedSale.paid;
        
    //     // Update status based on payment
    //     if (updatedSale.due <= 0) {
    //       updatedSale.status = 'completed';
    //     } else if (updatedSale.paid > 0) {
    //       updatedSale.status = 'partial';
    //     } else {
    //       updatedSale.status = 'unpaid';
    //     }
        
    //     // Add to payment history if it's an additional payment
    //     if (newPaymentAmount > 0) {
    //       // Initialize payment history array if it doesn't exist
    //       if (!updatedSale.paymentHistory) {
    //         updatedSale.paymentHistory = [];
    //       }
          
    //       // Add new payment record
    //       updatedSale.paymentHistory.push({
    //         amount: newPaymentAmount,
    //         date: new Date().toISOString(),
    //         remainingBalance: updatedSale.due,
    //         paymentMethod: updateSaleForm.paymentMethod,
    //         notes: 'Additional payment'
    //       });
    //     }
        
    //     // Update the selected sale as well to reflect changes immediately
    //     setSelectedSale(updatedSale);
        
    //     return updatedSale;
    //   }
    //   return sale;
    // });
    
    // setSales(updatedSales);
    // setCurrentMonthSales(getCurrentMonthSales());
    // setShowUpdatePaymentModal(false);
  };
  const totalAfterPayment =
    parseFloat(selectedSale.paid) + parseFloat(updateSaleForm.paid || 0);
  const remainingBalance = parseFloat(selectedSale.total) - totalAfterPayment;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-2xl p-6 max-w-xl w-full border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-full text-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Update Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sale Total
              </label>
              <input
                type="text"
                disabled
                value={formatCurrency(selectedSale.total)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Already Paid
              </label>
              <input
                type="text"
                disabled
                value={formatCurrency(selectedSale.paid)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span
                  className={
                    selectedSale.due > 0
                      ? "text-red-600 font-medium"
                      : "text-green-600 font-medium"
                  }
                >
                  Remaining Balance
                </span>
              </label>
              <input
                type="text"
                disabled
                value={formatCurrency(selectedSale.due)}
                className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${
                  selectedSale.due > 0
                    ? "border-red-300 text-red-600 font-medium"
                    : "border-green-300 text-green-600 font-medium"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={updateSaleForm.customerName}
              onChange={(e) =>
                setUpdateSaleForm({
                  ...updateSaleForm,
                  customerName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Phone
            </label>
            <input
              type="text"
              value={updateSaleForm.customerPhone}
              onChange={(e) =>
                setUpdateSaleForm({
                  ...updateSaleForm,
                  customerPhone: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="+92 XXX-XXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Date & Time
            </label>
            <input
              type="datetime-local"
              value={updateSaleForm.date.replace("Z", "")}
              onChange={(e) =>
                setUpdateSaleForm({ ...updateSaleForm, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="md:col-span-2 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              <h4 className="font-medium text-blue-800">
                New Payment Information
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Payment Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={updateSaleForm.paid}
                  onChange={(e) =>
                    setUpdateSaleForm({
                      ...updateSaleForm,
                      paid: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total After Payment
                </label>
                <input
                  type="text"
                  disabled
                  value={formatCurrency(totalAfterPayment)}
                  className="w-full px-3 py-2 border border-green-300 rounded-md bg-green-50 text-green-600 font-medium"
                />
              </div>
            </div>

            <div className="mt-4 p-3 rounded-md bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Remaining Balance After Payment:
                </span>
                <span
                  className={
                    remainingBalance > 0
                      ? "font-bold text-red-600"
                      : "font-bold text-green-600"
                  }
                >
                  {formatCurrency(remainingBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmPaymentUpdate}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Update Sale
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateSalePayment;
