import React from "react";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

function AddNewPurchaseModel({ onClose, product }) {
    const [newPurchase, setNewPurchase] = useState({
        date: new Date().toISOString().split("T")[0],
        vendorId: product?.vendorId || "",
        productId: product?.id || "",
        quantity: "",
        rate: product?.cost?.toString() || "",
        sellingRate: product?.sellingRate || "",
        totalAmount: "",
        amountPaid: "",
    });
    const [AllProducts, setAllProducts] = useState([]);
    const [AllVendors, setAllVendors] = useState([]);

    const handleNewPurchase = async (e) => {
        e.preventDefault();
        const response = await fetch("api/purchase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPurchase),
        });
        alert("Purchase recorded successfully!");
        onClose();
        setNewPurchase({
            date: new Date().toISOString().split("T")[0],
            vendorId: "",
            productId: "",
            quantity: "",
            rate: "",
            sellingRate: "",
            totalAmount: "",
            amountPaid: "",
        });
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            const data = await response.json();
            setAllProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchVendors = async () => {
        try {
            const response = await fetch("/api/vendors");
            const data = await response.json();
            setAllVendors(data);
        } catch (error) {
            console.error("Error fetching vendors:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchVendors();
    }, []);

    const calculateTotalAmount = (quantity, rate) => {
        if (quantity && rate) {
            return quantity * rate;
        }
        return "";
    };

    return (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-2 rounded-full text-white shadow-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
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
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">New Purchase</h2>
                    </div>
                    <button
                        onClick={() => onClose()}
                        className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
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
                <form onSubmit={handleNewPurchase} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                            <input
                                type="date"
                                value={newPurchase.date}
                                onChange={(e) =>
                                    setNewPurchase({ ...newPurchase, date: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor</label>
                            <select
                                value={newPurchase.vendorId}
                                onChange={(e) =>
                                    setNewPurchase({ ...newPurchase, vendorId: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">Select Vendor</option>
                                {AllVendors.map((vendor) => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product</label>
                        <select
                            value={newPurchase.productId}
                            onChange={(e) =>
                                setNewPurchase({ ...newPurchase, productId: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">Select Product</option>
                            {AllProducts.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                            <input
                                type="number"
                                value={newPurchase.quantity}
                                onChange={(e) => {
                                    const quantity = e.target.value;
                                    setNewPurchase({
                                        ...newPurchase,
                                        quantity,
                                        totalAmount: calculateTotalAmount(
                                            quantity,
                                            newPurchase.rate
                                        ),
                                    });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate</label>
                            <input
                                type="number"
                                value={newPurchase.rate}
                                onChange={(e) => {
                                    const rate = e.target.value;
                                    setNewPurchase({
                                        ...newPurchase,
                                        rate,
                                        totalAmount: calculateTotalAmount(
                                            newPurchase.quantity,
                                            rate
                                        ),
                                    });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Rate</label>
                        <input
                            type="number"
                            value={newPurchase.sellingRate}
                            onChange={(e) =>
                                setNewPurchase({ ...newPurchase, sellingRate: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Amount</label>
                            <input
                                type="text"
                                value={formatCurrency(newPurchase.totalAmount || 0)}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount Paid</label>
                            <input
                                type="number"
                                value={newPurchase.amountPaid}
                                onChange={(e) =>
                                    setNewPurchase({ ...newPurchase, amountPaid: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => onClose()}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-gray-500 dark:focus:ring-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-md hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-green-500 dark:focus:ring-green-400"
                        >
                            Add Purchase
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddNewPurchaseModel;