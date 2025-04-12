'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  sales as dummySales, 
  customers, 
  products, 
  getCustomerById, 
  getProductById 
} from '../../lib/demo-data';

export default function Sales() {
  // State for sales management
  const [sales, setSales] = useState(dummySales);
  const [currentMonthSales, setCurrentMonthSales] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [showSaleDetailsModal, setShowSaleDetailsModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  
  // Selected items
  const [selectedSale, setSelectedSale] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);
  
  // Update form state
  const [updateSaleForm, setUpdateSaleForm] = useState({
    paid: '',
    customerName: '',
    customerPhone: '',
    date: '',
    paymentMethod: 'Cash'
  });
  
  // New sale
  const [newSale, setNewSale] = useState({
    customerName: '',
    customerPhone: '',
    items: [{ productId: '', quantity: '', price: '', discount: '' }],
    paid: '',
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    paymentMethod: 'Cash'
  });

  // Format currency in PKR format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ur-PK', { 
      style: 'currency', 
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate totals for new sale
  const calculateSubtotal = () => {
    return newSale.items.reduce((total, item) => {
      if (item.productId && item.quantity && item.price) {
        const itemPrice = parseFloat(item.price);
        const itemQuantity = parseFloat(item.quantity);
        const discountAmount = parseFloat(item.discount || 0);
        const itemTotal = (itemQuantity * itemPrice) - discountAmount;
        return total + itemTotal;
      }
      return total;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const due = subtotal - (parseFloat(newSale.paid) || 0);

  // Get current month and year
  const getCurrentMonthYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed month
    return { year, month };
  };

  // Get current month sales
  const getCurrentMonthSales = () => {
    const { year, month } = getCurrentMonthYear();
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === month && saleDate.getFullYear() === year;
    });
  };

  // Initialize current month sales on component mount
  useEffect(() => {
    setCurrentMonthSales(getCurrentMonthSales());
  }, []);

  // Filtered sales
  const filteredSales = currentMonthSales.filter(sale => {
    // For backward compatibility with existing data structure
    let customerName = '';
    if (sale.customerName) {
      customerName = sale.customerName;
    } else if (sale.customerId) {
      const customer = getCustomerById(sale.customerId);
      customerName = customer?.name || '';
    }
    
    // Only filter by customer name and date within current month
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || sale.date.includes(dateFilter);
    const matchesStatus = !statusFilter || sale.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const handleAddNewSale = (e) => {
    e.preventDefault();
    // In a real app, this would save to a database
    // Create a new sale object with appropriate ID and properties
    const sale = {
      id: newSale.invoiceNumber,
      customerName: newSale.customerName,
      customerPhone: newSale.customerPhone,
      items: newSale.items.map(item => ({
        productId: item.productId,
        quantity: parseFloat(item.quantity),
        price: parseFloat(item.price),
        discount: parseFloat(item.discount || 0)
      })),
      total: subtotal,
      paid: parseFloat(newSale.paid) || 0,
      due: due,
      date: newSale.date,
      status: due <= 0 ? 'completed' : due < subtotal ? 'partial' : 'unpaid',
      // Add payment history for tracking all payments
      paymentHistory: parseFloat(newSale.paid) > 0 ? [
        {
          amount: parseFloat(newSale.paid),
          date: new Date().toISOString(),
          remainingBalance: due,
          paymentMethod: newSale.paymentMethod,
          notes: 'Initial payment'
        }
      ] : []
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
      customerName: '',
      customerPhone: '',
      items: [{ productId: '', quantity: '', price: '', discount: '' }],
      paid: '',
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      paymentMethod: 'Cash'
    });
  };

  const addItemToSale = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { productId: '', quantity: '', price: '', discount: '' }]
    });
  };

  const removeItemFromSale = (index) => {
    const updatedItems = [...newSale.items];
    updatedItems.splice(index, 1);
    setNewSale({
      ...newSale,
      items: updatedItems
    });
  };

  const updateSaleItem = (index, field, value) => {
    const updatedItems = [...newSale.items];
    updatedItems[index][field] = value;
    
    // If product is changed, update price
    if (field === 'productId' && value) {
      const product = getProductById(value);
      if (product) {
        updatedItems[index].price = product.price.toString();
      }
    }
    
    setNewSale({
      ...newSale,
      items: updatedItems
    });
  };

  const viewSaleDetails = (sale) => {
    setSelectedSale(sale);
    setShowSaleDetailsModal(true);
  };

  const printInvoice = () => {
    // Open a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice #${selectedSale.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.5;
            color: #1f2937;
            background-color: #f9fafb;
            margin: 0;
            padding: 20px;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background-color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
          }
          
          .logo {
            width: 50px;
            height: 50px;
            background: linear-gradient(to right, #3b82f6, #2563eb);
            border-radius: 10px;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 20px;
          }
          
          .company-name {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
          }
          
          .invoice-title {
            color: #6b7280;
            margin: 0;
          }
          
          .invoice-info {
            background-color: #f3f4f6;
            border-radius: 8px;
            padding: 15px;
            width: 200px;
            text-align: right;
          }
          
          .invoice-label {
            color: #6b7280;
            font-size: 12px;
            margin-bottom: 4px;
          }
          
          .invoice-value {
            font-weight: 600;
            color: #1f2937;
          }
          
          .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 5px;
          }
          
          .status-completed {
            background-color: #d1fae5;
            color: #065f46;
          }
          
          .status-partial {
            background-color: #fef3c7;
            color: #92400e;
          }
          
          .status-unpaid {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          
          .addresses {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          
          .address-section {
            max-width: 250px;
          }
          
          .address-title {
            font-weight: 600;
            color: #4b5563;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .address-content {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          .items-table th {
            background-color: #f3f4f6;
            color: #4b5563;
            font-weight: 600;
            text-align: left;
            padding: 12px;
            font-size: 14px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            color: #4b5563;
            font-size: 14px;
          }
          
          .items-table tr:last-child td {
            border-bottom: none;
          }
          
          .items-table .amount-column {
            text-align: right;
          }
          
          .totals-table {
            width: 350px;
            margin-left: auto;
            border-collapse: collapse;
          }
          
          .totals-table td {
            padding: 8px 12px;
          }
          
          .totals-table .label {
            color: #6b7280;
          }
          
          .totals-table .value {
            text-align: right;
            font-weight: 500;
          }
          
          .totals-table .grand-total {
            font-weight: 700;
            color: #1f2937;
            font-size: 16px;
            border-top: 2px solid #e5e7eb;
            padding-top: 12px;
          }
          
          .invoice-notes {
            font-size: 14px;
            color: #6b7280;
            padding: 20px;
            background-color: #f9fafb;
            border-radius: 8px;
            margin-top: 30px;
          }
          
          .amount-paid {
            color: #059669;
          }
          
          .amount-due {
            color: #dc2626;
          }
          
          .print-button {
            display: block;
            margin: 30px auto 0;
            padding: 10px 20px;
            background: linear-gradient(to right, #3b82f6, #2563eb);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
          }
          
          .print-button:hover {
            background: linear-gradient(to right, #2563eb, #1d4ed8);
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.5);
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
          }
          
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(229, 231, 235, 0.3);
            pointer-events: none;
            z-index: -1;
            font-weight: bold;
            letter-spacing: 5px;
          }
          
          .section-title {
            font-weight: 600;
            color: #4b5563;
            font-size: 16px;
            margin-top: 40px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .payment-history-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          .payment-history-table th {
            background-color: #f3f4f6;
            padding: 10px;
            text-align: left;
            font-size: 12px;
            color: #6b7280;
            font-weight: 600;
            text-transform: uppercase;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .payment-history-table td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 13px;
            color: #4b5563;
          }
          
          .payment-history-table .amount-cell {
            color: #059669;
            font-weight: 500;
          }
          
          .payment-history-table .right-align {
            text-align: right;
          }
          
          .no-payment-history {
            background-color: #fffbeb;
            border: 1px solid #fef3c7;
            color: #92400e;
            padding: 12px;
            border-radius: 6px;
            font-size: 13px;
            margin-bottom: 20px;
          }
          
          @media print {
            body {
              background-color: white;
              padding: 0;
            }
            
            .invoice-container {
              box-shadow: none;
              padding: 0;
            }
            
            .print-button {
              display: none;
            }
            
            .watermark {
              display: ${selectedSale.status === 'completed' ? 'none' : 'block'};
            }
          }
        </style>
      </head>
      <body>
        ${selectedSale.status !== 'completed' ? '<div class="watermark">UNPAID</div>' : ''}
        
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="logo-section">
              <div class="logo">CM</div>
              <div>
                <h1 class="company-name">Manzoor Construction Material</h1>
                <p class="invoice-title">Tax Invoice</p>
              </div>
            </div>
            
            <div class="invoice-info">
              <div class="invoice-label">Invoice Number</div>
              <div class="invoice-value">${selectedSale.id}</div>
              
              <div class="invoice-label" style="margin-top: 10px;">Invoice Date</div>
              <div class="invoice-value">${new Date(selectedSale.date).toLocaleDateString('en-US')}</div>
              
              <div class="invoice-label" style="margin-top: 10px;">Status</div>
              <div class="status-badge status-${selectedSale.status}">
                ${selectedSale.status.charAt(0).toUpperCase() + selectedSale.status.slice(1)}
              </div>
            </div>
          </div>
          
          <div class="addresses">
            <div class="address-section">
              <div class="address-title">From</div>
              <div class="address-content">
                <div>Manzoor Construction Material</div>
                <div>Chak No 11/1.A.L, Renala Khurd</div>
                <div>Okara, Pakistan</div>
                <div>+92 300 1234567</div>
                <div>info@constructionshop.pk</div>
              </div>
            </div>
            
            <div class="address-section">
              <div class="address-title">Bill To</div>
              <div class="address-content">
                <div>${selectedSale.customerName || (getCustomerById(selectedSale.customerId)?.name) || 'Walk-in Customer'}</div>
                ${selectedSale.customerPhone ? `<div>${selectedSale.customerPhone}</div>` : ''}
                ${getCustomerById(selectedSale.customerId)?.address ? `<div>${getCustomerById(selectedSale.customerId)?.address}</div>` : ''}
              </div>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Discount</th>
                <th class="amount-column">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${selectedSale.items.map(item => {
                const product = getProductById(item.productId);
                const discountAmount = parseFloat(item.discount || 0);
                const itemTotal = (item.quantity * item.price) - discountAmount;
                
                return `
                  <tr>
                    <td>${product ? product.name : item.productId}</td>
                    <td>${item.quantity} ${product ? product.unit : ''}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${discountAmount > 0 ? formatCurrency(discountAmount) : '-'}</td>
                    <td class="amount-column">${formatCurrency(itemTotal)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <table class="totals-table">
            <tr>
              <td class="label">Subtotal</td>
              <td class="value">${formatCurrency(selectedSale.total)}</td>
            </tr>
            <tr>
              <td class="label">Amount Paid</td>
              <td class="value amount-paid">${formatCurrency(selectedSale.paid)}</td>
            </tr>
            <tr>
              <td class="label grand-total">Balance Due</td>
              <td class="value grand-total ${selectedSale.due > 0 ? 'amount-due' : 'amount-paid'}">${formatCurrency(selectedSale.due)}</td>
            </tr>
          </table>
          
          ${selectedSale.paymentHistory && selectedSale.paymentHistory.length > 0 ? `
            <div class="section-title">Payment History</div>
            <table class="payment-history-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Amount Paid</th>
                  <th class="right-align">Due Before Payment</th>
                  <th class="right-align">Balance After Payment</th>
                </tr>
              </thead>
              <tbody>
                ${selectedSale.paymentHistory.map(payment => {
                  // Calculate due before payment
                  const dueBeforePayment = payment.remainingBalance + payment.amount;
                  
                  return `
                    <tr>
                      <td>${new Date(payment.date).toLocaleString('en-US')}</td>
                      <td class="amount-cell">+${formatCurrency(payment.amount)}</td>
                      <td class="right-align" style="color: #dc2626; font-weight: 500;">${formatCurrency(dueBeforePayment)}</td>
                      <td class="right-align">${formatCurrency(payment.remainingBalance)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          ` : `
            <div class="section-title">Payment History</div>
            <div class="no-payment-history">No payment records found.</div>
          `}
          
          <div class="invoice-notes">
            <strong>Note:</strong> Thank you for your business! Payment is expected within 30 days. All goods once sold cannot be returned.
          </div>
          
          <div class="footer">
            <p>This is a computer generated invoice and does not require a signature.</p>
            <p>For questions about this invoice, please contact us at +92 300 1234567 or email at info@constructionshop.pk</p>
          </div>
        </div>
        
        <button onclick="window.print();" class="print-button">Print Invoice</button>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const downloadInvoice = () => {
    // Since we can't actually generate a PDF without a PDF library like jsPDF,
    // for now we'll just call the print function which provides a nice view
    // that the user can use to save as PDF through the browser
    printInvoice();
  };

  // Function to handle updating sale payment
  const updateSalePayment = (sale) => {
    setSelectedSale(sale);
    // Initialize the update form with current values
    setUpdateSaleForm({
      paid: 0, // Initialize with 0 for new payment amount
      customerName: sale.customerName || '',
      customerPhone: sale.customerPhone || '',
      date: new Date().toISOString().slice(0, 16),
      paymentMethod: 'Cash' // Default payment method
    });
    setShowUpdatePaymentModal(true);
  };

  // Function to handle deleting a sale
  const deleteSale = (saleId) => {
    const sale = sales.find(s => s.id === saleId);
    setSaleToDelete(sale);
    setShowDeleteConfirmModal(true);
  };

  // Function to confirm payment update
  const confirmPaymentUpdate = () => {
    // In a real app, this would update in a database
    const updatedSales = sales.map(sale => {
      if (sale.id === selectedSale.id) {
        // Calculate new total paid amount (existing paid + new payment)
        const previousPaid = parseFloat(selectedSale.paid) || 0;
        const newPaymentAmount = parseFloat(updateSaleForm.paid) || 0;
        const totalPaidAmount = previousPaid + newPaymentAmount;
        
        const updatedSale = {
          ...sale,
          paid: totalPaidAmount,
          customerName: updateSaleForm.customerName,
          customerPhone: updateSaleForm.customerPhone,
          date: updateSaleForm.date
        };
        
        // Recalculate due amount
        updatedSale.due = updatedSale.total - updatedSale.paid;
        
        // Update status based on payment
        if (updatedSale.due <= 0) {
          updatedSale.status = 'completed';
        } else if (updatedSale.paid > 0) {
          updatedSale.status = 'partial';
        } else {
          updatedSale.status = 'unpaid';
        }
        
        // Add to payment history if it's an additional payment
        if (newPaymentAmount > 0) {
          // Initialize payment history array if it doesn't exist
          if (!updatedSale.paymentHistory) {
            updatedSale.paymentHistory = [];
          }
          
          // Add new payment record
          updatedSale.paymentHistory.push({
            amount: newPaymentAmount,
            date: new Date().toISOString(),
            remainingBalance: updatedSale.due,
            paymentMethod: updateSaleForm.paymentMethod,
            notes: 'Additional payment'
          });
        }
        
        // Update the selected sale as well to reflect changes immediately
        setSelectedSale(updatedSale);
        
        return updatedSale;
      }
      return sale;
    });
    
    setSales(updatedSales);
    setCurrentMonthSales(getCurrentMonthSales());
    setShowUpdatePaymentModal(false);
  };

  // Function to confirm sale deletion
  const confirmDeleteSale = () => {
    // In a real app, this would delete from the database
    
    // Remove the sale from the current month sales
    const updatedSales = currentMonthSales.filter(sale => sale.id !== saleToDelete.id);
    setCurrentMonthSales(updatedSales);
    
    alert(`Sale ${saleToDelete.id} deleted successfully!`);
    
    // Close the modal
    setShowDeleteConfirmModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Sales Management</h1>
        <button
          onClick={() => setShowNewSaleModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-md hover:from-blue-700 hover:to-blue-800 inline-flex items-center shadow-md hover:shadow-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Record New Sale
        </button>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-800">Current Month Sales Summary</h2>
          </div>
          <Link href="/reports" className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            View All Sales Reports
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow border border-blue-200 flex items-center">
            <div className="bg-blue-500 p-3 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-blue-800">Total Sales</div>
              <div className="text-2xl font-bold text-blue-900">{currentMonthSales.length}</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow border border-green-200 flex items-center">
            <div className="bg-green-500 p-3 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-green-800">Total Revenue</div>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(currentMonthSales.reduce((total, sale) => total + sale.total, 0))}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg shadow border border-yellow-200 flex items-center">
            <div className="bg-yellow-500 p-3 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-yellow-800">Outstanding Balance</div>
              <div className="text-2xl font-bold text-yellow-900">
                {formatCurrency(currentMonthSales.reduce((total, sale) => total + sale.due, 0))}
              </div>
              <div className="text-xs text-yellow-700 mt-1">
                {currentMonthSales.filter(sale => sale.due > 0).length} unpaid invoices
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-5">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800">Filter Sales</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative bg-gray-50 rounded-md border border-gray-200 transition-all hover:border-blue-300">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name..."
                className="pl-10 w-full px-3 py-2 border-0 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="relative bg-gray-50 rounded-md border border-gray-200 transition-all hover:border-blue-300">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 w-full px-3 py-2 border-0 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              {dateFilter && (
                <div className="absolute inset-y-0 right-8 flex items-center z-10">
                  <button 
                    onClick={() => setDateFilter('')}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="relative bg-gray-50 rounded-md border border-gray-200 transition-all hover:border-blue-300">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 w-full px-3 py-2 border-0 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              {statusFilter && (
                <div className="absolute inset-y-0 right-8 flex items-center z-10">
                  <button 
                    onClick={() => setStatusFilter('')}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              {filteredSales.length === 0 ? 'No results found' : 
                filteredSales.length === 1 ? '1 sale found' : 
                `${filteredSales.length} sales found`}
            </div>
            
            <div className="flex items-center space-x-2">
              {(searchTerm || dateFilter || statusFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDateFilter('');
                    setStatusFilter('');
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Clear Filters
                </button>
              )}
              
              <Link href="/reports" className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-0">
        <div className="w-full overflow-auto scrollbar-thin" style={{ maxWidth: '100vw', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full table-auto">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" className="py-4 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative py-4 pl-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredSales.map((sale) => {
                const customer = getCustomerById(sale.customerId);
                
                return (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {new Date(sale.date).toLocaleDateString('en-US')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {sale.customerName || (getCustomerById(sale.customerId)?.name) || 'Walk-in Customer'}
                      {sale.customerPhone && <div className="text-xs text-gray-500">{sale.customerPhone}</div>}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(sale.paid)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                      <span className={sale.due > 0 ? 'text-red-600' : 'text-gray-900'}>
                        {formatCurrency(sale.due)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${sale.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          sale.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                        {sale.status === 'completed' ? 'Paid' : 
                         sale.status === 'partial' ? 'Partial' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-right text-sm font-medium px-3 py-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => viewSaleDetails(sale)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => updateSalePayment(sale)}
                          className="text-green-600 hover:text-green-800"
                          title="Update payment"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteSale(sale.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sale Modal */}
      {showNewSaleModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-gradient-to-b from-white to-gray-50 z-10">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-full text-white shadow-md mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">New Sale</h3>
              </div>
              <button 
                onClick={() => setShowNewSaleModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <form onSubmit={handleAddNewSale}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      required
                      value={newSale.customerName || ''}
                      onChange={(e) => setNewSale({...newSale, customerName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-gray-400 text-xs">(Optional)</span></label>
                    <input
                      type="tel"
                      value={newSale.customerPhone || ''}
                      onChange={(e) => setNewSale({...newSale, customerPhone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+92 XXX-XXXXXXX"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newSale.date}
                      onChange={(e) => setNewSale({...newSale, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                    <input
                      type="text"
                      readOnly
                      value={newSale.invoiceNumber}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated invoice number</p>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Item
                    </button>
                  </div>
                  
                  <div className="rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th scope="col" className="py-3 pl-2 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:pl-3">Product</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Quantity</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Unit Price</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Discount</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Total</th>
                            <th scope="col" className="relative py-3 pl-3 pr-2 w-12 sm:pr-3">
                              <span className="sr-only">Action</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {newSale.items.map((item, index) => {
                            const product = item.productId ? getProductById(item.productId) : null;
                            const itemPrice = parseFloat(item.price) || 0;
                            const itemQuantity = parseFloat(item.quantity) || 0;
                            const discountAmount = parseFloat(item.discount || 0);
                            const itemTotal = (itemQuantity * itemPrice) - discountAmount;
                            
                            return (
                              <tr key={index}>
                                <td className="py-2 pl-2 pr-3 sm:pl-3">
                                  <select
                                    required
                                    value={item.productId}
                                    onChange={(e) => updateSaleItem(index, 'productId', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                  >
                                    <option value="">Select Product</option>
                                    {products.map((product) => (
                                      <option key={product.id} value={product.id}>
                                        {product.name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-3 py-2 w-24">
                                  <input
                                    type="number"
                                    required
                                    min="1"
                                    max={product ? product.quantity : ''}
                                    value={item.quantity}
                                    onChange={(e) => updateSaleItem(index, 'quantity', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                    placeholder="Qty"
                                  />
                                  {product && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Stock: {product.quantity} {product.unit}
                                    </div>
                                  )}
                                </td>
                                <td className="px-3 py-2 w-32">
                                  <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    value={item.price}
                                    onChange={(e) => updateSaleItem(index, 'price', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                    placeholder="Price"
                                  />
                                </td>
                                <td className="px-3 py-2 w-24">
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.discount || ''}
                                    onChange={(e) => updateSaleItem(index, 'discount', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                    placeholder="Discount"
                                  />
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 w-24">
                                  {formatCurrency(itemTotal)}
                                </td>
                                <td className="py-2 pl-3 pr-2 whitespace-nowrap w-12 sm:pr-3">
                                  {index > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => removeItemFromSale(index)}
                                      className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-50"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-end">
                    <div className="w-full sm:w-72 space-y-3 bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Amount Paid:</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newSale.paid}
                          onChange={(e) => setNewSale({...newSale, paid: e.target.value})}
                          className="w-32 px-2 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Payment Method:</span>
                        <select
                          value={newSale.paymentMethod}
                          onChange={(e) => setNewSale({...newSale, paymentMethod: e.target.value})}
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
                        <span className={due > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                          {formatCurrency(due)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewSaleModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Record Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sale Details Modal */}
      {showSaleDetailsModal && selectedSale && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-gradient-to-b from-white to-gray-50 z-10">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-full text-white shadow-md mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">Invoice #{selectedSale.id}</h3>
              </div>
              <button 
                onClick={() => setShowSaleDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              {/* Invoice Header */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b border-blue-500 pb-6">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-xl mr-3 shadow-md w-12 h-12 flex items-center justify-center">
                      <span className="font-bold text-xl">CM</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">TAX INVOICE</h2>
                      <p className="text-gray-600">Manzoor Construction Material</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm min-w-[200px]">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-sm text-gray-600 font-medium">Invoice No:</div>
                    <div className="text-sm font-semibold text-right">{selectedSale.id}</div>
                    
                    <div className="text-sm text-gray-600 font-medium">Date:</div>
                    <div className="text-sm font-medium text-right">
                      {new Date(selectedSale.date).toLocaleDateString('en-US')}
                    </div>
                    
                    <div className="text-sm text-gray-600 font-medium">Status:</div>
                    <div className="text-right">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${selectedSale.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          selectedSale.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                        {selectedSale.status.charAt(0).toUpperCase() + selectedSale.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business and Invoice Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b">From</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-800 font-medium">Manzoor Construction Material</p>
                    <p className="text-sm text-gray-600">Chak No 11/1.A.L, Renala Khurd</p>
                    <p className="text-sm text-gray-600">Okara, Pakistan</p>
                    <p className="text-sm text-gray-600">+92 300 1234567</p>
                    <p className="text-sm text-gray-600">info@constructionshop.pk</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b">Bill To</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-800 font-medium">
                      {selectedSale.customerName || (getCustomerById(selectedSale.customerId)?.name) || 'Walk-in Customer'}
                    </p>
                    {selectedSale.customerPhone && (
                      <p className="text-sm text-gray-600">{selectedSale.customerPhone}</p>
                    )}
                    {getCustomerById(selectedSale.customerId)?.address && (
                      <p className="text-sm text-gray-600">{getCustomerById(selectedSale.customerId)?.address}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Items Table */}
              <div className="mb-8 overflow-hidden">
                <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                          <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                          <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {selectedSale.items.map((item, index) => {
                          const product = getProductById(item.productId);
                          const discountAmount = parseFloat(item.discount || 0);
                          const itemTotal = (item.quantity * item.price) - discountAmount;
                          
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                {product ? product.name : item.productId}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500 text-center">
                                {item.quantity} {product ? product.unit : ''}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500 text-right">
                                {formatCurrency(item.price)}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500 text-right">
                                {discountAmount > 0 ? formatCurrency(discountAmount) : '-'}
                              </td>
                              <td className="px-3 py-4 text-sm font-medium text-gray-900 text-right">
                                {formatCurrency(itemTotal)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Mobile List View */}
                  <div className="md:hidden p-4">
                    <div className="space-y-4">
                      {selectedSale.items.map((item, index) => {
                        const product = getProductById(item.productId);
                        const discountAmount = parseFloat(item.discount || 0);
                        const itemTotal = (item.quantity * item.price) - discountAmount;
                        
                        return (
                          <div key={index} className="border-b border-gray-200 pb-3">
                            <div className="font-medium">{product ? product.name : item.productId}</div>
                            <div className="flex justify-between mt-1">
                              <div className="text-sm text-gray-500">
                                {item.quantity} {product ? product.unit : ''} × {formatCurrency(item.price)}
                              </div>
                              <div className="text-sm font-medium">
                                {formatCurrency(itemTotal)}
                              </div>
                            </div>
                            {discountAmount > 0 && (
                              <div className="text-xs text-right text-green-600 mt-1">
                                Discount: {formatCurrency(discountAmount)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="flex justify-end mb-8">
                <div className="w-full sm:w-72 space-y-3 bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(selectedSale.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Amount Paid:</span>
                    <span className="font-medium text-green-600">{formatCurrency(selectedSale.paid)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="font-medium text-gray-700">Balance Due:</span>
                    <span className={selectedSale.due > 0 ? 'font-bold text-red-600' : 'font-bold text-green-600'}>
                      {formatCurrency(selectedSale.due)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Payment Method & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">Payment Details</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {selectedSale.status === 'completed' 
                      ? 'Paid' 
                      : selectedSale.status === 'partial' 
                        ? 'Partially Paid' 
                        : 'Unpaid'}
                  </p>
                  {selectedSale.paymentHistory && selectedSale.paymentHistory.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Last Payment Method:</span> {selectedSale.paymentHistory[selectedSale.paymentHistory.length - 1].paymentMethod}
                    </p>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600">Thank you for your business! All goods once sold cannot be returned.</p>
                </div>
              </div>
              
              {/* Payment History Section */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Payment History
                </h3>
                
                {selectedSale.paymentHistory && selectedSale.paymentHistory.length > 0 ? (
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg overflow-hidden shadow-md border border-gray-200">
                    {/* Desktop Payment History */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                            <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Due Before Payment</th>
                            <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance After Payment</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedSale.paymentHistory.map((payment, index) => {
                            // Calculate the due amount before this payment
                            const dueBeforePayment = payment.remainingBalance + payment.amount;
                            
                            return (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="py-3 pl-4 pr-3 text-sm text-gray-900">
                                  {new Date(payment.date).toLocaleString('en-US')}
                                </td>
                                <td className="px-3 py-3 text-sm font-medium text-green-600">
                                  +{formatCurrency(payment.amount)}
                                </td>
                                <td className="px-3 py-3 text-sm font-medium text-right text-red-600">
                                  {formatCurrency(dueBeforePayment)}
                                </td>
                                <td className="px-3 py-3 text-sm font-medium text-right text-gray-900">
                                  {formatCurrency(payment.remainingBalance)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Mobile Payment History */}
                    <div className="md:hidden p-4">
                      <div className="space-y-4">
                        {selectedSale.paymentHistory.map((payment, index) => {
                          // Calculate the due amount before this payment
                          const dueBeforePayment = payment.remainingBalance + payment.amount;
                          
                          return (
                            <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                              <div className="flex justify-between">
                                <div className="text-sm text-gray-500">
                                  {new Date(payment.date).toLocaleString('en-US')}
                                </div>
                                <div className="text-sm font-medium text-green-600">
                                  +{formatCurrency(payment.amount)}
                                </div>
                              </div>
                              <div className="flex justify-between mt-1 text-xs">
                                <span className="text-gray-500">Due Before:</span>
                                <span className="font-medium text-red-600">{formatCurrency(dueBeforePayment)}</span>
                              </div>
                              <div className="flex justify-between mt-1 text-xs">
                                <span className="text-gray-500">Balance After:</span>
                                <span className="font-medium">{formatCurrency(payment.remainingBalance)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                    No payment records found. Update payment information to track payment history.
                  </div>
                )}
              </div>
              
              {/* Footer & Buttons */}
              <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center pt-4 border-t border-gray-200">
                <div className="mt-4 md:mt-0">
                  <p className="text-xs text-gray-500">This is a computer generated invoice and does not require a signature.</p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-2 sm:space-x-3">
                  <button
                    onClick={printInvoice}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md hover:shadow-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm2 6a1 1 0 011-1h6a1 1 0 100-2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Print Invoice
                  </button>
                  <button
                    onClick={downloadInvoice}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors shadow-md hover:shadow-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download PDF
                  </button>
                  <button
                    onClick={() => setShowSaleDetailsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors text-gray-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Payment Modal */}
      {showUpdatePaymentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-2xl p-6 max-w-xl w-full border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-full text-white shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Update Payment</h2>
              </div>
              <button onClick={() => setShowUpdatePaymentModal(false)} className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sale Total</label>
                  <input
                    type="text"
                    disabled
                    value={formatCurrency(selectedSale.total)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Already Paid</label>
                  <input
                    type="text"
                    disabled
                    value={formatCurrency(selectedSale.paid)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className={selectedSale.due > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                      Remaining Balance
                    </span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formatCurrency(selectedSale.due)}
                    className={`w-full px-3 py-2 border rounded-md bg-gray-100 ${
                      selectedSale.due > 0 ? 'border-red-300 text-red-600 font-medium' : 'border-green-300 text-green-600 font-medium'
                    }`}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={updateSaleForm.customerName}
                  onChange={(e) => setUpdateSaleForm({...updateSaleForm, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
                <input
                  type="text"
                  value={updateSaleForm.customerPhone}
                  onChange={(e) => setUpdateSaleForm({...updateSaleForm, customerPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="+92 XXX-XXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Date & Time</label>
                <input
                  type="datetime-local"
                  value={updateSaleForm.date.replace('Z', '')}
                  onChange={(e) => setUpdateSaleForm({...updateSaleForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="md:col-span-2 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <h4 className="font-medium text-blue-800">New Payment Information</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Payment Amount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={updateSaleForm.paid}
                      onChange={(e) => setUpdateSaleForm({...updateSaleForm, paid: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total After Payment</label>
                    <input
                      type="text"
                      disabled
                      value={formatCurrency(parseFloat(selectedSale.paid) + parseFloat(updateSaleForm.paid || 0))}
                      className="w-full px-3 py-2 border border-green-300 rounded-md bg-green-50 text-green-600 font-medium"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-3 rounded-md bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Remaining Balance After Payment:</span>
                    <span className={parseFloat(selectedSale.total) - (parseFloat(selectedSale.paid) + parseFloat(updateSaleForm.paid || 0)) > 0 ? 'font-bold text-red-600' : 'font-bold text-green-600'}>
                      {formatCurrency(parseFloat(selectedSale.total) - (parseFloat(selectedSale.paid) + parseFloat(updateSaleForm.paid || 0)))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUpdatePaymentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmPaymentUpdate}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Update Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && saleToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-full text-white shadow-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-600">Confirm Delete</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-800">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-red-800">Warning</span>
                </div>
                <p className="text-sm ml-7">
                  Are you sure you want to delete this sale? This action cannot be undone and all associated data will be permanently removed.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Invoice Number:</div>
                  <div className="text-sm font-medium text-gray-800">{saleToDelete.id}</div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Customer:</div>
                  <div className="text-sm font-medium text-gray-800">
                    {saleToDelete.customerName || (getCustomerById(saleToDelete.customerId)?.name) || 'Walk-in Customer'}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Total Amount:</div>
                  <div className="text-sm font-medium text-gray-800">{formatCurrency(saleToDelete.total)}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSale}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors shadow-md hover:shadow-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 