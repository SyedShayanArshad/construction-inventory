
'use client';

import React, { useState, useEffect } from "react";
import SaleItemsTable from "./SaleItemsTable";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import Loading from "./Loading";

function AddNewSaleModal({ onClose, onSubmit }) {
  const [newSale, setNewSale] = useState({
    customerId: "",
    customerName: "",
    customerPhone: "",
    items: [{ productId: "", quantity: "", unitPrice: "", discount: "" }],
    paid: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "CASH",
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCustomer, setSearchCustomer] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersRes, productsRes] = await Promise.all([
          fetch("/api/customers"),
          fetch("/api/sales/purchaseItems"),
        ]);

        if (!customersRes.ok || !productsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const customersData = await customersRes.json();
        const productsData = await productsRes.json();

        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        toast.error("Failed to load customers or products");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateSubtotal = () => {
    return newSale.items.reduce((total, item) => {
      if (item.productId && item.quantity && item.unitPrice) {
        const itemTotal = item.quantity * item.unitPrice - (item.discount || 0);
        return total + itemTotal;
      }
      return total;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const due = subtotal - (Number(newSale.paid) || 0);

  const addItemToSale = () => {
    setNewSale({
      ...newSale,
      items: [
        ...newSale.items,
        { productId: "", quantity: "", unitPrice: "", discount: "" },
      ],
    });
  };

  const removeItemFromSale = (index) => {
    const updatedItems = [...newSale.items];
    updatedItems.splice(index, 1);
    setNewSale({ ...newSale, items: updatedItems });
  };

  const updateSaleItem = (index, field, value) => {
    const updatedItems = [...newSale.items];
    updatedItems[index][field] = value;

    if (field === "productId" && value) {
      const product = products.find((p) => p.id === Number(value));
      if (product) {
        updatedItems[index].unitPrice = product.price.toString();
        updatedItems[index].quantity = updatedItems[index].quantity || "1";
      }
    }

    setNewSale({ ...newSale, items: updatedItems });
  };

  const isFormValid = () => {
    const hasValidItems = newSale.items.some(
      (item) =>
        item.productId &&
        Number(item.productId) > 0 &&
        item.quantity &&
        Number(item.quantity) > 0 &&
        item.unitPrice &&
        Number(item.unitPrice) > 0
    );
    return newSale.customerName && newSale.date && hasValidItems;
  };

  const handleAddNewSale = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const items = newSale.items.filter(
        (item) =>
          item.productId &&
          Number(item.productId) > 0 &&
          item.quantity &&
          Number(item.quantity) > 0 &&
          item.unitPrice &&
          Number(item.unitPrice) > 0
      );

      if (items.length === 0) {
        throw new Error("At least one valid item is required");
      }

      const saleData = {
        customerId: newSale.customerId ? Number(newSale.customerId) : null,
        customerName: newSale.customerName,
        customerPhone: newSale.customerPhone,
        date: newSale.date,
        items: items.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          discount: Number(item.discount) || 0,
        })),
        paid: newSale.paid,
        paymentMethod: newSale.paymentMethod,
      };

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      toast.success("Sale recorded successfully!");
      onSubmit();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to record sale");
      console.error("Error recording sale:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-gray-600 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 z-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-2 rounded-full text-white shadow-md mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">New Sale</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
            disabled={loading}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Customer
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchCustomer}
                    onChange={(e) => {
                      setSearchCustomer(e.target.value);
                      setNewSale({
                        ...newSale,
                        customerId: "",
                        customerName: e.target.value,
                        customerPhone: "",
                      });
                    }}
                    placeholder="Search or enter customer name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                    required
                  />
                  {searchCustomer && filteredCustomers.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md mt-1 max-h-40 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <li
                          key={customer.id}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
                          onClick={() => {
                            setNewSale({
                              ...newSale,
                              customerId: customer.id,
                              customerName: customer.name,
                              customerPhone: customer.phoneNumber || "",
                            });
                            setSearchCustomer("");
                          }}
                        >
                          {customer.name}{" "}
                          {customer.phoneNumber && `(${customer.phoneNumber})`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={newSale.customerPhone}
                  onChange={(e) =>
                    setNewSale({ ...newSale, customerPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                  placeholder="+92 XXX-XXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newSale.date}
                  onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900 dark:text-white">Sale Items</h3>
                <button
                  type="button"
                  onClick={addItemToSale}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm inline-flex items-center bg-blue-50 dark:bg-blue-900/50 px-2 py-1 rounded-md transition-colors"
                  disabled={loading}
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
                products={products}
                updateSaleItem={updateSaleItem}
                removeItemSale={removeItemFromSale}
                disabled={loading}
              />
            </div>

            <div className="border-t pt-4 mb-6 border-gray-200 dark:border-gray-600">
              <div className="flex justify-end">
                <div className="w-full sm:w-72 space-y-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-5 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-blue-200">Subtotal:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-blue-200">Amount Paid:</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newSale.paid}
                      onChange={(e) => setNewSale({ ...newSale, paid: e.target.value })}
                      className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                      placeholder="0.00"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-blue-200">Payment Method:</span>
                    <select
                      value={newSale.paymentMethod}
                      onChange={(e) =>
                        setNewSale({ ...newSale, paymentMethod: e.target.value })
                      }
                      className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                      disabled={loading}
                    >
                      <option value="CASH">Cash</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="ONLINE">Online</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t border-blue-200 dark:border-blue-700">
                    <span className="text-gray-700 dark:text-blue-200">Due Amount:</span>
                    <span
                      className={
                        due > 0 ? "text-red-600 dark:text-red-400 font-bold" : "text-green-600 dark:text-green-400 font-bold"
                      }
                    >
                      {formatCurrency(due)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end space-x-3 border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-md hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition-colors shadow-md hover:shadow-lg flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
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
                )}
                {loading ? "Recording..." : "Record Sale"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewSaleModal;