"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

export default function Reports() {
  const [sales, setSales] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchSales(), fetchPurchases(), fetchVendors(), fetchCustomers()]);
      } catch (error) {
        console.error("Error during fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vendors");
      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }
      const vendors = await response.json();
      setVendors(vendors);
    } catch (error) {
      toast.error("Failed to load vendors");
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/customers");
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const customers = await response.json();
      setCustomers(customers);
    } catch (error) {
      toast.error("Failed to load customers");
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await fetch("/api/sales");
      if (!response.ok) throw new Error("Failed to fetch sales");
      const data = await response.json();
      setSales(data);
    } catch (error) {
      toast.error("Failed to load sales");
      console.error("Error fetching sales:", error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await fetch("/api/purchase");
      if (!response.ok) throw new Error("Failed to fetch purchases");
      const purchases = await response.json();
      setPurchases(purchases);
    } catch (error) {
      toast.error("Failed to load purchases");
      console.error("Error fetching purchases:", error);
    }
  };

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: new Date().toISOString().split("T")[0],
  });
  const [entityFilter, setEntityFilter] = useState({
    type: "",
    id: "",
    searchTerm: "",
  });
  const [reportType, setReportType] = useState("all");

  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

    const matchesDateRange =
      (!startDate || saleDate >= startDate) &&
      (!endDate || saleDate <= endDate);

    const matchesEntity =
      !entityFilter.type ||
      entityFilter.type !== "customer" ||
      !entityFilter.searchTerm ||
      (sale.customer?.name || "").toLowerCase().includes(entityFilter.searchTerm.toLowerCase());

    return (
      matchesDateRange &&
      matchesEntity &&
      (reportType === "all" || reportType === "sales")
    );
  });

  const filteredPurchases = purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.date);
    const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

    const matchesDateRange =
      (!startDate || purchaseDate >= startDate) &&
      (!endDate || purchaseDate <= endDate);

    const matchesEntity =
      !entityFilter.type ||
      entityFilter.type !== "vendor" ||
      !entityFilter.id ||
      String(purchase.vendorId) === String(entityFilter.id);

    return (
      matchesDateRange &&
      matchesEntity &&
      (reportType === "all" || reportType === "purchases")
    );
  });

  const totalSales = filteredSales.reduce(
    (total, sale) => total + Number(sale.subTotal || 0),
    0
  );

  const totalPurchases = purchases.reduce(
    (acc, purchase) => acc + purchase.totalAmount,
    0
  );
  const totalProfit = totalSales - totalPurchases;

  const generateCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (reportType === "all" || reportType === "sales") {
      csvContent += "SALES REPORT\r\n";
      csvContent += "Date,ID,Customer,Total,Paid,Due,Status\r\n";

      filteredSales.forEach((sale) => {
        const customerName = sale.customer?.name || "Unknown";
        csvContent += `${sale.date},${sale.id},${customerName},${sale.total},${sale.paid},${sale.due},${sale.status}\r\n`;
      });

      if (reportType === "all") {
        csvContent += "\r\n";
      }
    }

    if (reportType === "all" || reportType === "purchases") {
      csvContent += "PURCHASES REPORT\r\n";
      csvContent += "Date,ID,Vendor,Total,Paid,Due,Status\r\n";

      filteredPurchases.forEach((purchase) => {
        const vendorName = purchase.vendor?.name || "Unknown";
        csvContent += `${purchase.date},${purchase.id},${vendorName},${purchase.total},${purchase.paid},${purchase.due},${purchase.status}\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `inventory-report-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Reports</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
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
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Sales</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(totalSales)}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">{filteredSales.length} transactions</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-4 rounded-lg shadow border border-red-200 dark:border-red-700 flex items-center">
          <div className="bg-red-500 dark:bg-red-600 p-3 rounded-full mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path
                fillRule="evenodd"
                d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-red-800 dark:text-red-200">Total Purchases</div>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{formatCurrency(totalPurchases)}</div>
            <div className="text-sm text-red-700 dark:text-red-300">{filteredPurchases.length} transactions</div>
          </div>
        </div>
        <div
          className={`bg-gradient-to-br ${
            totalProfit >= 0
              ? "from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700"
              : "from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-red-200 dark:border-red-700"
          } p-4 rounded-lg shadow border flex items-center`}
        >
          <div
            className={`${
              totalProfit >= 0 ? "bg-green-500 dark:bg-green-600" : "bg-red-500 dark:bg-red-600"
            } p-3 rounded-full mr-3`}
          >
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
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {totalProfit >= 0 ? "Net Profit" : "Net Loss"}
            </div>
            <div
              className={`text-2xl font-bold ${
                totalProfit >= 0 ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"
              }`}
            >
              {formatCurrency(Math.abs(totalProfit))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {totalProfit >= 0 ? "Profit" : "Loss"} for selected period
            </div>
          </div>
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
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-800 dark:text-white">Report Parameters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 p-3 transition-all hover:border-blue-300 dark:hover:border-blue-500">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
            />
            {dateRange.startDate && (
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setDateRange({ ...dateRange, startDate: "" })}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
                  title="Clear start date"
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
          <div className="relative bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 p-3 transition-all hover:border-blue-300 dark:hover:border-blue-500">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
            />
            {dateRange.endDate && (
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setDateRange({ ...dateRange, endDate: new Date().toISOString().split("T")[0] })}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
                  title="Reset to today"
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
          <div className="relative bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 p-3 transition-all hover:border-blue-300 dark:hover:border-blue-500">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 transition-colors"
            >
              <option value="all">All Transactions</option>
              <option value="sales">Sales Only</option>
              <option value="purchases">Purchases Only</option>
            </select>
            {reportType !== "all" && (
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setReportType("all")}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
                  title="Reset to all transactions"
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
          <div className="relative bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 p-3 transition-all hover:border-blue-300 dark:hover:border-blue-500">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entity Type</label>
            <select
              value={entityFilter.type}
              onChange={(e) => setEntityFilter({ type: e.target.value, id: "", searchTerm: "" })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 transition-colors"
            >
              <option value="">All Entities</option>
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
            {entityFilter.type && (
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setEntityFilter({ type: "", id: "", searchTerm: "" })}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
                  title="Clear entity type"
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
          <div className="relative bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 p-3 transition-all hover:border-blue-300 dark:hover:border-blue-500">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {entityFilter.type === "customer" ? "Customer" : entityFilter.type === "vendor" ? "Vendor" : "Entity"}
            </label>
            {entityFilter.type === "customer" ? (
              <div className="relative">
                <input
                  type="text"
                  value={entityFilter.searchTerm || ""}
                  onChange={(e) => {
                    setEntityFilter({ ...entityFilter, searchTerm: e.target.value, id: "" });
                  }}
                  placeholder="Search customer by name..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 transition-colors"
                />
                {entityFilter.searchTerm && (
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => setEntityFilter({ ...entityFilter, id: "", searchTerm: "" })}
                      className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
                      title="Clear search"
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
            ) : entityFilter.type === "vendor" ? (
              <select
                value={entityFilter.id}
                onChange={(e) => setEntityFilter({ ...entityFilter, id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 transition-colors"
              >
                <option value="">All Vendors</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                disabled
                placeholder="Select entity type first"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-300"
              />
            )}
            {entityFilter.id && (
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setEntityFilter({ ...entityFilter, id: "", searchTerm: "" })}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
                  title="Clear selected entity"
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
          <div className="relative bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 p-3 transition-all hover:border-blue-300 dark:hover:border-blue-500 flex items-end">
            <button
              onClick={generateCSV}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white px-5 py-2.5 rounded-md hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 inline-flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download Report as CSV
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-2">
          {(dateRange.startDate ||
            dateRange.endDate !== new Date().toISOString().split("T")[0] ||
            reportType !== "all" ||
            entityFilter.type ||
            entityFilter.searchTerm) && (
            <button
              onClick={() => {
                setDateRange({
                  startDate: "",
                  endDate: new Date().toISOString().split("T")[0],
                });
                setReportType("all");
                setEntityFilter({ type: "", id: "", searchTerm: "" });
              }}
              className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {(reportType === "all" || reportType === "sales") && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Sales Transactions</h2>
          {filteredSales.length > 0 ? (
            <div
              className="w-full overflow-auto scrollbar-thin"
              style={{
                maxWidth: "100vw",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <table className="table-auto min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sale ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSales.map((sale) => {
                    const status =
                      sale.amountPaid >= sale.subTotal
                        ? "completed"
                        : sale.amountPaid > 0
                        ? "partial"
                        : "unpaid";
                    return (
                      <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(sale.date).toLocaleDateString("en-US")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sale.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{sale.customer?.name || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(sale.subTotal)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(sale.amountPaid)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={sale.dueAmount > 0 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}>
                            {formatCurrency(sale.dueAmount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              status === "completed"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : status === "partial"
                                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            }`}
                          >
                            {status === "completed" ? "Paid" : status === "partial" ? "Partial" : "Unpaid"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No sales transactions found for the selected criteria.</p>
          )}
        </div>
      )}

      {(reportType === "all" || reportType === "purchases") && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Purchase Transactions</h2>
          {filteredPurchases.length > 0 ? (
            <div
              className="w-full overflow-auto scrollbar-thin"
              style={{
                maxWidth: "100vw",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <table className="table-auto min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(purchase.date).toLocaleDateString("en-US")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{purchase.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{purchase.vendor?.name || "Unknown"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(purchase.totalAmount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(purchase.amountPaid)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={
                            purchase.totalAmount - purchase.amountPaid > 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-900 dark:text-white"
                          }
                        >
                          {formatCurrency(purchase.totalAmount - purchase.amountPaid)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            purchase.status === "completed"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : purchase.status === "partial"
                              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No purchase transactions found for the selected criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}