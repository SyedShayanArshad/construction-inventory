"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import AddNewProductModel from "../../components/AddNewProductModel";
import AddNewPurchaseModel from "../../components/AddNewPurchaseModel";
import Loading from "../../components/Loading";

export default function Inventory() {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showNewPurchaseModal, setShowNewPurchaseModal] = useState(false);
  const [showEditPurchaseModal, setEditPurchaseModal] = useState(false);
  const [editPurchase, setEditPurchase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [AllPurchases, setAllPurchases] = useState([]);
  const [AllProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categories = [
    ...new Set(AllProducts.map((product) => product.category)),
  ];

  const filteredPurchases = AllPurchases.filter((purchase) => {
    return purchase.purchaseItems.some((item) => {
      const nameMatch = item.product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categoryMatch =
        categoryFilter === "" || item.product.category === categoryFilter;
      return nameMatch && categoryMatch;
    });
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [purchaseRes, productRes] = await Promise.all([
          fetch("/api/purchase"),
          fetch("/api/products"),
        ]);
        const purchases = await purchaseRes.json();
        const products = await productRes.json();
        setAllPurchases(purchases);
        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateTotalValue = (product, item) => {
    return product.quantity * (item ? item.rate : product.cost);
  };

  const calculateInventoryValue = () => {
    return AllPurchases.reduce(
      (acc, purchase) => acc + purchase.totalAmount,
      0
    );
  };

  return (
    loading ? (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    ) : (
      <div className="space-y-6 min-h-screen p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowNewPurchaseModal(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white px-5 py-2.5 rounded-md hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 inline-flex items-center shadow-md hover:shadow-lg transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              New Purchase
            </button>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white px-5 py-2.5 rounded-md hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 inline-flex items-center shadow-md hover:shadow-lg transition-all"
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
              Add New Product
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-800 dark:text-white">Inventory Summary</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg shadow border border-blue-200 dark:border-blue-700 flex items-center">
              <div className="bg-blue-500 dark:bg-blue-600 p-3 rounded-full mr-3">
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
                <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Products</div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{AllProducts.length}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg shadow border border-green-200 dark:border-green-700 flex items-center">
              <div className="bg-green-500 dark:bg-green-600 p-3 rounded-full mr-3">
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
                <div className="text-sm font-medium text-green-800 dark:text-green-200">Inventory Value</div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(calculateInventoryValue())}</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 p-4 rounded-lg shadow border border-yellow-200 dark:border-yellow-700 flex items-center">
              <div className="bg-yellow-500 dark:bg-yellow-600 p-3 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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
              <div>
                <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Low Stock Items</div>
                <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {AllProducts.filter((p) => p.quantity <= p.lowStockThreshold).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Filter Products</h3>
          </div>  

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 transition-all hover:border-blue-300 dark:hover:border-blue-500">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 dark:text-gray-300"
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
                placeholder="Search by product name..."
                className="pl-10 w-full px-3 py-2 border-0 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
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

            <div className="relative bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 transition-all hover:border-blue-300 dark:hover:border-blue-500">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 dark:text-gray-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 w-full px-3 py-2 border-0 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 101.414 1.414l-4 4a1 1 0 00-1.414 0l-4-4a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {categoryFilter && (
                <div className="absolute inset-y-0 right-8 flex items-center z-10">
                  <button
                    onClick={() => setCategoryFilter("")}
                    className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
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
          </div>

          <div className="flex items-center mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredPurchases.length === 0
                ? "No products found"
                : filteredPurchases.length === 1
                ? "1 product found"
                : `${filteredPurchases.length} products found`}
            </div>
          </div>

          <div
            className="w-full overflow-auto scrollbar-thin"
            style={{
              maxWidth: "100vw",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                <tr>
                  <th className="py-4 pl-4 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit Price</th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost</th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                  <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vendor</th>
                  <th className="relative py-4 pl-3 pr-4"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {filteredPurchases.map((purchase) =>
                  purchase.purchaseItems.map((item) => {
                    const product = item.product;
                    const vendor = purchase.vendor;
                    const isLowStock = product.quantity <= product.lowStockThreshold;

                    return (
                      <tr
                        key={`${purchase.id}-${item.id}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{product.category}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className={`font-medium ${isLowStock ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
                            {product.quantity} {product.unit}
                            {isLowStock && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">Low</span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(item.sellRate)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{formatCurrency(item.rate)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(calculateTotalValue(product, item))}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{vendor ? vendor.name : "Unknown"}</td>
                        <td className="whitespace-nowrap text-right text-sm font-medium px-3 py-4">
                          <button
                            onClick={() => {
                              setEditPurchase(product);
                              setEditPurchaseModal(true);
                            }}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900 px-3 py-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                          >
                            Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showNewPurchaseModal && (
          <AddNewPurchaseModel onClose={() => setShowNewPurchaseModal(false)} />
        )}
        {showEditPurchaseModal && (
          <AddNewPurchaseModel
            onClose={() => setEditPurchaseModal(false)}
            product={editPurchase}
          />
        )}
        {showAddProductModal && (
          <AddNewProductModel onClose={() => setShowAddProductModal(false)} />
        )}
      </div>
    )
  );
}