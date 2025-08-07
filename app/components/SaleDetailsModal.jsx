
'use client';

import React from "react";
import DetailPaymentHistoryTable from "./DetailPaymentHistoryTable";
import DetailSaleItemTable from "./DetailSaleItemTable";
import { formatCurrency } from "@/lib/utils";
import { printInvoice } from "./printInvoice";

function SaleDetailsModal({ sale, onClose }) {
  if (!sale) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-gray-600 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 z-10">
          <div className="flex items-center">
            <div className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-full text-blue-600 dark:text-blue-400 shadow-sm mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              Invoice #{sale.invoiceNumber}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
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
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b border-blue-500 dark:border-blue-700 pb-6">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white p-3 rounded-md mr-2 shadow-md w-12 h-12 flex items-center justify-center">
                  <span className="font-bold text-xl">CM</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    TAX INVOICE
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">Javaid Building Material Shop</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm min-w-[200px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Invoice No:
                </div>
                <div className="text-sm font-semibold text-right text-gray-900 dark:text-white">
                  {sale.invoiceNumber}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Date:</div>
                <div className="text-sm font-medium text-right text-gray-900 dark:text-white">
                  {new Date(sale.date).toLocaleDateString("en-US")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Status:</div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      sale.amountPaid >= sale.subTotal
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : sale.amountPaid > 0
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {sale.amountPaid >= sale.subTotal
                      ? "Completed"
                      : sale.amountPaid > 0
                      ? "Partial"
                      : "Unpaid"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-500">
                From
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-800 dark:text-white font-medium">
                  Javaid Building Material Shop
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Chak No 11/1.A.L, Renala Khurd
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Okara, Pakistan</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">+92 300 1234567</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  info@buildingmaterial.pk
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-500">
                Bill To
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-800 dark:text-white font-medium">
                  {sale.customer?.name || "Walk-in Customer"}
                </p>
                {sale.customer?.phoneNumber && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {sale.customer.phoneNumber}
                  </p>
                )}
                {sale.customer?.address && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {sale.customer.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8 overflow-hidden">
            <DetailSaleItemTable items={sale.saleItems} />
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-full sm:w-72 space-y-3 bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(sale.subTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Amount Paid:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(sale.amountPaid)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                <span className="font-medium text-gray-700 dark:text-gray-300">Balance Due:</span>
                <span
                  className={
                    sale.dueAmount > 0
                      ? "font-bold text-red-600 dark:text-red-400"
                      : "font-bold text-green-600 dark:text-green-400"
                  }
                >
                  {formatCurrency(sale.dueAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Payment Details</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Status:</span>{" "}
                {sale.amountPaid >= sale.subTotal
                  ? "Paid"
                  : sale.amountPaid > 0
                  ? "Partially Paid"
                  : "Unpaid"}
              </p>
              {sale.paymentHistory && sale.paymentHistory.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  <span className="font-medium">Last Payment Method:</span>{" "}
                  {sale.paymentHistory[sale.paymentHistory.length - 1].paymentMethod}
                </p>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Notes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Thank you for your business! All goods once sold cannot be
                returned.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2"
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
              <DetailPaymentHistoryTable paymentHistory={sale.paymentHistory} />
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/50 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 text-sm text-yellow-800 dark:text-yellow-200">
                No payment records found. Update payment information to track
                payment history.
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="mt-4 md:mt-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This is a computer generated invoice and does not require a
                signature.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:space-x-3">
              <button
                onClick={() => {
                  printInvoice(sale);
                  window.print();
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-md hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition-colors shadow-md hover:shadow-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v5h6V4zm0 10H7v2h6v-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Print Invoice
              </button>
              <button
                onClick={() => printInvoice(sale)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white rounded-md hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 transition-colors shadow-md hover:shadow-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a2 2 0 100-4a1 1 0 011-1h12a1 1 0 110 2l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors flex items-center"
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
