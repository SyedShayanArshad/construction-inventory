import React, { useState } from "react";
import SaleItemsTable from "./SaleItemsTable";
import { formatCurrency } from "@/lib/utils";
function AddNewSaleModal({ onClose }) {
  const [newSale, setNewSale] = useState({
    customerName: "",
    customerPhone: "",
    items: [{ productId: "", quantity: "", price: "", discount: "" }],
    paid: "",
    date: new Date().toISOString().split("T")[0],
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 10000
    )
      .toString()
      .padStart(4, "0")}`,
    paymentMethod: "Cash",
  });

  const calculateSubtotal = () => {
    return newSale.items.reduce((total, item) => {
      if (item.productId && item.quantity && item.price) {
        const itemPrice = parseFloat(item.price);
        const itemQuantity = parseFloat(item.quantity);
        const discountAmount = parseFloat(item.discount || 0);
        const itemTotal = itemQuantity * itemPrice - discountAmount;
        return total + itemTotal;
      }
      return total;
    }, 0);
  };
  const subtotal = calculateSubtotal();
  const due = subtotal - (parseFloat(newSale.paid) || 0);
  const addItemToSale = () => {
    setNewSale({
      ...newSale,
      items: [
        ...newSale.items,
        { productId: "", quantity: "", price: "", discount: "" },
      ],
    });
  };
  const handleAddNewSale = (e) => {
    e.preventDefault();
    // In a real app, this would save to a database
    // Create a new sale object with appropriate ID and properties
    const sale = {
      id: newSale.invoiceNumber,
      customerName: newSale.customerName,
      customerPhone: newSale.customerPhone,
      items: newSale.items.map((item) => ({
        productId: item.productId,
        quantity: parseFloat(item.quantity),
        price: parseFloat(item.price),
        discount: parseFloat(item.discount || 0),
      })),
      total: subtotal,
      paid: parseFloat(newSale.paid) || 0,
      due: due,
      date: newSale.date,
      status: due <= 0 ? "completed" : due < subtotal ? "partial" : "unpaid",
      // Add payment history for tracking all payments
      paymentHistory:
        parseFloat(newSale.paid) > 0
          ? [
              {
                amount: parseFloat(newSale.paid),
                date: new Date().toISOString(),
                remainingBalance: due,
                paymentMethod: newSale.paymentMethod,
                notes: "Initial payment",
              },
            ]
          : [],
    };

    // Set the created sale as selected sale for viewing
    setSelectedSale(sale);

    // Add the new sale to the current month's sales
    setCurrentMonthSales([...currentMonthSales, sale]);

    // Close the new sale modal and open the sale details modal
    setShowNewSaleModal(false);
    setShowSaleDetailsModal(true);

    // Reset form for next use
    setNewSale({
      customerName: "",
      customerPhone: "",
      items: [{ productId: "", quantity: "", price: "", discount: "" }],
      paid: "",
      date: new Date().toISOString().split("T")[0],
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 10000
      )
        .toString()
        .padStart(4, "0")}`,
      paymentMethod: "Cash",
    });
  };
  const removeItemFromSale = (index) => {
    const updatedItems = [...newSale.items];
    updatedItems.splice(index, 1);
    setNewSale({
      ...newSale,
      items: updatedItems,
    });
  };
  const updateSaleItem = (index, field, value) => {
    const updatedItems = [...newSale.items];
    updatedItems[index][field] = value;

    // If product is changed, update price
    if (field === "productId" && value) {
      const product = getProductById(value);
      if (product) {
        updatedItems[index].price = product.price.toString();
      }
    }

    setNewSale({
      ...newSale,
      items: updatedItems,
    });
  };
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-gradient-to-b from-white to-gray-50 z-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-full text-white shadow-md mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800">New Sale</h3>
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

        <div className="p-4 sm:p-6">
          <form onSubmit={handleAddNewSale}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={newSale.customerName || ""}
                  onChange={(e) =>
                    setNewSale({ ...newSale, customerName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={newSale.customerPhone || ""}
                  onChange={(e) =>
                    setNewSale({ ...newSale, customerPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+92 XXX-XXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newSale.date}
                  onChange={(e) =>
                    setNewSale({ ...newSale, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  readOnly
                  value={newSale.invoiceNumber}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated invoice number
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Sale Items</h3>
                <button
                  type="button"
                  onClick={addItemToSale}
                  className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center bg-blue-50 px-2 py-1 rounded-md transition-colors"
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
                  Add Item
                </button>
              </div>

              <SaleItemsTable
                items={newSale.items}
                updateSaleItem={updateSaleItem}
                removeItemSale={removeItemFromSale}
              />
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-end">
                <div className="w-full sm:w-72 space-y-3 bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Subtotal:</span>
                    <span className="font-medium">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Amount Paid:</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newSale.paid}
                      onChange={(e) =>
                        setNewSale({ ...newSale, paid: e.target.value })
                      }
                      className="w-32 px-2 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Payment Method:</span>
                    <select
                      value={newSale.paymentMethod}
                      onChange={(e) =>
                        setNewSale({
                          ...newSale,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="w-32 px-2 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Mobile Wallet">Mobile Wallet</option>
                      <option value="Check">Check</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t border-blue-200">
                    <span className="text-gray-700">Due Amount:</span>
                    <span
                      className={
                        due > 0
                          ? "text-red-600 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      {formatCurrency(due)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Record Sale
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewSaleModal;
