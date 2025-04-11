"use client";

import { useState } from "react";
import {
  sales,
  purchases,
  products,
  customers,
  vendors,
  getCustomerById,
  getVendorById,
  getProductById,
} from "../../lib/demo-data";

export default function Reports() {
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

  // Format currency in PKR format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ur-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get sales within date range
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    const startDate = dateRange.startDate
      ? new Date(dateRange.startDate)
      : null;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

    const matchesDateRange =
      (!startDate || saleDate >= startDate) &&
      (!endDate || saleDate <= endDate);

    const matchesEntity =
      !entityFilter.type ||
      entityFilter.type !== "customer" ||
      !entityFilter.id ||
      sale.customerId === entityFilter.id;

    return (
      matchesDateRange &&
      matchesEntity &&
      (reportType === "all" || reportType === "sales")
    );
  });

  // Get purchases within date range
  const filteredPurchases = purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.date);
    const startDate = dateRange.startDate
      ? new Date(dateRange.startDate)
      : null;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

    const matchesDateRange =
      (!startDate || purchaseDate >= startDate) &&
      (!endDate || purchaseDate <= endDate);

    const matchesEntity =
      !entityFilter.type ||
      entityFilter.type !== "vendor" ||
      !entityFilter.id ||
      purchase.vendorId === entityFilter.id;

    return (
      matchesDateRange &&
      matchesEntity &&
      (reportType === "all" || reportType === "purchases")
    );
  });

  // Calculate financial metrics
  const totalSales = filteredSales.reduce(
    (total, sale) => total + sale.total,
    0
  );
  const totalPurchases = filteredPurchases.reduce(
    (total, purchase) => total + purchase.total,
    0
  );
  const totalProfit = totalSales - totalPurchases;

  // Generate CSV for the report
  const generateCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (reportType === "all" || reportType === "sales") {
      csvContent += "SALES REPORT\r\n";
      csvContent += "Date,ID,Customer,Total,Paid,Due,Status\r\n";

      filteredSales.forEach((sale) => {
        const customer = getCustomerById(sale.customerId);
        const customerName = customer ? customer.name : "Unknown";
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
        const vendor = getVendorById(purchase.vendorId);
        const vendorName = vendor ? vendor.name : "Unknown";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow border border-blue-200 flex items-center">
          <div className="bg-blue-500 p-3 rounded-full mr-3">
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
            <div className="text-sm font-medium text-blue-800">Total Sales</div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(totalSales)}
            </div>
            <div className="text-sm text-blue-700">
              {filteredSales.length} transactions
            </div>
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
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path
                fillRule="evenodd"
                d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-red-800">
              Total Purchases
            </div>
            <div className="text-2xl font-bold text-red-900">
              {formatCurrency(totalPurchases)}
            </div>
            <div className="text-sm text-red-700">
              {filteredPurchases.length} transactions
            </div>
          </div>
        </div>
        <div
          className={`bg-gradient-to-br ${
            totalProfit >= 0
              ? "from-green-50 to-green-100 border-green-200"
              : "from-red-50 to-red-100 border-red-200"
          } p-4 rounded-lg shadow border flex items-center`}
        >
          <div
            className={`${
              totalProfit >= 0 ? "bg-green-500" : "bg-red-500"
            } p-3 rounded-full mr-3`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
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
          </div>
          <div>
            <div className="text-sm font-medium">
              {totalProfit >= 0 ? "Net Profit" : "Net Loss"}
            </div>
            <div
              className={`text-2xl font-bold ${
                totalProfit >= 0 ? "text-green-900" : "text-red-900"
              }`}
            >
              {formatCurrency(Math.abs(totalProfit))}
            </div>
            <div className="text-sm">
              {totalProfit >= 0 ? "Profit" : "Loss"} for selected period
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-800">
            Report Parameters
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative bg-gray-50 rounded-md border border-gray-200 p-3 transition-all hover:border-blue-300">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {dateRange.startDate && (
              <div className="absolute top-3 right-3">
                <button 
                  onClick={() => setDateRange({ ...dateRange, startDate: '' })}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Clear start date"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="relative bg-gray-50 rounded-md border border-gray-200 p-3 transition-all hover:border-blue-300">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {dateRange.endDate && (
              <div className="absolute top-3 right-3">
                <button 
                  onClick={() => setDateRange({ ...dateRange, endDate: new Date().toISOString().split('T')[0] })}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Reset to today"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="relative bg-gray-50 rounded-md border border-gray-200 p-3 transition-all hover:border-blue-300">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Transactions</option>
              <option value="sales">Sales Only</option>
              <option value="purchases">Purchases Only</option>
            </select>
            {reportType !== "all" && (
              <div className="absolute top-3 right-3">
                <button 
                  onClick={() => setReportType("all")}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Reset to all transactions"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="relative bg-gray-50 rounded-md border border-gray-200 p-3 transition-all hover:border-blue-300">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity Type
            </label>
            <select
              value={entityFilter.type}
              onChange={(e) =>
                setEntityFilter({ type: e.target.value, id: "", searchTerm: "" })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Entities</option>
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
            {entityFilter.type && (
              <div className="absolute top-3 right-3">
                <button 
                  onClick={() => setEntityFilter({ type: "", id: "", searchTerm: "" })}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Clear entity type"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="relative bg-gray-50 rounded-md border border-gray-200 p-3 transition-all hover:border-blue-300">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {entityFilter.type === "customer"
                ? "Customer"
                : entityFilter.type === "vendor"
                ? "Vendor"
                : "Entity"}
            </label>
            {entityFilter.type === "customer" ? (
              <div className="relative">
                <input
                  type="text"
                  value={entityFilter.searchTerm || ""}
                  onChange={(e) => {
                    setEntityFilter({ ...entityFilter, searchTerm: e.target.value });
                    if (!e.target.value) {
                      setEntityFilter({ ...entityFilter, id: "", searchTerm: "" });
                    }
                  }}
                  placeholder="Search customer by name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {entityFilter.searchTerm && (
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={() => setEntityFilter({ ...entityFilter, id: "", searchTerm: "" })}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      title="Clear search"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
                {entityFilter.searchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {customers
                      .filter(customer => 
                        customer.name.toLowerCase().includes(entityFilter.searchTerm.toLowerCase())
                      )
                      .map(customer => (
                        <div
                          key={customer.id}
                          onClick={() => setEntityFilter({ ...entityFilter, id: customer.id, searchTerm: customer.name })}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-900">{customer.name}</span>
                          {entityFilter.id === customer.id && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            ) : entityFilter.type === "vendor" ? (
              <select
                value={entityFilter.id}
                onChange={(e) =>
                  setEntityFilter({ ...entityFilter, id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            )}
            {entityFilter.id && (
              <div className="absolute top-3 right-3">
                <button 
                  onClick={() => setEntityFilter({ ...entityFilter, id: "", searchTerm: "" })}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Clear selected entity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="relative bg-gray-50 rounded-md border border-gray-200 p-3 transition-all hover:border-blue-300 flex items-end">
            <button
              onClick={generateCSV}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-md hover:from-green-700 hover:to-green-800 inline-flex items-center justify-center shadow-md hover:shadow-lg transition-all"
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
        
        {/* Clear All Filters Button */}
        <div className="flex justify-end mb-2">
          {(dateRange.startDate || dateRange.endDate !== new Date().toISOString().split('T')[0] || reportType !== "all" || entityFilter.type || entityFilter.id) && (
            <button
              onClick={() => {
                setDateRange({
                  startDate: "",
                  endDate: new Date().toISOString().split('T')[0]
                });
                setReportType("all");
                setEntityFilter({ type: "", id: "", searchTerm: "" });
              }}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Transaction History */}
      {(reportType === "all" || reportType === "sales") && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Sales Transactions</h2>
          {filteredSales.length > 0 ? (
            <div
              className="w-full overflow-auto scrollbar-thin"
              style={{
                maxWidth: "100vw",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <table className="table-auto min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sale ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSales.map((sale) => {
                    const customer = getCustomerById(sale.customerId);

                    return (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(sale.date).toLocaleDateString("en-US")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer ? customer.name : "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(sale.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(sale.paid)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span
                            className={
                              sale.due > 0 ? "text-red-600" : "text-gray-900"
                            }
                          >
                            {formatCurrency(sale.due)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              sale.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : sale.status === "partial"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No sales transactions found for the selected criteria.
            </p>
          )}
        </div>
      )}

      {/* Purchase History */}
      {(reportType === "all" || reportType === "purchases") && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Purchase Transactions</h2>
          {filteredPurchases.length > 0 ? (
            <div
              className="w-full overflow-auto scrollbar-thin"
              style={{
                maxWidth: "100vw",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <table className="table-auto min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPurchases.map((purchase) => {
                    const vendor = getVendorById(purchase.vendorId);

                    return (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(purchase.date).toLocaleDateString("en-US")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {purchase.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vendor ? vendor.name : "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(purchase.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(purchase.paid)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span
                            className={
                              purchase.due > 0
                                ? "text-red-600"
                                : "text-gray-900"
                            }
                          >
                            {formatCurrency(purchase.due)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              purchase.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : purchase.status === "partial"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {purchase.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No purchase transactions found for the selected criteria.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
