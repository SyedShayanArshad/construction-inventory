import React from "react";
import DetailPaymentHistoryTable from "./DetailPaymentHistoryTable";
import DetailSaleItemTable from "./DetailSaleItemTable";
import { formatCurrency } from "@/lib/utils";
import { getCustomerById } from "@/lib/demo-data";
import { printInvoice } from "./printInvoice";
function SaleDetailsModal({
  sale,
  onClose,
}) {
  if (!sale) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl border-gray-200 border max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-gradient-to-b from-white to-gray-50 z-10">
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600 shadow-sm mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2a2 2 0 01-2v2-4zm2 6a2 6a2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800">
              Invoice #{sale.id}
            </h3>
          </div>
          <button
            type="button"
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

        <div className="p-4 sm:p-6">
          {/* Invoice Header */}
          <div className="flex-col md:flex-row sm:flex justify-between items-start mb-8 border-b border-blue pb-500-6">
            <div className="mb-4 mb:0 md:mb-0">
              <div className="flex items-center">
                <div className="bg-blue-500 to-blue-600 text-white p-3 rounded-md-xl mr-200 shadow-md w-12 h-12 flex items-center">
                  <span className="font-bold text-xl">CM</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    TAX INVOICE
                  </h2>
                  <p className="text-gray-600">Manzoor Construction Material</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg border-gray-200 bg-white p-4 shadow-sm min-w-[200px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-sm text-gray-600 font-medium">
                  Invoice No:
                </div>
                <div className="text-sm font-semibold text-right">
                  {sale.id}
                </div>

                <div className="text-sm text-gray-600 font-medium">Date:</div>
                <div className="text-sm font-medium text-right">
                  {new Date(sale.date).toLocaleDateString("en-US")}
                </div>

                <div className="text-sm text-gray-600 font-medium">Status:</div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      sale.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : sale.status === "partial"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Business and Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b">
                From
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-800 font-medium">
                  Manzoor Construction Material
                </p>
                <p className="text-sm text-gray-600">
                  Chak No 11/1.A.L, Renala Khurd
                </p>
                <p className="text-sm text-gray-600">Okara, Pakistan</p>
                <p className="text-sm text-gray-600">+92 300 1234567</p>
                <p className="text-sm text-gray-600">
                  info@constructionshop.pk
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b">
                Bill To
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-800 font-medium">
                  {sale.customerName ||
                    getCustomerById(sale.customerId)?.name ||
                    "Walk-in Customer"}
                </p>
                {sale.customerPhone && (
                  <p className="text-sm text-gray-600">{sale.customerPhone}</p>
                )}
                {getCustomerById(sale.customerId)?.address && (
                  <p className="text-sm text-gray-600">
                    {getCustomerById(sale.customerId)?.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-hidden">
            <DetailSaleItemTable
              items={sale.items}
            />
          </div>

          {/* Invoice Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-full sm:w-72 space-y-3 bg-gray-50 p-5 rounded-lg border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(sale.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Amount Paid:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(sale.paid)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="font-medium text-gray-700">Balance Due:</span>
                <span
                  className={
                    sale.due > 0
                      ? "font-bold text-red-600"
                      : "font-bold text-green-600"
                  }
                >
                  {formatCurrency(sale.due)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
              <h3 className="font-bold text-gray-800 mb-2">Payment Details</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>{" "}
                {sale.status === "completed"
                  ? "Paid"
                  : sale.status === "partial"
                  ? "Partially Paid"
                  : "Unpaid"}
              </p>
              {sale.paymentHistory && sale.paymentHistory.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Last Payment Method:</span>{" "}
                  {
                    sale.paymentHistory[sale.paymentHistory.length - 1]
                      .paymentMethod
                  }
                </p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
              <h3 className="font-bold text-gray-800 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">
                Thank you for your business! All goods once sold cannot be
                returned.
              </p>
            </div>
          </div>

          {/* Payment History Section */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              Payment History
            </h3>

            {sale.paymentHistory && sale.paymentHistory.length > 0 ? (
              <DetailPaymentHistoryTable
                paymentHistory={sale.paymentHistory}
              />
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                No payment records found. Update payment information to track
                payment history.
              </div>
            )}
          </div>

          {/* Footer & Buttons */}
          <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center pt-4 border-t border-gray-200">
            <div className="mt-4 md:mt-0">
              <p className="text-xs text-gray-500">
                This is a computer generated invoice and does not require a
                signature.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:space-x-3">
              <button
                onClick={()=>printInvoice(sale)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md hover:shadow-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm2 6a1 1 0 011-1h6a1 1 0 100-2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                Print Invoice
              </button>
              <button
                onClick={()=>printInvoice(sale)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors shadow-md hover:shadow-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors text-gray-600 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleDetailsModal;
